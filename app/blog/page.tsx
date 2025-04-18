import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { Card, CardContent } from "@/components/ui/card"

export default async function BlogPage() {
  const supabase = createClient()

  // Получаем все блог-посты
  const { data: blogPosts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, content, created_at, image_url")
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Блог</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts && blogPosts.length > 0 ? (
          blogPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video overflow-hidden">
                  {post.image_url ? (
                    <img
                      src={post.image_url || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 h-full w-full flex items-center justify-center">
                      <span className="text-gray-500 text-2xl font-bold">{post.title.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <CardContent className="pt-4">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">{new Date(post.created_at).toLocaleDateString()}</p>
                  <p className="text-gray-600 line-clamp-3">
                    {post.content.replace(/#{1,6}\s+/g, "").substring(0, 150)}...
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Статьи не найдены</p>
          </div>
        )}
      </div>
    </div>
  )
}
