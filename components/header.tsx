"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, Search, User, FileText } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      setIsLoggedIn(!!data.session)
    }

    checkAuth()

    // Подписываемся на изменения состояния аутентификации
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase.auth])

  const isActive = (path: string) => {
    return pathname === path
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push("/")
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Креатив Фабрика
            </Link>
          </div>

          <div className="hidden md:block">
            <nav className="ml-10 flex items-center space-x-8">
              <Link
                href="/"
                className={`text-sm font-medium ${
                  isActive("/") ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Главная
              </Link>
              <Link
                href="/products"
                className={`text-sm font-medium ${
                  isActive("/products") ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Товары
              </Link>
              <Link
                href="/blog"
                className={`text-sm font-medium ${
                  isActive("/blog") ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Блог
              </Link>
              {isLoggedIn && (
                <Link
                  href="/notes"
                  className={`text-sm font-medium ${
                    isActive("/notes") ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Заметки
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
              aria-label="Поиск"
            >
              <Search className="h-6 w-6" />
            </button>
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link href="/notes" className="flex items-center text-gray-500 hover:text-gray-900" title="Мои заметки">
                  <FileText className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center rounded-md bg-gray-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center rounded-md bg-gray-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
              >
                <User className="mr-1 h-4 w-4" />
                Войти
              </Link>
            )}
          </div>

          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Открыть меню</span>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link
              href="/"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                isActive("/") ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Главная
            </Link>
            <Link
              href="/products"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                isActive("/products")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Товары
            </Link>
            <Link
              href="/blog"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                isActive("/blog") ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Блог
            </Link>
            {isLoggedIn && (
              <Link
                href="/notes"
                className={`block rounded-md px-3 py-2 text-base font-medium ${
                  isActive("/notes")
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Заметки
              </Link>
            )}
            {isLoggedIn ? (
              <button
                onClick={async () => {
                  await handleSignOut()
                  setIsMenuOpen(false)
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              >
                Выйти
              </button>
            ) : (
              <Link
                href="/login"
                className={`block rounded-md px-3 py-2 text-base font-medium ${
                  isActive("/login")
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Войти
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
