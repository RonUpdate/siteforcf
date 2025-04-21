"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Search } from "lucide-react"
import { CartIcon } from "./cart/cart-icon"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
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
                href="/categories"
                className={`text-sm font-medium ${
                  isActive("/categories") ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Категории
              </Link>
              <Link
                href="/blog"
                className={`text-sm font-medium ${
                  isActive("/blog") ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Блог
              </Link>
              <Link
                href="/about"
                className={`text-sm font-medium ${
                  isActive("/about") ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                О нас
              </Link>
              <Link
                href="/contact"
                className={`text-sm font-medium ${
                  isActive("/contact") ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Контакты
              </Link>
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
            <CartIcon />
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
              href="/categories"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                isActive("/categories")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Категории
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
            <Link
              href="/about"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                isActive("/about") ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              О нас
            </Link>
            <Link
              href="/contact"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                isActive("/contact")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Контакты
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
