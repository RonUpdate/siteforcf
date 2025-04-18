"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Plus, Edit, Trash2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { AdminNotifications } from "@/components/notifications"

interface Category {
  id: string
  title: string
  slug: string
  created_at: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Загружаем категории при монтировании компонента
  useEffect(() => {
    fetchCategories()
  }, [])

  // Функция для загрузки категорий
  const fetchCategories = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.from("categories").select("*").order("title")

      if (error) throw error

      setCategories(data || [])
    } catch (error: any) {
      console.error("Error fetching categories:", error)
      setError("Ошибка при загрузке категорий")
    } finally {
      setLoading(false)
    }
  }

  // Функция для удаления категории
  const handleDelete = async (id: string, title: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту категорию? Это также удалит все связанные продукты.")) return

    setDeleting(id)
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id)

      if (error) throw error

      // Обновляем список категорий после удаления
      setCategories((prevCategories) => prevCategories.filter((category) => category.id !== id))

      // Добавляем параметры для уведомления об успешном удалении
      router.push(`/admin/categories?success=true&action=delete&type=category&title=${encodeURIComponent(title)}`)
      router.refresh()
    } catch (error: any) {
      console.error("Error deleting category:", error)
      alert("Ошибка при удалении категории. Возможно, с ней связаны продукты.")
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div>
      {/* Добавляем компонент уведомлений */}
      <AdminNotifications />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Управление категориями</h1>
        <Link href="/admin/categories/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Добавить категорию
          </Button>
        </Link>
      </div>

      {error && <div className="bg-red-100 text-red-600 p-4 rounded-md mb-6">{error}</div>}

      {categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-gray-500 mb-4">Категории не найдены</p>
            <Link href="/admin/categories/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Добавить первую категорию
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Название
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата создания
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{category.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{category.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{new Date(category.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/categories/${category.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Редактировать</span>
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(category.id, category.title)}
                          disabled={deleting === category.id}
                        >
                          {deleting === category.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          <span className="sr-only">Удалить</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
