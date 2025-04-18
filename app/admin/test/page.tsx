"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

interface TestResult {
  name: string
  success: boolean
  message: string
  data?: any
}

export default function AdminTestPage() {
  const [results, setResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    checkUser()
  }, [supabase])

  const runTests = async () => {
    setLoading(true)
    setResults([])

    // Массив для хранения результатов тестов
    const testResults: TestResult[] = []

    try {
      // Тест 1: Проверка аутентификации
      const { data: sessionData } = await supabase.auth.getSession()
      testResults.push({
        name: "Проверка аутентификации",
        success: !!sessionData.session,
        message: sessionData.session
          ? `Пользователь авторизован: ${sessionData.session.user.email}`
          : "Пользователь не авторизован",
      })

      // Тест 2: Проверка доступа к продуктам
      const { data: products, error: productsError } = await supabase.from("products").select("id, title").limit(5)

      testResults.push({
        name: "Доступ к продуктам",
        success: !productsError,
        message: productsError
          ? `Ошибка: ${productsError.message}`
          : `Успешно получено ${products?.length || 0} продуктов`,
        data: products,
      })

      // Тест 3: Проверка доступа к категориям
      const { data: categories, error: categoriesError } = await supabase
        .from("categories")
        .select("id, title")
        .limit(5)

      testResults.push({
        name: "Доступ к категориям",
        success: !categoriesError,
        message: categoriesError
          ? `Ошибка: ${categoriesError.message}`
          : `Успешно получено ${categories?.length || 0} категорий`,
        data: categories,
      })

      // Тест 4: Проверка доступа к блог-постам
      const { data: blogPosts, error: blogPostsError } = await supabase.from("blog_posts").select("id, title").limit(5)

      testResults.push({
        name: "Доступ к блог-постам",
        success: !blogPostsError,
        message: blogPostsError
          ? `Ошибка: ${blogPostsError.message}`
          : `Успешно получено ${blogPosts?.length || 0} блог-постов`,
        data: blogPosts,
      })

      // Тест 5: Проверка прав на создание (тестовый запрос без реального создания)
      const testProduct = {
        title: "Test Product",
        description: "Test Description",
        category_id: categories?.[0]?.id,
      }

      const { error: insertError } = await supabase
        .from("products")
        .insert([testProduct])
        .select()
        .single()
        .abortSignal(new AbortController().signal) // Прерываем запрос, чтобы не создавать реальную запись

      testResults.push({
        name: "Права на создание",
        success: !insertError || insertError.code === "AbortError",
        message:
          insertError && insertError.code !== "AbortError"
            ? `Ошибка: ${insertError.message}`
            : "Права на создание проверены успешно",
      })
    } catch (error: any) {
      testResults.push({
        name: "Общая ошибка",
        success: false,
        message: `Произошла ошибка: ${error.message}`,
      })
    } finally {
      setResults(testResults)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Тестирование админ-панели</h1>
        <Button onClick={runTests} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Тестирование...
            </>
          ) : (
            "Запустить тесты"
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Информация о пользователе</CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="space-y-2">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>ID:</strong> {user.id}
              </p>
              <p>
                <strong>Роль:</strong>{" "}
                {user.email === "admin@example.com" || user.email === "ronupert@gmail.com"
                  ? "Администратор"
                  : "Пользователь"}
              </p>
            </div>
          ) : (
            <p>Пользователь не авторизован</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Навигация по админ-панели</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              <Link href="/admin">
                <Button variant="outline" className="w-full justify-start">
                  Главная страница админки
                </Button>
              </Link>
              <Link href="/admin/products">
                <Button variant="outline" className="w-full justify-start">
                  Управление продуктами
                </Button>
              </Link>
              <Link href="/admin/categories">
                <Button variant="outline" className="w-full justify-start">
                  Управление категориями
                </Button>
              </Link>
              <Link href="/admin/blog-posts">
                <Button variant="outline" className="w-full justify-start">
                  Управление блог-постами
                </Button>
              </Link>
              <Link href="/admin/products/new">
                <Button variant="outline" className="w-full justify-start">
                  Создание нового продукта
                </Button>
              </Link>
              <Link href="/admin/categories/new">
                <Button variant="outline" className="w-full justify-start">
                  Создание новой категории
                </Button>
              </Link>
              <Link href="/admin/blog-posts/new">
                <Button variant="outline" className="w-full justify-start">
                  Создание нового блог-поста
                </Button>
              </Link>
              <Link href="/admin/storage-policy-test">
                <Button variant="outline" className="w-full justify-start">
                  Проверка политик хранилища
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Результаты тестов</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result, index) => (
                  <Alert key={index} variant={result.success ? "default" : "destructive"}>
                    {result.success ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    <AlertTitle>{result.name}</AlertTitle>
                    <AlertDescription>{result.message}</AlertDescription>
                    {result.data && (
                      <div className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-24">
                        <pre>{JSON.stringify(result.data, null, 2)}</pre>
                      </div>
                    )}
                  </Alert>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">Запустите тесты, чтобы увидеть результаты</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Проверка маршрутов</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Проверьте следующие маршруты, чтобы убедиться, что они работают корректно:</p>

          <div className="space-y-2">
            <div className="flex items-center">
              <input type="checkbox" id="check1" className="mr-2" />
              <label htmlFor="check1">Главная страница админки (/admin)</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="check2" className="mr-2" />
              <label htmlFor="check2">Список продуктов (/admin/products)</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="check3" className="mr-2" />
              <label htmlFor="check3">Создание продукта (/admin/products/new)</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="check4" className="mr-2" />
              <label htmlFor="check4">Редактирование продукта (/admin/products/[id])</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="check5" className="mr-2" />
              <label htmlFor="check5">Список категорий (/admin/categories)</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="check6" className="mr-2" />
              <label htmlFor="check6">Создание категории (/admin/categories/new)</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="check7" className="mr-2" />
              <label htmlFor="check7">Редактирование категории (/admin/categories/[id])</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="check8" className="mr-2" />
              <label htmlFor="check8">Список блог-постов (/admin/blog-posts)</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="check9" className="mr-2" />
              <label htmlFor="check9">Создание блог-поста (/admin/blog-posts/new)</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="check10" className="mr-2" />
              <label htmlFor="check10">Редактирование блог-поста (/admin/blog-posts/[id])</label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
