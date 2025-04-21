import { createServerClientSafe } from "@/lib/supabase/server-safe"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/types"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params
  const supabase = createServerClientSafe()

  // Получаем категорию по slug
  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single()

  if (categoryError || !category) {
    notFound()
  }

  // Получаем товары для этой категории
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select(
      `
      *,
      images:product_images(*)
    `,
    )
    .eq("category_id", category.id)
    .order("created_at", { ascending: false })

  if (productsError) {
    console.error("Ошибка при загрузке товаров:", productsError)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/categories" className="text-sm text-gray-600 hover:text-gray-900">
          ← Назад к категориям
        </Link>
      </div>

      <h1 className="mb-2 text-2xl font-bold">{category.name}</h1>
      {category.description && <p className="mb-8 text-gray-600">{category.description}</p>}

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">В этой категории пока нет товаров</h2>
          <p className="text-gray-600">Пожалуйста, загляните позже или выберите другую категорию.</p>
          <Link
            href="/products"
            className="mt-4 inline-block rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Смотреть все товары
          </Link>
        </div>
      )}
    </div>
  )
}
