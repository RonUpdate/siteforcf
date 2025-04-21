import { createServerClientSafe } from "@/lib/supabase/server-safe"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"
import type { Product } from "@/lib/types"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params
  const supabase = createServerClientSafe()

  // Получаем товар по slug
  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(*),
      images:product_images(*)
    `,
    )
    .eq("slug", slug)
    .single()

  if (error || !product) {
    notFound()
  }

  // Сортируем изображения: сначала основное, затем по порядку отображения
  const sortedImages = [...(product.images || [])].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1
    if (!a.is_primary && b.is_primary) return 1
    return a.display_order - b.display_order
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900">
          ← Назад к товарам
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <div className="mb-4 overflow-hidden rounded-lg">
            <Image
              src={sortedImages[0]?.image_url || "/placeholder.svg?height=600&width=600&query=product"}
              alt={product.name}
              width={600}
              height={600}
              className="h-auto w-full object-cover"
            />
          </div>

          {sortedImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {sortedImages.map((image) => (
                <div key={image.id} className="overflow-hidden rounded-md">
                  <Image
                    src={image.image_url || "/placeholder.svg"}
                    alt={product.name}
                    width={150}
                    height={150}
                    className="h-auto w-full cursor-pointer object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">{product.name}</h1>

          {product.category && (
            <Link
              href={`/categories/${product.category.slug}`}
              className="mb-4 inline-block text-sm text-gray-600 hover:text-gray-900"
            >
              {product.category.name}
            </Link>
          )}

          <div className="mb-6 mt-4">
            {product.discount_price ? (
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-900">{product.discount_price.toLocaleString()} ₽</span>
                <span className="ml-2 text-lg text-gray-500 line-through">{product.price.toLocaleString()} ₽</span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-gray-900">{product.price.toLocaleString()} ₽</span>
            )}
          </div>

          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold">Описание</h2>
            <div className="prose prose-sm max-w-none text-gray-600">{product.description}</div>
          </div>

          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold">Наличие</h2>
            <p className="text-gray-600">
              {product.stock > 0 ? (
                <span className="text-green-600">В наличии ({product.stock} шт.)</span>
              ) : (
                <span className="text-red-600">Нет в наличии</span>
              )}
            </p>
          </div>

          <div className="space-y-4">
            <AddToCartButton product={product as Product} className="w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
