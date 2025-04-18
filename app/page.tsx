"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import ProductCard from "@/components/product-card"
import CategoryFilter from "@/components/category-filter"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2 } from "lucide-react"

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      // Получаем категории для фильтра
      const { data: categoriesData } = await supabase.from("categories").select("id, title, slug").order("title")
      setCategories(categoriesData || [])

      // Формируем запрос для продуктов с фильтрацией по категории
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
      if (activeCategory) {
        const { data: categoryData } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", activeCategory)
          .single()

        if (categoryData) {
          productsQuery = productsQuery.eq("category_id", categoryData.id)
        }
      }

      // Выполняем запрос
      const { data: productsData } = await productsQuery
      setProducts(productsData || [])

      // Получаем последние блог-посты
      const { data: blogPostsData } = await supabase
        .from("blog_posts")
        .select("id, title, slug, created_at, image_url")
        .order("created_at", { ascending: false })
        .limit(3)

      setBlogPosts(blogPostsData || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase, activeCategory])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCategoryChange = (slug: string | null) => {
    setActiveCategory(slug)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero секция */}
      <section className="mb-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Добро пожаловать в наш каталог</h1>
          <p className="text-xl text-gray-600 mb-8">
            Исследуйте нашу коллекцию продуктов и узнавайте о новинках в нашем блоге
          </p>
          <div className="flex justify-center gap-4">
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

        {/* Фильтр по категориям */}
        {categories && (
          <div className="mb-8">
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        )}

        {/* Сетка продуктов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products && products.length > 0 ? (
            products.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Продукты не найдены</p>
            </div>
          )}
        </div>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts && blogPosts.length > 0 ? (
            blogPosts.map((post) => (
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
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Статьи не найдены</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
