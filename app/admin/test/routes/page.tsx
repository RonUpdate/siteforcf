"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

interface RouteTest {
  path: string
  name: string
  description: string
  status?: "success" | "error" | "pending"
  error?: string
}

export default function RoutesTestPage() {
  const [routes, setRoutes] = useState<RouteTest[]>([
    {
      path: "/admin",
      name: "Главная страница админки",
      description: "Должна отображать панель управления с карточками для продуктов, категорий и блог-постов",
    },
    {
      path: "/admin/products",
      name: "Список продуктов",
      description: "Должна отображать список всех продуктов с возможностью редактирования и удаления",
    },
    {
      path: "/admin/products/new",
      name: "Создание продукта",
      description: "Должна отображать форму для создания нового продукта",
    },
    {
      path: "/admin/categories",
      name: "Список категорий",
      description: "Должна отображать список всех категорий с возможностью редактирования и удаления",
    },
    {
      path: "/admin/categories/new",
      name: "Создание категории",
      description: "Должна отображать форму для создания новой категории",
    },
    {
      path: "/admin/blog-posts",
      name: "Список блог-постов",
      description: "Должна отображать список всех блог-постов с возможностью редактирования и удаления",
    },
    {
      path: "/admin/blog-posts/new",
      name: "Создание блог-поста",
      description: "Должна отображать форму для создания нового блог-поста",
    },
  ])

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoading(false)
    }

    checkUser()
  }, [supabase])

  const markRouteAsChecked = (index: number, status: "success" | "error", error?: string) => {
    setRoutes((prev) => {
      const newRoutes = [...prev]
      newRoutes[index] = {
        ...newRoutes[index],
        status,
        error,
      }
      return newRoutes
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Проверка маршрутов</h1>
        <Link href="/admin/test">
          <Button variant="outline">Назад к тестам</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : !user ? (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Ошибка аутентификации</AlertTitle>
          <AlertDescription>
            Вы не авторизованы. Пожалуйста, войдите в систему, чтобы проверить маршруты.
            <div className="mt-2">
              <Link href="/login">
                <Button>Войти</Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Инструкции</AlertTitle>
            <AlertDescription>
              Перейдите по каждому маршруту, проверьте его работоспособность и отметьте результат.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 gap-4">
            {routes.map((route, index) => (
              <Card
                key={index}
                className={
                  route.status === "success" ? "border-green-500" : route.status === "error" ? "border-red-500" : ""
                }
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {route.status === "success" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                    {route.status === "error" && <XCircle className="h-5 w-5 text-red-500" />}
                    {route.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{route.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Link href={route.path} target="_blank">
                      <Button variant="outline">Открыть в новой вкладке</Button>
                    </Link>
                    <Button
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => markRouteAsChecked(index, "success")}
                    >
                      Работает
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => markRouteAsChecked(index, "error", "Маршрут не работает")}
                    >
                      Не работает
                    </Button>
                  </div>

                  {route.status === "error" && route.error && (
                    <Alert variant="destructive" className="mt-4">
                      <XCircle className="h-4 w-4" />
                      <AlertTitle>Ошибка</AlertTitle>
                      <AlertDescription>{route.error}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
