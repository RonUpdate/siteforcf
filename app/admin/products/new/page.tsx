import { createServerClient } from "@/lib/supabase/server"
import ProductForm from "../components/product-form"

async function getCategories() {
  const supabase = createServerClient()

  const { data } = await supabase.from("categories").select("*").order("name")

  return data || []
}

export default async function NewProductPage() {
  const categories = await getCategories()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Добавить новый товар</h1>
      <ProductForm categories={categories} />
    </div>
  )
}
