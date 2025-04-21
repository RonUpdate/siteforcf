import Link from "next/link"
import Image from "next/image"
import { createServerClientSafe } from "@/lib/supabase/server-safe"
import type { Product, Category, BlogPost } from "@/lib/types"

async function getFeaturedProducts() {
  const supabase = createServerClientSafe()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      images:product_images(*)
    `)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(4)

  if (error) {
    console.error("Error fetching featured products:", error)
    return []
  }

  return data as (Product & { category: Category; images: any[] })[]
}

async function getCategories() {
  const supabase = createServerClientSafe()

  const { data, error } = await supabase.from("categories").select("*").limit(6)

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data as Category[]
}

async function getLatestBlogPosts() {
  const supabase = createServerClientSafe()

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(3)

  if (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }

  return data as BlogPost[]
}

export default async function Home() {
  const [featuredProducts, categories, latestPosts] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getLatestBlogPosts(),
  ])

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-100 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Креатив Фабрика</h1>
              <p className="text-xl text-gray-600 mb-6">Качественные товары для творчества и рукоделия</p>
              <Link
                href="/products"
                className="inline-block bg-gray-800 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-700 transition-colors"
              >
                Смотреть товары
              </Link>
            </div>
            <div className="md:w-1/2">
              <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden">
                <Image
                  src="/vibrant-craft-explosion.png"
                  alt="Креатив Фабрика"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Популярные товары</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
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
          <div className="text-center mt-8">
            <Link
              href="/products"
              className="inline-block border border-gray-800 text-gray-800 px-6 py-3 rounded-md font-medium hover:bg-gray-800 hover:text-white transition-colors"
            >
              Все товары
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Категории</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`} className="group">
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="relative h-48 w-full">
                    <Image
                      src={
                        category.image_url ||
                        `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(category.name) || "/placeholder.svg"} category`
                      }
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-center">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Блог</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
                  <div className="relative h-48 w-full">
                    <Image
                      src={
                        post.featured_image ||
                        `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(post.title) || "/placeholder.svg"}`
                      }
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex-grow">
                    <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-sm text-gray-500">
                        {new Date(post.published_at || post.created_at).toLocaleDateString("ru-RU")}
                      </span>
                      <span className="text-sm font-medium text-gray-800">{post.author || "Админ"}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/blog"
              className="inline-block border border-gray-800 text-gray-800 px-6 py-3 rounded-md font-medium hover:bg-gray-800 hover:text-white transition-colors"
            >
              Все статьи
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
