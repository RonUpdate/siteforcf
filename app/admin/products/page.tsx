"use client"

import { createServerClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { Plus, Edit, Trash2 } from "lucide-react"
import type { Product, Category } from "@/lib/types"

async function getProducts() {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      images:product_images(*)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data as (Product & { category: Category; images: any[] })[]
}

export default async function AdminProducts() {
  const products = await getProducts()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление товарами</h1>
        <Link href="/admin/products/new" className="bg-gray-800 text-white px-4 py-2 rounded-md flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Добавить товар
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Товар
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Категория
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Цена
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Наличие
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Статус
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 relative">
                        <Image
                          src={
                            product.images?.find((img) => img.is_primary)?.image_url ||
                            `/placeholder.svg?height=40&width=40&query=${encodeURIComponent(product.name) || "/placeholder.svg"}`
                          }
                          alt={product.name}
                          fill
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.category?.name || "Без категории"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.discount_price ? (
                        <>
                          <span className="line-through text-gray-500">{product.price} ₽</span>
                          <span className="ml-2 text-red-600">{product.discount_price} ₽</span>
                        </>
                      ) : (
                        <span>{product.price} ₽</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.stock} шт.</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.featured ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {product.featured ? "Популярный" : "Обычный"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/admin/products/${product.id}`} className="text-indigo-600 hover:text-indigo-900">
                        <Edit className="h-5 w-5" />
                        <span className="sr-only">Редактировать</span>
                      </Link>
                      <button className="text-red-600 hover:text-red-900" onClick={() => {}}>
                        <Trash2 className="h-5 w-5" />
                        <span className="sr-only">Удалить</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Товары не найдены. Добавьте первый товар.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
