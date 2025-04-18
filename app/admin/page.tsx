"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, FileText, Tag, Loader2 } from "lucide-react"

export default function AdminPage() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Продукты
            </CardTitle>
            <CardDescription>Управление продуктами в каталоге</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-2xl font-bold">{counts.products}</p>
              <p className="text-sm text-gray-500">Всего продуктов</p>
            </div>
            <Link href="/admin/products">
              <Button className="w-full">Управление продуктами</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Tag className="h-5 w-5 mr-2" />
              Категории
            </CardTitle>
            <CardDescription>Управление категориями продуктов</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-2xl font-bold">{counts.categories}</p>
              <p className="text-sm text-gray-500">Всего категорий</p>
            </div>
            <Link href="/admin/categories">
              <Button className="w-full">Управление категориями</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Блог
            </CardTitle>
            <CardDescription>Управление статьями блога</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-2xl font-bold">{counts.blogPosts}</p>
              <p className="text-sm text-gray-500">Всего статей</p>
            </div>
            <Link href="/admin/blog-posts">
              <Button className="w-full">Управление статьями</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
