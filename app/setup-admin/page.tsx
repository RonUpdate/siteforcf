"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { supabaseClient } from "@/lib/supabase/client"

export default function SetupAdminPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [adminExists, setAdminExists] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkAdmin() {
      try {
        const { data, error } = await supabaseClient().from("admin_users").select("*").limit(1)

        if (error) throw error

        setAdminExists(data && data.length > 0)
      } catch (error: any) {
        console.error("Ошибка при проверке администраторов:", error)
        setError("Ошибка при проверке администраторов: " + error.message)
      }
    }

    checkAdmin()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      // Регистрируем пользователя в Supabase Auth
      const { data: authData, error: authError } = await supabaseClient().auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      // Добавляем пользователя в таблицу admin_users
      const { error: adminError } = await supabaseClient()
        .from("admin_users")
        .insert([
          {
            email,
            name,
            role: "superadmin",
          },
        ])

      if (adminError) throw adminError

      setMessage(
        "Администратор успешно создан! Проверьте вашу электронную почту для подтверждения аккаунта, затем вы сможете войти в админ-панель.",
      )
    } catch (error: any) {
      console.error("Ошибка при создании администратора:", error)
      setError("Ошибка при создании администратора: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (adminExists === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800 mx-auto"></div>
          <p className="text-gray-600">Проверка наличия администраторов...</p>
        </div>
      </div>
    )
  }

  if (adminExists) {
    return (
      <div className="container mx-auto max-w-md px-4 py-12">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h1 className="mb-4 text-xl font-bold">Настройка администратора</h1>
          <p className="text-gray-600">
            Администратор уже существует в системе. Пожалуйста, используйте страницу входа для доступа к админ-панели.
          </p>
          <a href="/login" className="mt-4 inline-block rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-700">
            Перейти на страницу входа
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-12">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-xl font-bold">Настройка администратора</h1>
        <p className="mb-4 text-gray-600">
          В системе еще нет администраторов. Создайте первого администратора, чтобы получить доступ к админ-панели.
        </p>

        {message && <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700">{message}</div>}
        {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Имя
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
          >
            {loading ? "Создание..." : "Создать администратора"}
          </button>
        </form>
      </div>
    </div>
  )
}
