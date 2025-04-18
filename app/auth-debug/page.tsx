"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"

export default function AuthDebugPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessionData, setSessionData] = useState<any>(null)

  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      try {
        setLoading(true)

        // Получаем сессию
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) throw sessionError

        setSessionData(session)

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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const handleAdminRedirect = () => {
    window.location.href = "/admin"
  }

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Отладка аутентификации</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className={`p-4 rounded-md ${user ? "bg-green-100" : "bg-yellow-100"}`}>
            <h2 className="font-bold mb-2">Статус аутентификации</h2>
            {user ? (
              <>
                <p>
                  <strong>Статус:</strong> Авторизован
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>ID:</strong> {user.id}
                </p>
                <p>
                  <strong>Админ:</strong> {user.email === "admin@example.com" ? "Да" : "Нет"}
                </p>
              </>
            ) : (
              <p>Вы не авторизованы</p>
            )}
          </div>

          <div className="p-4 bg-gray-100 rounded-md">
            <h2 className="font-bold mb-2">Данные сессии</h2>
            {sessionData ? (
              <pre className="text-xs overflow-auto max-h-60 p-2 bg-gray-50 rounded">
                {JSON.stringify(sessionData, null, 2)}
              </pre>
            ) : (
              <p>Сессия отсутствует</p>
            )}
          </div>

          <div className="p-4 bg-blue-50 rounded-md">
            <h2 className="font-bold mb-2">Действия</h2>
            <div className="flex flex-wrap gap-2">
              {user ? (
                <>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Выйти
                  </button>

                  {user.email === "ronupert@gmail.com" && (
                    <button
                      onClick={handleAdminRedirect}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Перейти в админку
                    </button>
                  )}
                </>
              ) : (
                <Link href="/login" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  Войти
                </Link>
              )}

              <Link href="/" className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                На главную
              </Link>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-md">
              <h2 className="font-bold mb-2">Ошибка</h2>
              <p>{error}</p>
            </div>
          )}

          <div className="p-4 bg-gray-50 rounded-md">
            <h2 className="font-bold mb-2">Советы по отладке</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Проверьте, что middleware.ts правильно настроен</li>
              <li>Убедитесь, что email в middleware.ts точно совпадает с вашим (ronupert@gmail.com)</li>
              <li>Попробуйте очистить кеш и куки браузера</li>
              <li>Проверьте консоль браузера на наличие ошибок</li>
              <li>Временно отключите middleware для проверки доступа</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
