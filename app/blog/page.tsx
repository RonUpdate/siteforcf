import { Suspense } from "react"
import { createServerClientSafe, fetchWithCache } from "@/lib/supabase/server-safe"
import { Loading } from "@/components/ui/loading"
import { Pagination } from "@/components/ui/pagination"
import Link from "next/link"
import Image from "next/image"
import type { BlogPost } from "@/lib/types"

// Функция для получения постов блога с пагинацией
async function getBlogPosts(page = 1, pageSize = 9) {
  const supabase = createServerClientSafe()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  // Получаем посты с пагинацией
  const posts = await fetchWithCache(
    () =>
      supabase
        .from("blog_posts")
        .select("*", { count: "exact" })
        .eq("published", true)
        .order("published_at", { ascending: false })
        .range(from, to),
    `blog-posts-page-${page}`,
    { data: [], count: 0 },
  )

  return {
    posts: posts.data as BlogPost[],
    total: posts.count || 0,
  }
}

// Компонент для отображения постов блога
async function BlogPosts({ page }: { page: number }) {
  const { posts, total } = await getBlogPosts(page)
  const pageSize = 9
  const totalPages = Math.ceil(total / pageSize)

  // Если нет постов, показываем сообщение
  if (posts.length === 0) {
    return (
      <div className="text-center p-12">
        <h2 className="text-2xl font-semibold mb-4">Статьи не найдены</h2>
        <p className="text-gray-500">В данный момент статьи недоступны. Пожалуйста, попробуйте позже.</p>
      </div>
    )
  }

  return (
    <>
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

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination currentPage={page} totalPages={totalPages} basePath="/blog" />
        </div>
      )}
    </>
  )
}

// Основной компонент страницы блога
export default function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Блог</h1>

      <Suspense fallback={<Loading message="Загрузка статей..." />}>
        <BlogPosts page={page} />
      </Suspense>
    </div>
  )
}
