"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, FileText, Tag, LogOut, Menu, X } from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)
    }

    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const menuItems = [
    { href: "/admin", label: "Панель управления", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/admin/products", label: "Продукты", icon: <Package className="h-5 w-5" /> },
    { href: "/admin/categories", label: "Категории", icon: <Tag className="h-5 w-5" /> },
    { href: "/admin/blog-posts", label: "Блог", icon: <FileText className="h-5 w-5" /> },
  ]

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Мобильное меню */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 top-4 z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
            <div className="h-full w-64 bg-white p-4" onClick={(e) => e.stopPropagation()}>
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-xl font-bold">Админ-панель</h1>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                      pathname === item.href ? "bg-primary text-primary-foreground" : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                ))}
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-start px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-5 w-5" />
                  <span className="ml-3">Выйти</span>
                </Button>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Боковое меню для десктопа */}
      <div className="hidden w-64 flex-shrink-0 bg-white p-4 shadow-md lg:block">
        <h1 className="mb-6 text-xl font-bold">Админ-панель</h1>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                pathname === item.href ? "bg-primary text-primary-foreground" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}
          <Button
            variant="ghost"
            className="flex w-full items-center justify-start px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Выйти</span>
          </Button>
        </nav>
      </div>

      {/* Основной контент */}
      <div className="flex-1 p-4 lg:p-8">{children}</div>
    </div>
  )
}
