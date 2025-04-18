"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Plus, Edit, Trash2, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { AdminNotifications } from "@/components/notifications"

interface Product {
  id: string
  title: string
  description: string
  image_url?: string
  external_url?: string
  category_id: string
  categories?: {
    id: string
    title: string
  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  // Загружаем продукты при монтировании компонента
  useEffect(() => {
    fetchProducts()
  }, [])

  // Функция для загрузки продуктов
  const fetchProducts = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id, 
          title, 
          description, 
          image_url, 
          external_url,
          category_id,
          categories (
            id, 
            title
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      setProducts(data || [])
    } catch (error: any) {
      console.error("Error fetching products:", error)
      setError("Ошибка при загрузке продуктов")
    } finally {
      setLoading(false)
    }
  }

  // Функция для удаления продукта
  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот продукт?")) return

    setDeleting(id)
    try {
      const { error } = await supabase.from("products").delete().eq("id", id)

      if (error) throw error

      // Обновляем список продуктов после удаления
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id))

      // Показываем уведомление об успешном удалении
      router.push("/admin/products?success=true&action=delete&type=product")
      router.refresh()
    } catch (error: any) {
      console.error("Error deleting product:", error)
      alert("Ошибка при удалении продукта")
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
      {/* Компонент для отображения уведомлений */}
      <AdminNotifications />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Управление продуктами</h1>
        <Link href="/admin/products/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Добавить продукт
          </Button>
        </Link>
      </div>

      {error && <div className="bg-red-100 text-red-600 p-4 rounded-md mb-6">{error}</div>}

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-gray-500 mb-4">Продукты не найдены</p>
            <Link href="/admin/products/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Добавить первый продукт
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
                    Категория
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Изображение
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Внешняя ссылка
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{product.categories?.title || "—"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.image_url ? (
                        <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-100">
                          <img
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">—</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.external_url ? (
                        <a
                          href={product.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Ссылка
                        </a>
                      ) : (
                        <div className="text-sm text-gray-500">—</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/products/edit/${product.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Редактировать</span>
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          disabled={deleting === product.id}
                        >
                          {deleting === product.id ? (
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
