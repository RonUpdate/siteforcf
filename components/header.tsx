"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { ShoppingBag, FileText, User } from "lucide-react"
import { isAdminClient } from "@/utils/auth-utils"

export default function Header() {
  const [session, setSession] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function getSessionAndAdmin() {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)

      if (data.session) {
        const adminStatus = await isAdminClient()
        setIsAdmin(adminStatus)
      }

      setLoading(false)
    }

    getSessionAndAdmin()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)

      if (session) {
        const adminStatus = await isAdminClient()
        setIsAdmin(adminStatus)
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Каталог
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Главная
            </Link>
            <Link href="/products" className="text-gray-600 hover:text-gray-900">
              Продукты
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-gray-900">
              Блог
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/products">
              <Button variant="ghost" size="icon">
                <ShoppingBag className="h-5 w-5" />
                <span className="sr-only">Продукты</span>
              </Button>
            </Link>

            <Link href="/blog">
              <Button variant="ghost" size="icon">
                <FileText className="h-5 w-5" />
                <span className="sr-only">Блог</span>
              </Button>
            </Link>

            {!loading && session ? (
              <Link href={isAdmin ? "/admin" : "/"}>
                <Button>
                  <User className="h-5 w-5 mr-2" />
                  {isAdmin ? "Админ-панель" : "Профиль"}
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="outline">
                  <User className="h-5 w-5 mr-2" />
                  Войти
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
