
import { supabase } from "../lib/supabase"

export const useCRUD = (logAction: (action: string, resource: string, metadata: any) => Promise<void>) => {
  const save = async (table: string, payload: any) => {
    const { error } = await supabase.from(table).upsert(payload)
    if (error) {
      console.error(`CRUD Error (UPSERT) on ${table}:`, error.message);
      alert(`Database Error: ${error.message}. Ensure RLS policies are enabled for ${table}.`);
    } else {
      await logAction("UPSERT", table.toUpperCase(), { id: payload.id || 'NEW', name: payload.name || payload.full_name })
    }
    return { success: !error, error }
  }

  const remove = async (table: string, id: string, field = "id") => {
    const { error } = await supabase.from(table).delete().eq(field, id)
    if (error) {
      console.error(`CRUD Error (DELETE) on ${table}:`, error.message);
      alert(`Database Error: ${error.message}`);
    } else {
      await logAction("DELETE", table.toUpperCase(), { id })
    }
    return { success: !error, error }
  }

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('order_id', orderId)
    if (error) {
      console.error(`CRUD Error (STATUS_UPDATE) on orders:`, error.message);
      alert(`Database Error: ${error.message}`);
    } else {
      await logAction("STATUS_UPDATE", "ORDER", { id: orderId, to: status })
    }
    return { success: !error, error }
  }

  return { save, remove, updateStatus }
}
