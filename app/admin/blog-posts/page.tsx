"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Plus, Edit, Trash2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { AdminNotifications } from "@/components/notifications"

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  image_url?: string
  created_at: string
}

export default function BlogPostsPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Загружаем блог-посты при монтировании компонента
  useEffect(() => {
    fetchBlogPosts()
  }, [])

  // Функция для загрузки блог-постов
  const fetchBlogPosts = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

      if (error) throw error

      setBlogPosts(data || [])
    } catch (error: any) {
      console.error("Error fetching blog posts:", error)
      setError("Ошибка при загрузке блог-постов")
    } finally {
      setLoading(false)
    }
  }

  // Функция для удаления блог-поста
  const handleDelete = async (id: string, title: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот блог-пост?")) return

    setDeleting(id)
    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id)

      if (error) throw error

      // Обновляем список блог-постов после удаления
      setBlogPosts((prevBlogPosts) => prevBlogPosts.filter((post) => post.id !== id))

      // Добавляем параметры для уведомления об успешном удалении
      router.push(`/admin/blog-posts?success=true&action=delete&type=blog&title=${encodeURIComponent(title)}`)
    } catch (error: any) {
      console.error("Error deleting blog post:", error)
      alert("Ошибка при удалении блог-поста")
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
      <AdminNotifications />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Управление блог-постами</h1>
        <Link href="/admin/blog-posts/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Добавить статью
          </Button>
        </Link>
      </div>

      {error && <div className="bg-red-100 text-red-600 p-4 rounded-md mb-6">{error}</div>}

      {blogPosts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-gray-500 mb-4">Блог-посты не найдены</p>
            <Link href="/admin/blog-posts/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Добавить первую статью
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
                    Заголовок
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Изображение
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
                {blogPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{post.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{post.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {post.image_url ? (
                        <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-100">
                          <img
                            src={post.image_url || "/placeholder.svg"}
                            alt={post.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">—</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/blog-posts/${post.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Редактировать</span>
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(post.id, post.title)}
                          disabled={deleting === post.id}
                        >
                          {deleting === post.id ? (
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
