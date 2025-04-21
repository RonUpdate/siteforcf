"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CreditCard, Truck, AlertCircle } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { supabaseClient } from "@/lib/supabase/client"
import type { PaymentMethod } from "@/lib/types"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_address: "",
    payment_method: "cash" as PaymentMethod,
    notes: "",
  })

  if (items.length === 0) {
    router.push("/cart")
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Создаем заказ
      const { data: order, error: orderError } = await supabaseClient()
        .from("orders")
        .insert({
          ...formData,
          total_amount: totalPrice,
          status: "pending",
          payment_status: "pending",
        })
        .select("id")
        .single()

      if (orderError) throw orderError

      // Создаем элементы заказа
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.discount_price || item.product.price,
      }))

      const { error: itemsError } = await supabaseClient().from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      // Очищаем корзину и перенаправляем на страницу подтверждения
      clearCart()
      router.push(`/checkout/success?order_id=${order.id}`)
    } catch (error: any) {
      console.error("Ошибка при оформлении заказа:", error)
      setError("Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте снова.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Оформление заказа</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Контактная информация</h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700">
                    Имя и фамилия
                  </label>
                  <input
                    type="text"
                    id="customer_name"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="customer_email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    id="customer_phone"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Адрес доставки</h2>

              <div>
                <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700">
                  Полный адрес
                </label>
                <textarea
                  id="shipping_address"
                  name="shipping_address"
                  value={formData.shipping_address}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                  placeholder="Город, улица, дом, квартира, индекс"
                />
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Способ оплаты</h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="payment_cash"
                    name="payment_method"
                    type="radio"
                    value="cash"
                    checked={formData.payment_method === "cash"}
                    onChange={handleChange}
                    className="h-4 w-4 border-gray-300 text-gray-600 focus:ring-gray-500"
                  />
                  <label htmlFor="payment_cash" className="ml-3 block text-sm font-medium text-gray-700">
                    Наличными при получении
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="payment_card"
                    name="payment_method"
                    type="radio"
                    value="card"
                    checked={formData.payment_method === "card"}
                    onChange={handleChange}
                    className="h-4 w-4 border-gray-300 text-gray-600 focus:ring-gray-500"
                  />
                  <label htmlFor="payment_card" className="ml-3 block text-sm font-medium text-gray-700">
                    Картой при получении
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="payment_bank_transfer"
                    name="payment_method"
                    type="radio"
                    value="bank_transfer"
                    checked={formData.payment_method === "bank_transfer"}
                    onChange={handleChange}
                    className="h-4 w-4 border-gray-300 text-gray-600 focus:ring-gray-500"
                  />
                  <label htmlFor="payment_bank_transfer" className="ml-3 block text-sm font-medium text-gray-700">
                    Банковский перевод
                  </label>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Дополнительная информация</h2>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Комментарий к заказу
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                  placeholder="Дополнительная информация по заказу"
                />
              </div>
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

            <div className="flex justify-between">
              <Link
                href="/cart"
                className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться в корзину
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                {loading ? "Оформление..." : "Оформить заказ"}
              </button>
            </div>
          </form>
        </div>

        <div className="md:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Ваш заказ</h2>

            <div className="max-h-80 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="mb-4 flex items-start">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={
                        item.product.images?.find((img) => img.is_primary)?.image_url ||
                        "/placeholder.svg?height=64&width=64&query=product" ||
                        "/placeholder.svg"
                      }
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium">{item.product.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.quantity} x {(item.product.discount_price || item.product.price).toLocaleString()} ₽
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Сумма</span>
                <span>{totalPrice.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Доставка</span>
                <span>Бесплатно</span>
              </div>
              <div className="mt-2 border-t border-gray-200 pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Итого</span>
                  <span>{totalPrice.toLocaleString()} ₽</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <Truck className="mr-2 h-5 w-5" />
                <span>Бесплатная доставка при заказе от 5000 ₽</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CreditCard className="mr-2 h-5 w-5" />
                <span>Безопасная оплата</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
