"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function DebugPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function checkSession() {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        setSession(data.session)
      } catch (error) {
        console.error("Error checking session:", error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8 flex justify-center">
        <p>Загрузка...</p>
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
