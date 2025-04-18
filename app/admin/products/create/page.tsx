import ProductForm from "../[action]/product-form"

export default async function CreateProductPage() {
  const { createServerClient } = await import("@/utils/supabase/server")
  const supabase = await createServerClient()

  // Получаем категории для выпадающего списка
  const { data: categories } = await supabase.from("categories").select("id, title").order("title")

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Создание нового продукта</h1>
      <ProductForm categories={categories || []} action="create" />
    </div>
  )
}
