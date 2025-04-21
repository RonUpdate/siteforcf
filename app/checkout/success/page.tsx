"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, ArrowRight } from "lucide-react"
import { supabaseClient } from "@/lib/supabase/client"
import type { Order } from "@/lib/types"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return

      try {
        const { data, error } = await supabaseClient().from("orders").select("*").eq("id", orderId).single()

        if (error) throw error
        setOrder(data as Order)
      } catch (error) {
        console.error("Ошибка при загрузке заказа:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4 py-12">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800"></div>
          <p className="text-gray-600">Загрузка информации о заказе...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="mb-4 text-2xl font-bold">Заказ не найден</h1>
          <p className="mb-6 text-gray-600">
            К сожалению, информация о вашем заказе не найдена. Пожалуйста, свяжитесь с нами для уточнения деталей.
          </p>
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Вернуться на главную
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="mb-2 text-center text-2xl font-bold">Заказ успешно оформлен!</h1>
        <p className="mb-6 text-center text-gray-600">
          Спасибо за ваш заказ. Мы отправили подтверждение на вашу электронную почту.
        </p>

        <div className="mb-6 rounded-lg bg-gray-50 p-4">
          <h2 className="mb-2 text-lg font-semibold">Информация о заказе</h2>
          <p className="mb-1">
            <span className="font-medium">Номер заказа:</span> {order.id}
          </p>
          <p className="mb-1">
            <span className="font-medium">Дата:</span>{" "}
            {new Date(order.created_at).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p className="mb-1">
            <span className="font-medium">Статус:</span>{" "}
            {order.status === "pending" ? "Ожидает обработки" : order.status}
          </p>
          <p className="mb-1">
            <span className="font-medium">Способ оплаты:</span>{" "}
            {order.payment_method === "cash"
              ? "Наличными при получении"
              : order.payment_method === "card"
                ? "Картой при получении"
                : "Банковский перевод"}
          </p>
          <p>
            <span className="font-medium">Сумма:</span> {order.total_amount.toLocaleString()} ₽
          </p>
        </div>

        <div className="mb-6">
          <h2 className="mb-2 text-lg font-semibold">Что дальше?</h2>
          <p className="mb-4 text-gray-600">
            Мы обработаем ваш заказ в ближайшее время и свяжемся с вами для подтверждения деталей доставки. Вы можете
            следить за статусом вашего заказа в личном кабинете.
          </p>
        </div>

        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Вернуться на главную
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Продолжить покупки
          </Link>
        </div>
      </div>
    </div>
  )
}
