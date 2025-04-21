import { createServerClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import type { BlogPost, BlogCategory } from "@/lib/types"

async function getBlogPosts() {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false })

  if (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }

  return data as BlogPost[]
}

async function getBlogCategories() {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("blog_categories").select("*").order("name")

  if (error) {
    console.error("Error fetching blog categories:", error)
    return []
  }

  return data as BlogCategory[]
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getBlogPosts(), getBlogCategories()])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Блог</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4 lg:w-1/5">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Категории</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-gray-800 font-medium hover:text-gray-600">
                  Все статьи
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link href={`/blog/category/${category.slug}`} className="text-gray-600 hover:text-gray-800">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Blog posts */}
        <div className="md:w-3/4 lg:w-4/5">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
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
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{post.excerpt}</p>
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
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">Статьи не найдены</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
