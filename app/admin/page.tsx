import { createServerClientSafe } from "@/lib/supabase/server-safe"
import Link from "next/link"
import { Package, FolderOpen, FileText } from "lucide-react"

async function getDashboardStats() {
  const supabase = createServerClientSafe()

  const [{ count: productsCount }, { count: categoriesCount }, { count: blogPostsCount }] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
  ])

  return {
    productsCount: productsCount || 0,
    categoriesCount: categoriesCount || 0,
    blogPostsCount: blogPostsCount || 0,
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Панель управления</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <Package className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Товары</p>
              <p className="text-2xl font-semibold">{stats.productsCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/products" className="text-sm text-blue-600 hover:text-blue-800">
              Управление товарами &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FolderOpen className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Категории</p>
              <p className="text-2xl font-semibold">{stats.categoriesCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/categories" className="text-sm text-green-600 hover:text-green-800">
              Управление категориями &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Статьи блога</p>
              <p className="text-2xl font-semibold">{stats.blogPostsCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/blog" className="text-sm text-purple-600 hover:text-purple-800">
              Управление блогом &rarr;
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Быстрые действия</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/admin/products/new" className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
            <Package className="h-5 w-5 mr-3 text-blue-600" />
            <span>Добавить товар</span>
          </Link>
          <Link href="/admin/categories/new" className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
            <FolderOpen className="h-5 w-5 mr-3 text-green-600" />
            <span>Добавить категорию</span>
          </Link>
          <Link href="/admin/blog/new" className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
            <FileText className="h-5 w-5 mr-3 text-purple-600" />
            <span>Написать статью</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
