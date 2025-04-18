"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, RefreshCw, UserPlus } from "lucide-react"
import Link from "next/link"

// Get admin emails from environment variables or use default
const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS
  ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",")
  : ["admin@example.com"]

// Default admin email is the first in the list
const DEFAULT_ADMIN_EMAIL = ADMIN_EMAILS[0]

export default function AdminSetupPage() {
  const [email, setEmail] = useState(DEFAULT_ADMIN_EMAIL)
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [checkingUser, setCheckingUser] = useState(true)
  const [userExists, setUserExists] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null)
  const [adminUser, setAdminUser] = useState<any>(null)

  const supabase = createClient()

  // Проверяем существование пользователя при загрузке страницы
  useEffect(() => {
    checkAdminUser()
  }, [])

  // Функция для проверки существования администратора
  const checkAdminUser = async () => {
    setCheckingUser(true)
    setMessage(null)

    try {
      // Проверяем текущую сессию
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user && ADMIN_EMAILS.includes(user.email?.toLowerCase() || "")) {
          setUserExists(true)
          setAdminUser(user)
          setMessage({
            type: "success",
            text: `Вы вошли в систему как администратор (${user.email}).`,
          })
        } else {
          setUserExists(false)
          setMessage({
            type: "info",
            text: `Вы вошли как ${user?.email}, но этот пользователь не является администратором.`,
          })
        }
      } else {
        setUserExists(false)
        setMessage({
          type: "info",
          text: "Вы не вошли в систему. Создайте учетную запись администратора или войдите в существующую.",
        })
      }
    } catch (error: any) {
      console.error("Ошибка при проверке пользователя:", error)
      setMessage({
        type: "error",
        text: `Ошибка при проверке пользователя: ${error.message}`,
      })
    } finally {
      setCheckingUser(false)
    }
  }

  // Функция для создания пользователя администратора
  const createAdminUser = async () => {
    if (!password || password.length < 6) {
      setMessage({
        type: "error",
        text: "Пароль должен содержать не менее 6 символов",
      })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: "admin" },
        },
      })

      if (error) throw error

      setMessage({
        type: "success",
        text: `Пользователь ${email} успешно зарегистрирован! Проверьте почту для подтверждения.`,
      })
    } catch (error: any) {
      setMessage({
        type: "error",
        text: `Ошибка при регистрации пользователя: ${error.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  // Функция для входа как администратор
  const signInAsAdmin = async () => {
    if (!password) {
      setMessage({
        type: "error",
        text: "Введите пароль",
      })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      setAdminUser(data.user)
      setMessage({
        type: "success",
        text: `Вы успешно вошли как ${email}!`,
      })

      // Перезагружаем страницу для обновления сессии
      window.location.reload()
    } catch (error: any) {
      console.error("Ошибка при входе:", error)
      setMessage({
        type: "error",
        text: `Ошибка при входе: ${error.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Настройка администратора</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Статус администратора</CardTitle>
          <CardDescription>Администраторы: {ADMIN_EMAILS.join(", ")}</CardDescription>
        </CardHeader>
        <CardContent>
          {checkingUser ? (
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <p>Проверка статуса...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {message && (
                <Alert
                  variant={
                    message.type === "error" ? "destructive" : message.type === "success" ? "default" : "secondary"
                  }
                >
                  {message.type === "error" ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : message.type === "success" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {message.type === "error" ? "Ошибка" : message.type === "success" ? "Успех" : "Информация"}
                  </AlertTitle>
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}

              {adminUser && (
                <div className="bg-secondary p-4 rounded-md">
                  <h3 className="font-medium mb-2">Информация о пользователе:</h3>
                  <p>
                    <strong>Email:</strong> {adminUser.email}
                  </p>
                  <p>
                    <strong>Создан:</strong> {new Date(adminUser.created_at).toLocaleString()}
                  </p>
                  <p>
                    <strong>Роль:</strong> {adminUser.role || adminUser.user_metadata?.role || "Не указана"}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={checkAdminUser} disabled={checkingUser}>
            {checkingUser ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Проверка...
              </>
            ) : (
              "Проверить снова"
            )}
          </Button>
        </CardFooter>
      </Card>

      {!userExists && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Создать администратора</CardTitle>
              <CardDescription>Создайте нового пользователя-администратора</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email администратора"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Пароль</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={createAdminUser} disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Создание...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Создать администратора
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Войти как администратор</CardTitle>
              <CardDescription>Войдите в систему с учетными данными администратора</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email администратора"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Пароль</Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={signInAsAdmin} disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Вход...
                  </>
                ) : (
                  "Войти"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {userExists && (
        <Card>
          <CardHeader>
            <CardTitle>Доступ к админ-панели</CardTitle>
            <CardDescription>Вы успешно авторизованы как администратор</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Теперь вы можете перейти в административную панель для управления сайтом.</p>
          </CardContent>
          <CardFooter>
            <Link href="/admin">
              <Button>Перейти в админ-панель</Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
