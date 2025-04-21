import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import ProductForm from "./product-form"
import SlugInfo from "@/components/slug-info"

interface ProductPageProps {
  params: {
    action: string
    id?: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { action, id } = params

  // Проверяем, что действие допустимо
  if (action !== "create" && action !== "edit") {
    notFound()
  }

  const supabase = createClient()

  // Получаем список категорий
  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("id, title")
    .order("title", { ascending: true })

  if (categoriesError) {
    console.error("Ошибка при получении категорий:", categoriesError)
  }

  // Если действие - редактирование, получаем данные продукта
  let product = null
  if (action === "edit" && id) {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error || !data) {
      notFound()
    }

    product = data
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {action === "create" ? "Создание продукта" : "Редактирование продукта"}
      </h1>

      <SlugInfo className="mb-6" />

      <ProductForm product={product} categories={categories || []} action={action as "create" | "edit"} />
    </div>
  )
}
