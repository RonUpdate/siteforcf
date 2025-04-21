import { createServerClientSafe } from "@/lib/supabase/server-safe"
import OrdersTable from "./components/orders-table"
import type { Order } from "@/lib/types"

export default async function OrdersPage() {
  const supabase = createServerClientSafe()
  const { data: orders, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Ошибка при загрузке заказов:", error)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Управление заказами</h1>
      <OrdersTable orders={(orders as Order[]) || []} />
    </div>
  )
}
