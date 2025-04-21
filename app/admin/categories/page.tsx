"use client"

import Link from "next/link"
import Image from "next/image"
import { createServerClientSafe } from "@/lib/supabase/server-safe"
import { Plus, Edit, Trash2 } from "lucide-react"
import type { Category } from "@/lib/types"

async function getCategories() {
  const supabase = createServerClientSafe()

  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    console.error("Ошибка при загрузке категорий:", error)
    return []
  }

  return data as Category[]
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление категориями</h1>
        <Link href="/admin/categories/new" className="bg-gray-800 text-white px-4 py-2 rounded-md flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Добавить категорию
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
                  Категория
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Slug
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
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 relative">
                        <Image
                          src={
                            category.image_url ||
                            `/placeholder.svg?height=40&width=40&query=${encodeURIComponent(category.name)}`
                          }
                          alt={category.name}
                          fill
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{category.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/admin/categories/${category.id}`} className="text-indigo-600 hover:text-indigo-900">
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

              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    Категории не найдены. Добавьте первую категорию.
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
