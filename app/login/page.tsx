"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("ronupert@gmail.com") // Предзаполняем для удобства
  const [password, setPassword] = useState("12345") // Предзаполняем для удобства
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get("redirect") || "/admin"

  const supabase = createClient()

  // Проверяем, авторизован ли пользователь
  useEffect(() => {
    async function checkSession() {
      try {
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          // Если пользователь уже авторизован, перенаправляем его
          router.push(redirectPath)
        }
      } catch (error) {
        console.error("Error checking session:", error)
      } finally {
        setCheckingSession(false)
      }
    }

    checkSession()
  }, [supabase, router, redirectPath])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (data.session) {
        console.log("Login successful, redirecting to:", redirectPath)
        // Устанавливаем небольшую задержку перед редиректом
        setTimeout(() => {
          router.push(redirectPath)
          router.refresh() // Принудительно обновляем страницу
        }, 500)
      }
    } catch (error: any) {
      console.error("Error during login:", error)
      setError(error.message || "Ошибка при входе. Пожалуйста, попробуйте снова.")
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Вход в систему</CardTitle>
          <CardDescription>Введите свои учетные данные для доступа к административной панели</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="p-3 text-sm bg-red-100 text-red-600 rounded-md">{error}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Вход...
                </>
              ) : (
                "Войти"
              )}
            </Button>

            <div className="text-sm text-center text-gray-500 mt-4">
              <p>Для тестирования используйте:</p>
              <p>Email: ronupert@gmail.com</p>
              <p>Пароль: 12345</p>
            </div>

            <div className="text-center mt-4">
              <Link href="/" className="text-sm text-blue-600 hover:underline">
                Вернуться на главную
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
