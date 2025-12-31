
import { useEffect, useState, useCallback } from "react"
import { supabase } from "../lib/supabase"
import { useApp } from "../App"
import { Enquiry, Product, Vendor, Profile, LedgerEntry, AuditLog } from "../types"

export const useAdminData = (isAdmin: boolean) => {
  const { fetchEnquiries, enquiries } = useApp()
  const [data, setData] = useState({
    products: [] as Product[],
    vendors: [] as Vendor[],
    customers: [] as Profile[],
    ledger: [] as LedgerEntry[],
    audit: [] as AuditLog[]
  })
  const [isLoading, setIsLoading] = useState(false)

  const loadData = useCallback(async () => {
    if (!isAdmin) return
    setIsLoading(true)
    try {
      const [p, v, c, l, a] = await Promise.all([
        supabase.from("products").select("*").order("name"),
        supabase.from("vendors").select("*").order("name"),
        supabase.from("profiles").select("*").order("full_name"),
        supabase.from("ledger").select("*").order("created_at", { ascending: false }),
        supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(100)
      ])
      
      const mappedProducts: Product[] = (p.data || []).map((prod: any) => ({
        ...prod,
        price_range: prod.price_range || "₹0"
      }));

      setData({
        products: mappedProducts,
        vendors: v.data?.map(x => ({ ...x, isActive: x.is_active })) || [],
        customers: c.data || [],
        ledger: l.data || [],
        audit: a.data || []
      })
      await fetchEnquiries()
    } catch (e) {
      console.error("Failed to sync admin state:", e)
    } finally {
      setIsLoading(false)
    }
  }, [isAdmin, fetchEnquiries])

  useEffect(() => { loadData() }, [loadData])

  return { ...data, enquiries, loadData, isLoading }
}
