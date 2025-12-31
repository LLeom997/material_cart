
import { useState } from "react"
import { supabase } from "../lib/supabase"

export const useImageUpload = (logAction: (action: string, resource: string, metadata: any) => Promise<void>) => {
  const [loading, setLoading] = useState(false)

  const upload = async (file: File, bucket = "product_images") => {
    setLoading(true)
    const ext = file.name.split(".").pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${ext}`
    const filePath = `product_visuals/${fileName}`

    try {
      // Step 1: Check authentication state
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Authentication session missing. Please re-login as admin.");
      }

      // Step 2: Perform the upload with explicit content type
      // Standardizing on 'product_images' bucket.
      // NOTE: If this fails with RLS error, you MUST go to Supabase Dashboard -> Storage -> product_images -> Policies
      // and add a policy: "Allow Authenticated users to INSERT objects"
      const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'image/jpeg'
      })
      
      if (error) {
        console.group("Supabase Storage Error Debug");
        console.error("Error Message:", error.message);
        console.error("Bucket:", bucket);
        console.error("Target Path:", filePath);
        console.info("Suggested Fix: Run this in Supabase SQL Editor:");
        console.info(`
          -- 1. Create bucket if not exists
          -- insert into storage.buckets (id, name, public) values ('product_images', 'product_images', true);
          
          -- 2. Allow public access to read
          CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'product_images' );
          
          -- 3. Allow authenticated users to upload
          CREATE POLICY "Admin Upload Access" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'product_images' AND auth.role() = 'authenticated' );
        `);
        console.groupEnd();
        throw error;
      }

      // Step 3: Retrieve public URL
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath)
      
      // Step 4: Audit Log
      try {
        await logAction("IMAGE_UPLOAD", "STORAGE", { 
          url: publicUrl, 
          bucket, 
          path: filePath,
          mimeType: file.type 
        })
      } catch (logError) {
        console.warn("Audit logging failed after successful upload:", logError)
      }
      
      return publicUrl
    } catch (e: any) {
      console.error("Upload process failed:", e.message || e)
      
      // Provide a more actionable error message to the user
      const userMessage = e.message?.includes('RLS') || e.message?.includes('violates')
        ? `Permissions Error: The 'product_images' bucket requires an 'INSERT' policy for authenticated users in your Supabase dashboard.`
        : `Upload failed: ${e.message || "Unknown error"}`;
        
      alert(userMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { upload, loading }
}
