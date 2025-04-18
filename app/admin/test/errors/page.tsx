"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

interface ErrorTest {
  name: string
  description: string
  action: () => Promise<void>
}

export default function ErrorsTestPage() {
  const [loading, setLoading] = useState(false)
  const [currentTest, setCurrentTest] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const supabase = createClient()

  const runTest = async (test: ErrorTest) => {
    setLoading(true)
    setCurrentTest(test.name)
    setError(null)
    setSuccess(null)

    try {
      await test.action()
      setSuccess(`Тест "${test.name}" успешно выполнен`)
    } catch (error: any) {
      console.error(`Ошибка в тесте "${test.name}":`, error)
      setError(error.message || `Ошибка в тесте "${test.name}"`)
    } finally {
      setLoading(false)
    }
  }

  const errorTests: ErrorTest[] = [
    {
      name: "Доступ к несуществующей таблице",
      description: "Попытка доступа к несуществующей таблице должна вызвать ошибку",
      action: async () => {
        const { data, error } = await supabase.from("non_existent_table").select("*")

        if (error) {
          throw error
        }

        throw new Error("Ожидалась ошибка, но ее не произошло")
      },
    },
    {
      name: "Нарушение уникальности",
      description: "Попытка создания записи с неуникальным значением должна вызвать ошибку",
      action: async () => {
        // Сначала создаем тестовую категорию
        const testSlug = `test-${Date.now()}`

        await supabase.from("categories").insert({
          title: "Test Category",
          slug: testSlug,
        })

        // Пытаемся создать категорию с тем же slug
        const { error } = await supabase.from("categories").insert({
          title: "Another Test Category",
          slug: testSlug,
        })

        if (!error) {
          // Удаляем тестовые данные
          await supabase.from("categories").delete().eq("slug", testSlug)
          throw new Error("Ожидалась ошибка уникальности, но ее не произошло")
        }

        // Удаляем тестовые данные
        await supabase.from("categories").delete().eq("slug", testSlug)

        // Тест прошел успешно, если была ошибка
        return
      },
    },
    {
      name: "Нарушение внешнего ключа",
      description: "Попытка создания записи с несуществующим внешним ключом должна вызвать ошибку",
      action: async () => {
        const { error } = await supabase.from("products").insert({
          title: "Test Product",
          description: "Test Description",
          category_id: "non-existent-id",
        })

        if (!error) {
          throw new Error("Ожидалась ошибка внешнего ключа, но ее не произошло")
        }

        return
      },
    },
    {
      name: "Недостаточные права",
      description: "Попытка выполнения операции без необходимых прав должна вызвать ошибку",
      action: async () => {
        // Создаем новый клиент без авторизации
        const anonSupabase = createClient()

        // Выходим из системы
        await anonSupabase.auth.signOut()

        // Пытаемся создать запись
        const { error } = await anonSupabase.from("products").insert({
          title: "Test Product",
          description: "Test Description",
        })

        // Восстанавливаем сессию
        const { data } = await supabase.auth.getSession()

        if (!error) {
          throw new Error("Ожидалась ошибка прав доступа, но ее не произошло")
        }

        return
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Тестирование обработки ошибок</h1>
        <Link href="/admin/test">
          <Button variant="outline">Назад к тестам</Button>
        </Link>
      </div>

      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Информация</AlertTitle>
        <AlertDescription>
          Эта страница позволяет проверить, как система обрабатывает различные ошибки. Каждый тест намеренно вызывает
          ошибку, чтобы проверить ее корректную обработку.
        </AlertDescription>
      </Alert>

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Успех</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-4">
        {errorTests.map((test) => (
          <Card key={test.name}>
            <CardHeader>
              <CardTitle>{test.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{test.description}</p>
              <Button onClick={() => runTest(test)} disabled={loading && currentTest === test.name}>
                {loading && currentTest === test.name ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Тестирование...
                  </>
                ) : (
                  "Запустить тест"
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Проверка обработки ошибок в формах</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Проверьте, как формы обрабатывают следующие ошибки:</p>

          <div className="space-y-2">
            <div className="flex items-center">
              <input type="checkbox" id="check1" className="mr-2" />
              <label htmlFor="check1">Отправка пустой формы (обязательные поля)</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="check2" className="mr-2" />
              <label htmlFor="check2">Дублирование уникальных значений (slug категории или блог-поста)</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="check3" className="mr-2" />
              <label htmlFor="check3">Загрузка файла неправильного формата</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="check4" className="mr-2" />
              <label htmlFor="check4">Отмена операции (кнопка "Отмена" в формах)</label>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Link href="/admin/products/new">
              <Button variant="outline">Форма продукта</Button>
            </Link>
            <Link href="/admin/categories/new">
              <Button variant="outline">Форма категории</Button>
            </Link>
            <Link href="/admin/blog-posts/new">
              <Button variant="outline">Форма блог-поста</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
