"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export default function DebugSessionPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function checkSession() {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error

        console.log("Session data:", data)
        setSession(data.session)
      } catch (error: any) {
        console.error("Error checking session:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Подписываемся на изменения состояния аутентификации
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session)
      setSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleSignOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Обновляем состояние после выхода
      setSession(null)
      window.location.href = "/login"
    } catch (error: any) {
      console.error("Error signing out:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Отладка сессии</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Статус аутентификации:</h2>
              <p className="text-lg">
                {session ? (
                  <span className="text-green-600 font-bold">Авторизован</span>
                ) : (
                  <span className="text-red-600 font-bold">Не авторизован</span>
                )}
              </p>
            </div>

            {session && (
              <>
                <div>
                  <h2 className="text-lg font-semibold mb-2">Информация о пользователе:</h2>
                  <div className="bg-gray-100 p-4 rounded-md">
                    <p>
                      <strong>Email:</strong> {session.user.email}
                    </p>
                    <p>
                      <strong>ID:</strong> {session.user.id}
                    </p>
                    <p>
                      <strong>Роль:</strong>{" "}
                      {session.user.email === "admin@example.com" || session.user.email === "ronupert@gmail.com"
                        ? "Администратор"
                        : "Пользователь"}
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2">Токен доступа:</h2>
                  <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-32">
                    <code className="text-xs break-all">{session.access_token}</code>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link href="/admin">
                    <Button>Перейти в админ-панель</Button>
                  </Link>
                  <Button variant="destructive" onClick={handleSignOut}>
                    Выйти
                  </Button>
                </div>
              </>
            )}

            {!session && (
              <div className="flex gap-4">
                <Link href="/login">
                  <Button>Войти</Button>
                </Link>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-100 text-red-600 rounded-md">
                <p className="font-semibold">Ошибка:</p>
                <p>{error}</p>
              </div>
            )}

            <div className="mt-6">
              <Link href="/">
                <Button variant="outline">На главную</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
