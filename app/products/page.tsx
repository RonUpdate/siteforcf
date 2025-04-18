"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import ProductCard from "@/components/product-card"
import CategoryFilter from "@/components/category-filter"
import { Loader2 } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const searchParams = useSearchParams()
  const router = useRouter()
  const categorySlug = searchParams.get("category")

  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
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

        // Применяем фильтр по категории, если он указан
        if (categorySlug) {
          const { data: categoryData } = await supabase
            .from("categories")
            .select("id")
            .eq("slug", categorySlug)
            .single()

          if (categoryData) {
            productsQuery = productsQuery.eq("category_id", categoryData.id)
          }
        }

        // Выполняем запрос
        const { data: productsData } = await productsQuery
        setProducts(productsData || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase, categorySlug])

  const handleCategoryChange = (slug: string | null) => {
    if (slug) {
      router.push(`/products?category=${slug}`)
    } else {
      router.push("/products")
    }
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
      <h1 className="text-3xl font-bold mb-8">Все продукты</h1>

      {/* Фильтр по категориям */}
      {categories && (
        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            activeCategory={categorySlug}
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
    </div>
  )
}
