"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabaseClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabaseClient().auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push("/admin")
      router.refresh()
    } catch (error: any) {
      console.error("Ошибка входа:", error)
      setError("Неверный email или пароль")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Креатив Фабрика</h1>
          <h2 className="mt-2 text-xl font-semibold text-gray-900">Вход в админ-панель</h2>
        </div>

        <div className="rounded-lg bg-white px-8 py-10 shadow">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}

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
                autoComplete="current-password"
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
                {loading ? "Вход..." : "Войти"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
