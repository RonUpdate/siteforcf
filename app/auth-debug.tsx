"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function AuthDebugPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [authStatus, setAuthStatus] = useState<any>(null)
  const [adminCheckResult, setAdminCheckResult] = useState<any>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function checkAuth() {
      try {
        setLoading(true)

        // Проверяем текущую сессию
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          throw sessionError
        }

        setAuthStatus({
          hasSession: !!sessionData.session,
          session: sessionData.session
            ? {
                user: {
                  id: sessionData.session.user.id,
                  email: sessionData.session.user.email,
                  lastSignInAt: sessionData.session.user.last_sign_in_at,
                },
                expiresAt: sessionData.session.expires_at,
              }
            : null,
        })

        // Если есть сессия, проверяем права администратора
        if (sessionData.session) {
          const { data: adminData, error: adminError } = await supabase
            .from("admin_users")
            .select("*")
            .eq("email", sessionData.session.user.email)
            .single()

          setAdminCheckResult({
            isAdmin: !adminError && !!adminData,
            adminData: adminData || null,
            adminError: adminError ? adminError.message : null,
          })
        }

        // Проверяем статус через API
        const apiResponse = await fetch("/auth/status")
        const apiData = await apiResponse.json()

        setAuthStatus((prev) => ({
          ...prev,
          apiCheck: apiData,
        }))
      } catch (error: any) {
        console.error("Ошибка при проверке аутентификации:", error)
        setError(error.message || "Произошла ошибка при проверке аутентификации")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [supabase.auth])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      window.location.reload()
    } catch (error: any) {
      console.error("Ошибка при выходе:", error)
      alert("Ошибка при выходе: " + error.message)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Отладка аутентификации</h1>

      {loading ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-center">Загрузка информации...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Ошибка</h2>
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Статус аутентификации</h2>
            <div className="bg-gray-50 p-4 rounded overflow-auto">
              <pre className="text-sm">{JSON.stringify(authStatus, null, 2)}</pre>
            </div>
          </div>

          {authStatus?.hasSession && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Проверка прав администратора</h2>
              <div className="bg-gray-50 p-4 rounded overflow-auto">
                <pre className="text-sm">{JSON.stringify(adminCheckResult, null, 2)}</pre>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            {authStatus?.hasSession ? (
              <button onClick={handleSignOut} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Выйти из системы
              </button>
            ) : (
              <a href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Войти в систему
              </a>
            )}

            <a href="/" className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
              На главную
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
