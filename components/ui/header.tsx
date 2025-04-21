"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, ShoppingCart, User } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            Креатив Фабрика
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-600 hover:text-gray-900">
              Товары
            </Link>
            <Link href="/categories" className="text-gray-600 hover:text-gray-900">
              Категории
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-gray-900">
              Блог
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Контакты
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="text-gray-600 hover:text-gray-900">
              <ShoppingCart className="h-6 w-6" />
            </Link>
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">
              <User className="h-6 w-6" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-4">
            <Link
              href="/products"
              className="block text-gray-600 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Товары
            </Link>
            <Link
              href="/categories"
              className="block text-gray-600 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Категории
            </Link>
            <Link href="/blog" className="block text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>
              Блог
            </Link>
            <Link
              href="/contact"
              className="block text-gray-600 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Контакты
            </Link>
            <div className="flex space-x-4 pt-2">
              <Link href="/cart" className="text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>
                <ShoppingCart className="h-6 w-6" />
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>
                <User className="h-6 w-6" />
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
