import type React from "react"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import Link from "next/link"
import { LayoutDashboard, Package, FolderOpen, FileText, Settings, LogOut } from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/admin/login")
  }

  // Check if user is an admin
  const { data: adminUser } = await supabase.from("admin_users").select("*").eq("email", session.user.email).single()

  if (!adminUser) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6">
          <Link href="/admin" className="text-xl font-bold text-gray-800">
            Админ панель
          </Link>
        </div>
        <nav className="mt-6">
          <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Управление</div>
          <Link href="/admin" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Обзор
          </Link>
          <Link href="/admin/products" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <Package className="h-5 w-5 mr-3" />
            Товары
          </Link>
          <Link href="/admin/categories" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <FolderOpen className="h-5 w-5 mr-3" />
            Категории
          </Link>
          <Link href="/admin/blog" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <FileText className="h-5 w-5 mr-3" />
            Блог
          </Link>
          <div className="px-4 py-2 mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Настройки</div>
          <Link href="/admin/settings" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <Settings className="h-5 w-5 mr-3" />
            Настройки
          </Link>
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Выйти
            </button>
          </form>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <div className="md:hidden">
            <button className="text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          <div className="ml-auto flex items-center">
            <span className="text-sm text-gray-700 mr-2">{adminUser.name || adminUser.email}</span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
