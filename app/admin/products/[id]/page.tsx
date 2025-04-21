import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import ProductForm from "../components/product-form"
import type { Product } from "@/lib/types"

interface ProductPageProps {
  params: {
    id: string
  }
}

async function getProduct(id: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      images:product_images(*)
    `)
    .eq("id", id)
    .single()

  if (error || !data) {
    return null
  }

  return data as Product & { images: any[] }
}

async function getCategories() {
  const supabase = createServerClient()

  const { data } = await supabase.from("categories").select("*").order("name")

  return data || []
}

export default async function EditProductPage({ params }: ProductPageProps) {
  const [product, categories] = await Promise.all([getProduct(params.id), getCategories()])

  if (!product) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Редактировать товар</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  )
}
