"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { LayoutDashboard, Package, FolderTree, FileText, Users, ShoppingCart, Settings, LogOut } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()

      // Принудительное перенаправление на страницу входа
      window.location.href = "/login"
    } catch (error) {
      console.error("Ошибка при выходе из системы:", error)
      alert("Ошибка при выходе из системы. Попробуйте еще раз.")
    }
  }

  const menuItems = [
    {
      name: "Панель управления",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Товары",
      href: "/admin/products",
      icon: Package,
    },
    {
      name: "Категории",
      href: "/admin/categories",
      icon: FolderTree,
    },
    {
      name: "Блог",
      href: "/admin/blog",
      icon: FileText,
    },
    {
      name: "Заказы",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      name: "Пользователи",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Настройки",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  return (
    <div className="flex h-full flex-col bg-gray-800 text-white">
      <div className="p-4">
        <h1 className="text-xl font-bold">Админ-панель</h1>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                isActive(item.href) ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-gray-700 p-4">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
          Выйти
        </button>
      </div>
    </div>
  )
}
