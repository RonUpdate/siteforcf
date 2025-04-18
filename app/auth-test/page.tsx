"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"

export default function AuthTestPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      try {
        setLoading(true)
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) throw sessionError

        if (session) {
          setUser(session.user)
        }
      } catch (err: any) {
        console.error("Auth error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Тест аутентификации</h1>

      {loading ? (
        <p>Загрузка...</p>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
          <p>Ошибка: {error}</p>
        </div>
      ) : user ? (
        <div className="p-4 bg-green-100 text-green-700 rounded-md mb-4">
          <h2 className="font-bold mb-2">Вы авторизованы!</h2>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Админ:</strong> {user.email === "admin@example.com" ? "Да" : "Нет"}
          </p>
        </div>
      ) : (
        <div className="p-4 bg-yellow-100 text-yellow-700 rounded-md mb-4">
          <p>Вы не авторизованы</p>
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={async () => {
            await supabase.auth.signOut()
            window.location.reload()
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Выйти
        </button>
      </div>
    </div>
  )
}
