"use client"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react"
import { useCart } from "@/context/cart-context"

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400" />
          <h1 className="text-2xl font-bold">Ваша корзина пуста</h1>
          <p className="text-gray-600">Добавьте товары в корзину, чтобы продолжить покупки</p>
          <Link
            href="/products"
            className="flex items-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Вернуться к покупкам
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Корзина</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="p-4">
              <h2 className="text-lg font-semibold">Товары в корзине ({totalItems})</h2>
            </div>

            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-4">
                  <div className="sm:col-span-1">
                    <div className="relative h-24 w-24 overflow-hidden rounded-md">
                      <Image
                        src={
                          item.product.images?.find((img) => img.is_primary)?.image_url ||
                          "/placeholder.svg?height=96&width=96&query=product" ||
                          "/placeholder.svg"
                        }
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-sm font-medium">
                          <Link href={`/products/${item.product.slug}`} className="hover:text-gray-800">
                            {item.product.name}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.product.discount_price ? (
                            <span className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">
                                {item.product.discount_price.toLocaleString()} ₽
                              </span>
                              <span className="text-xs line-through">{item.product.price.toLocaleString()} ₽</span>
                            </span>
                          ) : (
                            <span className="font-medium text-gray-900">{item.product.price.toLocaleString()} ₽</span>
                          )}
                        </p>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label="Удалить товар"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="rounded-l-md border border-gray-300 p-1 hover:bg-gray-100"
                        aria-label="Уменьшить количество"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="flex w-10 items-center justify-center border-y border-gray-300 px-2 py-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="rounded-r-md border border-gray-300 p-1 hover:bg-gray-100"
                        aria-label="Увеличить количество"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Сумма заказа</h2>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Товары ({totalItems})</span>
                <span>{totalPrice.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Доставка</span>
                <span>Бесплатно</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Итого</span>
                  <span>{totalPrice.toLocaleString()} ₽</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="mt-4 w-full rounded-md bg-gray-800 px-4 py-2 text-center text-sm font-medium text-white hover:bg-gray-700"
            >
              Оформить заказ
            </button>

            <div className="mt-4">
              <Link
                href="/products"
                className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Продолжить покупки
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
