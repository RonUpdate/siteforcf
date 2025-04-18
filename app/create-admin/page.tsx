"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

export default function CreateAdminPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const supabase = createClient()

  const createAdminUser = async () => {
    setLoading(true)
    setMessage(null)

    try {
      // Создаем пользователя через API Supabase
      const { data, error } = await supabase.auth.signUp({
        email: "ronupert@gmail.com",
        password: "12345",
        options: {
          data: {
            role: "admin",
          },
        },
      })

      if (error) throw error

      // Проверяем, был ли пользователь создан
      if (data && data.user) {
        setMessage({
          type: "success",
          text: "Пользователь ronupert@gmail.com успешно создан! Проверьте почту для подтверждения.",
        })

        // Автоматически подтверждаем email (если у вас есть права администратора)
        try {
          await supabase.auth.admin.updateUserById(data.user.id, { email_confirm: true })

          setMessage({
            type: "success",
            text: "Пользователь ronupert@gmail.com успешно создан и email подтвержден!",
          })
        } catch (adminError) {
          console.log("Не удалось автоматически подтвердить email:", adminError)
          // Продолжаем, так как пользователь все равно создан
        }
      }
    } catch (error: any) {
      console.error("Ошибка при создании пользователя:", error)

      // Проверяем, существует ли уже пользователь
      if (error.message.includes("already exists")) {
        setMessage({
          type: "error",
          text: "Пользователь с email ronupert@gmail.com уже существует.",
        })
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

  const signInAsAdmin = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "ronupert@gmail.com",
        password: "12345",
      })

      if (error) throw error

      setMessage({
        type: "success",
        text: "Вы успешно вошли как ronupert@gmail.com!",
      })

      // Перезагружаем страницу для обновления сессии
      setTimeout(() => {
        window.location.href = "/admin"
      }, 1500)
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
    <div className="container mx-auto py-10 px-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Создание администратора</CardTitle>
          <CardDescription>Создание пользователя ronupert@gmail.com с правами администратора</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value="ronupert@gmail.com" disabled />
          </div>
          <div className="space-y-2">
            <Label>Пароль</Label>
            <Input value="12345" type="password" disabled />
          </div>

          {message && (
            <Alert variant={message.type === "error" ? "destructive" : "default"}>
              {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              <AlertTitle>{message.type === "error" ? "Ошибка" : "Успех"}</AlertTitle>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={createAdminUser} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Создание...
              </>
            ) : (
              "Создать пользователя"
            )}
          </Button>

          <Button onClick={signInAsAdmin} disabled={loading} variant="outline">
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
  )
}
