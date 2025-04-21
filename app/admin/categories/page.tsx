import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, Trash2, ArrowLeft } from "lucide-react"
import { deleteCategory } from "./actions"
import DeleteButton from "@/components/delete-button"

export default async function CategoriesPage() {
  const supabase = createClient()
  const { data: categories, error } = await supabase.from("categories").select("*").order("title", { ascending: true })

  if (error) {
    console.error("Ошибка при получении категорий:", error)
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
        <h1 className="text-3xl font-bold">Управление категориями</h1>
      </div>

      <div className="mb-6">
        <Link href="/admin/categories/create">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Создать категорию
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Название
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Слаг</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{category.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 font-mono">{category.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/admin/categories/edit?id=${category.id}`}>
                        <Button variant="outline" size="sm">
                          <Pencil className="h-4 w-4 mr-2" />
                          Редактировать
                        </Button>
                      </Link>
                      <DeleteButton
                        id={category.id}
                        name={category.title}
                        deleteFunction={deleteCategory}
                        entityName="категорию"
                      >
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
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                  Категории не найдены
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
