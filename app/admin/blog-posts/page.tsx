import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, Trash2, ArrowLeft } from "lucide-react"
import { deleteBlogPost } from "./actions"
import DeleteButton from "@/components/delete-button"
import { formatDate } from "@/utils/date-utils"

export default async function BlogPostsPage() {
  const supabase = createClient()
  const { data: blogPosts, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Ошибка при получении блог-постов:", error)
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/admin" className="mr-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к админ-панели
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Управление блогом</h1>
      </div>

      <div className="mb-6">
        <Link href="/admin/blog-posts/create">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Создать статью
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Заголовок
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Слаг</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата создания
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {blogPosts && blogPosts.length > 0 ? (
              blogPosts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{post.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 font-mono">{post.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(post.created_at)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/admin/blog-posts/edit?id=${post.id}`}>
                        <Button variant="outline" size="sm">
                          <Pencil className="h-4 w-4 mr-2" />
                          Редактировать
                        </Button>
                      </Link>
                      <DeleteButton id={post.id} name={post.title} deleteFunction={deleteBlogPost} entityName="статью">
                        <span className="flex items-center">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Удалить
                        </span>
                      </DeleteButton>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  Статьи не найдены
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
