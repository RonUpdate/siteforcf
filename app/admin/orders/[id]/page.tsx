import { createServerClientSafe } from "@/lib/supabase/server-safe"
import OrderDetails from "../components/order-details"
import type { Order, OrderItem } from "@/lib/types"

interface OrderPageProps {
  params: {
    id: string
  }
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = params
  const supabase = createServerClientSafe()

  // Получаем заказ
  const { data: order, error: orderError } = await supabase.from("orders").select("*").eq("id", id).single()

  if (orderError) {
    console.error("Ошибка при загрузке заказа:", orderError)
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Заказ не найден</h1>
        <p className="text-gray-600">Заказ с ID {id} не найден или произошла ошибка при загрузке.</p>
      </div>
    )
  }

  // Получаем элементы заказа
  const { data: orderItems, error: itemsError } = await supabase
    .from("order_items")
    .select("*, product:products(*)")
    .eq("order_id", id)

  if (itemsError) {
    console.error("Ошибка при загрузке элементов заказа:", itemsError)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Детали заказа</h1>
      <OrderDetails order={order as Order} orderItems={orderItems as OrderItem[]} />
    </div>
  )
}
