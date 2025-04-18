import { createClient } from "@/utils/supabase/server"
import ProductForm from "../../[action]/product-form"
import { notFound } from "next/navigation"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Получаем данные продукта
  const { data: product, error } = await supabase.from("products").select("*").eq("id", params.id).single()

  if (error || !product) {
    console.error("Ошибка при получении продукта:", error)
    notFound()
  }

  // Получаем категории для выпадающего списка
  const { data: categories } = await supabase.from("categories").select("id, title").order("title")

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Редактирование продукта</h1>
      <ProductForm product={product} categories={categories || []} action="edit" />
    </div>
  )
}
