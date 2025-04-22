import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SearchForm } from "@/components/search-form"
import { Suspense } from "react"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <header className="bg-white border-b dark:bg-gray-950 dark:border-gray-800">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="text-xl font-bold text-primary">
            Art Market
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Suspense>
              <SearchForm className="max-w-xs" />
            </Suspense>
            <Link href="/categories">
              <Button variant="ghost">Categories</Button>
            </Link>
            <Link href="/featured">
              <Button variant="ghost">Featured</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost">About</Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline">Admin Panel</Button>
            </Link>
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <span className="sr-only">Menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="bg-gray-50 border-t dark:bg-gray-950 dark:border-gray-800">
        <div className="container px-4 py-12 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-lg font-bold mb-4">Art Market</h3>
              <p className="text-gray-500 dark:text-gray-400">Premium coloring pages from Creative Factory</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/categories" className="text-gray-500 hover:text-primary dark:text-gray-400">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/featured" className="text-gray-500 hover:text-primary dark:text-gray-400">
                    Featured Pages
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-500 hover:text-primary dark:text-gray-400">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-gray-500 hover:text-primary dark:text-gray-400">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-500 hover:text-primary dark:text-gray-400">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <p className="text-gray-500 dark:text-gray-400">support@artmarket.com</p>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Art Market. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
