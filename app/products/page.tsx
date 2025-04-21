import { createServerClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import type { Product, Category } from "@/lib/types"

async function getProducts() {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      images:product_images(*)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data as (Product & { category: Category; images: any[] })[]
}

async function getCategories() {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data as Category[]
}

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Все товары</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Categories sidebar */}
        <div className="md:w-1/4 lg:w-1/5">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Категории</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-800 font-medium hover:text-gray-600">
                  Все товары
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link href={`/categories/${category.slug}`} className="text-gray-600 hover:text-gray-800">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Products grid */}
        <div className="md:w-3/4 lg:w-4/5">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="group">
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
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
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
                      <div className="flex justify-between items-center mt-auto">
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
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">Товары не найдены</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
