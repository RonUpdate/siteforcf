import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import ProductCard from "@/components/product-card"
import ClientCategoryFilter from "@/components/client-category-filter"

export default async function HomePage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const { createServerClient } = await import("@/utils/supabase/server")
  const supabase = await createServerClient()

  // Получаем категорию из параметров URL
  const categorySlug = searchParams.category || null

  try {
    // Получаем категории для фильтра
    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select("id, title, slug")
      .order("title")

    if (categoriesError) throw categoriesError

    // Формируем запрос для продуктов
    let productsQuery = supabase
      .from("products")
      .select(`
        id, 
        title, 
        description, 
        image_url, 
        external_url,
        categories (
          id, 
          title,
          slug
        )
      `)
      .order("created_at", { ascending: false })
      .limit(6)

    // Применяем фильтр по категории, если он указан
    if (categorySlug) {
      const { data: categoryData } = await supabase.from("categories").select("id").eq("slug", categorySlug).single()

      if (categoryData) {
        productsQuery = productsQuery.eq("category_id", categoryData.id)
      }
    }

    // Выполняем запрос продуктов
    const { data: products, error: productsError } = await productsQuery
    if (productsError) throw productsError

    // Получаем последние блог-посты
    const { data: blogPosts, error: blogPostsError } = await supabase
      .from("blog_posts")
      .select("id, title, slug, created_at, image_url, content")
      .order("created_at", { ascending: false })
      .limit(3)

    if (blogPostsError) throw blogPostsError

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Hero секция */}
        <section className="mb-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Добро пожаловать в наш каталог</h1>
            <p className="text-xl text-gray-600 mb-8">
              Исследуйте нашу коллекцию продуктов и узнавайте о новинках в нашем блоге
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products">
                <Button size="lg">
                  Все продукты
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="outline" size="lg">
                  Перейти в блог
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Секция с продуктами */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Наши продукты</h2>
            <Link href="/products">
              <Button variant="ghost">
                Смотреть все
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Фильтр по категориям (клиентский компонент) */}
          {categories && categories.length > 0 ? (
            <div className="mb-8">
              <ClientCategoryFilter categories={categories} activeCategory={categorySlug} />
            </div>
          ) : (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-500">Категории не найдены</p>
            </div>
          )}

          {/* Сетка продуктов */}
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Продукты не найдены</p>
              {categorySlug && (
                <Link href="/">
                  <Button variant="outline" className="mt-4">
                    Сбросить фильтр
                  </Button>
                </Link>
              )}
            </div>
          )}
        </section>

        {/* Секция с блог-постами */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Последние статьи</h2>
            <Link href="/blog">
              <Button variant="ghost">
                Все статьи
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {blogPosts && blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
                  <div className="aspect-video rounded-lg mb-4 overflow-hidden">
                    {post.image_url ? (
                      <img
                        src={post.image_url || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <span className="text-gray-400 text-lg">{post.title.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                  {post.content && (
                    <p className="text-gray-600 mt-2 line-clamp-2">
                      {post.content.replace(/#{1,6}\s+/g, "").substring(0, 120)}...
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Статьи не найдены</p>
            </div>
          )}
        </section>
      </div>
    )
  } catch (error: any) {
    console.error("Error loading homepage data:", error)

    // Показываем базовую страницу с ошибкой
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg w-full text-center">
          <h2 className="text-xl font-bold text-red-700 mb-2">Ошибка загрузки данных</h2>
          <p className="text-red-600 mb-4">Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.</p>
          <Link href="/">
            <Button>Обновить страницу</Button>
          </Link>
        </div>
      </div>
    )
  }
}
