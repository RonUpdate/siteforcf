import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Product, Category } from "@/lib/types"

interface ProductPageProps {
  params: {
    slug: string
  }
}

async function getProduct(slug: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      images:product_images(*)
    `)
    .eq("slug", slug)
    .single()

  if (error || !data) {
    return null
  }

  return data as Product & { category: Category; images: any[] }
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      images:product_images(*)
    `)
    .eq("category_id", categoryId)
    .neq("id", currentProductId)
    .limit(4)

  if (error) {
    console.error("Error fetching related products:", error)
    return []
  }

  return data as (Product & { category: Category; images: any[] })[]
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.category_id || "", product.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/products" className="text-gray-600 hover:text-gray-800">
          &larr; Назад к товарам
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Images */}
          <div>
            {product.images && product.images.length > 0 ? (
              <div className="space-y-4">
                <div className="relative h-80 w-full rounded-lg overflow-hidden">
                  <Image
                    src={
                      product.images.find((img) => img.is_primary)?.image_url ||
                      product.images[0].image_url ||
                      "/placeholder.svg"
                    }
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.map((image) => (
                      <div key={image.id} className="relative h-20 w-full rounded-md overflow-hidden cursor-pointer">
                        <Image
                          src={image.image_url || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="relative h-80 w-full rounded-lg overflow-hidden">
                <Image
                  src={`/abstract-geometric-shapes.png?height=600&width=600&query=${encodeURIComponent(product.name)}`}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            {product.category && (
              <Link
                href={`/categories/${product.category.slug}`}
                className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block"
              >
                {product.category.name}
              </Link>
            )}

            <div className="mt-4 mb-6">
              {product.discount_price ? (
                <div className="flex items-center">
                  <span className="text-gray-400 line-through text-lg mr-2">{product.price} ₽</span>
                  <span className="text-red-600 font-bold text-2xl">{product.discount_price} ₽</span>
                </div>
              ) : (
                <span className="font-bold text-2xl">{product.price} ₽</span>
              )}
            </div>

            <div className="mb-6">
              <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-2">Наличие:</span>
                {product.stock > 0 ? (
                  <span className="text-green-600 font-medium">В наличии ({product.stock} шт.)</span>
                ) : (
                  <span className="text-red-600 font-medium">Нет в наличии</span>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                disabled={product.stock <= 0}
                className={`px-6 py-3 rounded-md font-medium text-white ${
                  product.stock > 0 ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                В корзину
              </button>
              <button className="px-6 py-3 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50">
                В избранное
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Похожие товары</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
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
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
