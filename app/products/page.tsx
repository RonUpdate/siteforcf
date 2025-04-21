import { Suspense } from "react"
import { createServerClientSafe, fetchWithCache } from "@/lib/supabase/server-safe"
import { Loading } from "@/components/ui/loading"
import { Pagination } from "@/components/ui/pagination"
import Link from "next/link"
import Image from "next/image"
import type { Product, Category } from "@/lib/types"

// Функция для получения продуктов с пагинацией
async function getProducts(page = 1, pageSize = 12) {
  const supabase = createServerClientSafe()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  // Получаем продукты с пагинацией
  const products = await fetchWithCache(
    () =>
      supabase
        .from("products")
        .select(
          `
        *,
        category:categories(*),
        images:product_images(*)
      `,
          { count: "exact" },
        )
        .order("created_at", { ascending: false })
        .range(from, to),
    `products-page-${page}`,
    { data: [], count: 0 },
  )

  return {
    products: products.data as (Product & { category: Category; images: any[] })[],
    total: products.count || 0,
  }
}

// Компонент для отображения продуктов
async function ProductsList({ page }: { page: number }) {
  const { products, total } = await getProducts(page)
  const pageSize = 12
  const totalPages = Math.ceil(total / pageSize)

  // Если нет продуктов, показываем сообщение
  if (products.length === 0) {
    return (
      <div className="text-center p-12">
        <h2 className="text-2xl font-semibold mb-4">Товары не найдены</h2>
        <p className="text-gray-500">В данный момент товары недоступны. Пожалуйста, попробуйте позже.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.slug}`} className="group">
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-64 w-full">
                <Image
                  src={
                    product.images?.find((img) => img.is_primary)?.image_url ||
                    `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(product.name) || "/placeholder.svg"}`
                  }
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <div>
                    {product.discount_price ? (
                      <>
                        <span className="text-gray-400 line-through mr-2">{product.price} ₽</span>
                        <span className="text-red-600 font-semibold">{product.discount_price} ₽</span>
                      </>
                    ) : (
                      <span className="font-semibold">{product.price} ₽</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{product.category?.name || "Без категории"}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination currentPage={page} totalPages={totalPages} basePath="/products" />
        </div>
      )}
    </>
  )
}

// Основной компонент страницы продуктов
export default function ProductsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Все товары</h1>

      <Suspense fallback={<Loading message="Загрузка товаров..." />}>
        <ProductsList page={page} />
      </Suspense>
    </div>
  )
}
