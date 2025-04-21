import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import CategoryForm from "./category-form"
import SlugInfo from "@/components/slug-info"

interface CategoryPageProps {
  params: {
    action: string
    id?: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { action, id } = params

  // Проверяем, что действие допустимо
  if (action !== "create" && action !== "edit") {
    notFound()
  }

  // Если действие - редактирование, получаем данные категории
  let category = null
  if (action === "edit" && id) {
    const supabase = createClient()
    const { data, error } = await supabase.from("categories").select("*").eq("id", id).single()

    if (error || !data) {
      notFound()
    }

    category = data
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {action === "create" ? "Создание категории" : "Редактирование категории"}
      </h1>

      <SlugInfo className="mb-6" />

      <CategoryForm category={category} action={action as "create" | "edit"} />
    </div>
  )
}
