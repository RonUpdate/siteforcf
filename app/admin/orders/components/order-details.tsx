"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, User, MapPin, Package, AlertCircle } from "lucide-react"
import { supabaseClient } from "@/lib/supabase/client"
import type { Order, OrderItem, OrderStatus, PaymentStatus } from "@/lib/types"

interface OrderDetailsProps {
  order: Order
  orderItems: OrderItem[]
}

export default function OrderDetails({ order, orderItems }: OrderDetailsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(order.status)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order.payment_status)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus
    setOrderStatus(newStatus)
    await updateOrder({ status: newStatus })
  }

  const handlePaymentStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as PaymentStatus
    setPaymentStatus(newStatus)
    await updateOrder({ payment_status: newStatus })
  }

  const updateOrder = async (updates: Partial<Order>) => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabaseClient().from("orders").update(updates).eq("id", order.id)

      if (error) throw error
      router.refresh()
    } catch (error: any) {
      console.error("Ошибка при обновлении заказа:", error)
      setError("Произошла ошибка при обновлении заказа")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/orders" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Назад к списку заказов
        </Link>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Ошибка</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Информация о заказе</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">ID заказа</p>
                <p className="font-mono">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Дата заказа</p>
                <p>{formatDate(order.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Статус заказа</p>
                <div className="mt-1">
                  <select
                    value={orderStatus}
                    onChange={handleStatusChange}
                    disabled={loading}
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                  >
                    <option value="pending">Ожидает</option>
                    <option value="processing">Обрабатывается</option>
                    <option value="shipped">Отправлен</option>
                    <option value="delivered">Доставлен</option>
                    <option value="cancelled">Отменен</option>
                  </select>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Статус оплаты</p>
                <div className="mt-1">
                  <select
                    value={paymentStatus}
                    onChange={handlePaymentStatusChange}
                    disabled={loading}
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                  >
                    <option value="pending">Ожидает оплаты</option>
                    <option value="paid">Оплачен</option>
                    <option value="failed">Ошибка оплаты</option>
                    <option value="refunded">Возврат</option>
                  </select>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Способ оплаты</p>
                <p className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4 text-gray-400" />
                  {order.payment_method === "cash"
                    ? "Наличными при получении"
                    : order.payment_method === "card"
                      ? "Картой при получении"
                      : "Банковский перевод"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Сумма заказа</p>
                <p className="text-lg font-semibold">{order.total_amount.toLocaleString()} ₽</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Товары в заказе</h2>

            <div className="divide-y divide-gray-200">
              {orderItems.map((item) => (
                <div key={item.id} className="py-4 flex items-start">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                    {item.product?.images?.find((img) => img.is_primary)?.image_url ? (
                      <Image
                        src={item.product.images.find((img) => img.is_primary)?.image_url || ""}
                        alt={item.product?.name || ""}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium">
                      {item.product ? (
                        <Link href={`/admin/products/${item.product.id}`} className="hover:text-gray-800">
                          {item.product.name}
                        </Link>
                      ) : (
                        <span>Товар не найден</span>
                      )}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.quantity} x {item.price.toLocaleString()} ₽
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{(item.quantity * item.price).toLocaleString()} ₽</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Итого</span>
                <span className="text-lg font-semibold">{order.total_amount.toLocaleString()} ₽</span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-2 text-lg font-semibold">Комментарий к заказу</h2>
              <p className="text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Информация о клиенте</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Имя</p>
                <p className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-gray-400" />
                  {order.customer_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {order.customer_email}
                </p>
              </div>
              {order.customer_phone && (
                <div>
                  <p className="text-sm text-gray-500">Телефон</p>
                  <p className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {order.customer_phone}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Адрес доставки</h2>
            <p className="flex items-start">
              <MapPin className="mr-2 h-4 w-4 text-gray-400 mt-1" />
              <span className="whitespace-pre-line">{order.shipping_address}</span>
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Действия</h2>
            <div className="space-y-2">
              <button
                onClick={() => window.print()}
                className="w-full flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Распечатать заказ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
