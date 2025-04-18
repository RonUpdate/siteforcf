"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Loader2 } from "lucide-react"

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    products: 0,
    categories: 0,
    blogPosts: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchCounts() {
      try {
        // Получаем количество продуктов
        const { count: productsCount, error: productsError } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })

        // Получаем количество категорий
        const { count: categoriesCount, error: categoriesError } = await supabase
          .from("categories")
          .select("*", { count: "exact", head: true })

        // Получаем количество блог-постов
        const { count: blogPostsCount, error: blogPostsError } = await supabase
          .from("blog_posts")
          .select("*", { count: "exact", head: true })

        setCounts({
          products: productsCount || 0,
          categories: categoriesCount || 0,
          blogPosts: blogPostsCount || 0,
        })
      } catch (error) {
        console.error("Error fetching counts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCounts()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Панель управления</h1>

      {/* Остальной код компонента */}
    </div>
  )
}
