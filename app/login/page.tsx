"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)

  const supabase = createClientComponentClient()

  // Проверяем, авторизован ли пользователь при загрузке страницы
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        // Если пользователь уже авторизован, проверяем права администратора
        if (redirect.includes("/admin")) {
          try {
            const { data: adminData, error: adminError } = await supabase
              .from("admin_users")
              .select("*")
              .eq("email", data.session.user.email)
              .single()

            if (!adminError && adminData) {
              // Если пользователь администратор, перенаправляем в админ-панель
              router.push(redirect)
            } else {
              // Если пользователь не администратор, показываем ошибку
              setError("У вас нет прав доступа к админ-панели")
              // Выходим из системы
              await supabase.auth.signOut()
            }
          } catch (error) {
            console.error("Ошибка при проверке прав администратора:", error)
          }
        } else {
          // Если не требуются права администратора, просто перенаправляем
          router.push(redirect)
        }
      }
    }

    checkSession()
  }, [router, redirect, supabase.auth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (isRegistering) {
        // Регистрация нового пользователя
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?redirect_to=${redirect}`,
          },
        })

        if (error) throw error

        setMessage("Регистрация успешна! Проверьте вашу электронную почту для подтверждения аккаунта.")
        setIsRegistering(false)
      } else {
        // Авторизация существующего пользователя
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        // Для отладки
        console.log("Авторизация успешна:", data)
        console.log("Перенаправление на:", redirect)

        // Если требуется доступ к админ-панели, проверяем права
        if (redirect.includes("/admin")) {
          try {
            const { data: adminData, error: adminError } = await supabase
              .from("admin_users")
              .select("*")
              .eq("email", email)
              .single()

            console.log("Проверка прав администратора:", { adminData, adminError })

            if (adminError || !adminData) {
              // Если пользователь не администратор, выходим из системы и показываем ошибку
              await supabase.auth.signOut()
              throw new Error("У вас нет прав доступа к админ-панели")
            }

            // Если пользователь администратор, перенаправляем в админ-панель
            console.log("Перенаправление в админ-панель:", redirect)

            // Принудительное перенаправление на страницу админ-панели
            window.location.href = redirect
            return
          } catch (error) {
            console.error("Ошибка при проверке прав администратора:", error)
            setError(error.message || "Произошла ошибка при проверке прав доступа.")
            setLoading(false)
            return
          }
        }

        // Для обычных пользователей
        router.refresh()
        router.push(redirect)
      }
    } catch (error: any) {
      console.error("Ошибка:", error)
      setError(error.message || "Произошла ошибка. Пожалуйста, попробуйте снова.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Креатив Фабрика</h1>
          <h2 className="mt-2 text-xl font-semibold text-gray-900">
            {isRegistering ? "Регистрация" : "Вход в аккаунт"}
          </h2>
        </div>

        <div className="rounded-lg bg-white px-8 py-10 shadow">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}
            {message && <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">{message}</div>}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isRegistering ? "new-password" : "current-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Загрузка...
                  </>
                ) : isRegistering ? (
                  "Зарегистрироваться"
                ) : (
                  "Войти"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isRegistering ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
            </button>
          </div>

          <div className="mt-4 text-center text-sm">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
