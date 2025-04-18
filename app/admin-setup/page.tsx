"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, RefreshCw, UserPlus } from "lucide-react"

export default function AdminSetupPage() {
  const [email, setEmail] = useState("admin@example.com")
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

  // Функция для проверки существования пользователя admin@example.com
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

        if (user && user.email === "admin@example.com") {
          setUserExists(true)
          setAdminUser(user)
          setMessage({
            type: "success",
            text: "Пользователь admin@example.com существует и вы вошли в систему как этот пользователь.",
          })
        } else {
          // Если текущий пользователь не admin@example.com, проверяем существование admin@example.com
          const { data, error } = await supabase.auth.admin.listUsers()

          if (error) {
            throw error
          }

          const adminUser = data.users.find((user) => user.email === "admin@example.com")

          if (adminUser) {
            setUserExists(true)
            setAdminUser(adminUser)
            setMessage({
              type: "info",
              text: "Пользователь admin@example.com существует, но вы не вошли в систему как этот пользователь.",
            })
          } else {
            setUserExists(false)
            setMessage({
              type: "info",
              text: "Пользователь admin@example.com не существует.",
            })
          }
        }
      } else {
        // Если нет активной сессии, проверяем существование admin@example.com
        const { data, error } = await supabase.auth.admin.listUsers()

        if (error) {
          // Если нет прав администратора, пробуем другой подход
          setUserExists(false)
          setMessage({
            type: "info",
            text: "Невозможно проверить существование пользователя. Попробуйте войти как admin@example.com.",
          })
        } else {
          const adminUser = data.users.find((user) => user.email === "admin@example.com")

          if (adminUser) {
            setUserExists(true)
            setAdminUser(adminUser)
            setMessage({
              type: "info",
              text: "Пользователь admin@example.com существует, но вы не вошли в систему.",
            })
          } else {
            setUserExists(false)
            setMessage({
              type: "info",
              text: "Пользователь admin@example.com не существует.",
            })
          }
        }
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

  // Функция для создания пользователя admin@example.com
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
      // Создаем нового пользователя
      const { data, error } = await supabase.auth.admin.createUser({
        email: "admin@example.com",
        password,
        email_confirm: true, // Автоматически подтверждаем email
        user_metadata: { role: "admin" },
      })

      if (error) throw error

      setUserExists(true)
      setAdminUser(data.user)
      setMessage({
        type: "success",
        text: "Пользователь admin@example.com успешно создан!",
      })
    } catch (error: any) {
      console.error("Ошибка при создании пользователя:", error)

      // Если нет прав администратора, предлагаем использовать обычную регистрацию
      if (error.message.includes("not authorized")) {
        try {
          const { data, error: signUpError } = await supabase.auth.signUp({
            email: "admin@example.com",
            password,
            options: {
              data: { role: "admin" },
            },
          })

          if (signUpError) throw signUpError

          setMessage({
            type: "success",
            text: "Пользователь admin@example.com успешно зарегистрирован! Проверьте почту для подтверждения.",
          })
        } catch (signUpError: any) {
          setMessage({
            type: "error",
            text: `Ошибка при регистрации пользователя: ${signUpError.message}`,
          })
        }
      } else {
        setMessage({
          type: "error",
          text: `Ошибка при создании пользователя: ${error.message}`,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  // Функция для входа как admin@example.com
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
        email: "admin@example.com",
        password,
      })

      if (error) throw error

      setAdminUser(data.user)
      setMessage({
        type: "success",
        text: "Вы успешно вошли как admin@example.com!",
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
      <h1 className="text-3xl font-bold mb-6">Настройка администратора Supabase</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Статус пользователя admin@example.com</CardTitle>
          <CardDescription>Проверка существования пользователя admin@example.com в Supabase</CardDescription>
        </CardHeader>
        <CardContent>
          {checkingUser ? (
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <p>Проверка пользователя...</p>
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
                    <strong>ID:</strong> {adminUser.id}
                  </p>
                  <p>
                    <strong>Email:</strong> {adminUser.email}
                  </p>
                  <p>
                    <strong>Создан:</strong> {new Date(adminUser.created_at).toLocaleString()}
                  </p>
                  <p>
                    <strong>Подтвержден:</strong> {adminUser.email_confirmed_at ? "Да" : "Нет"}
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

      <Tabs defaultValue={userExists ? "signin" : "create"}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Создать пользователя</TabsTrigger>
          <TabsTrigger value="signin">Войти как admin</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Создать пользователя admin@example.com</CardTitle>
              <CardDescription>Создайте нового пользователя с email admin@example.com</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input id="admin-email" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
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
              <Button onClick={createAdminUser} disabled={loading || userExists}>
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Создание...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Создать пользователя
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle>Войти как admin@example.com</CardTitle>
              <CardDescription>Войдите в систему с учетными данными admin@example.com</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input id="signin-email" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
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
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Следующие шаги</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Создайте пользователя admin@example.com, если он не существует</li>
          <li>Войдите в систему с учетными данными admin@example.com</li>
          <li>
            Проверьте доступ к админ-панели по адресу{" "}
            <a href="/admin" className="text-blue-600 hover:underline">
              /admin
            </a>
          </li>
          <li>Если проблемы с доступом остаются, проверьте настройки политик безопасности в Supabase</li>
        </ol>
      </div>
    </div>
  )
}
