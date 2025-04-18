"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, XCircle, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { v4 as uuidv4 } from "uuid"

interface TestResult {
  name: string
  success: boolean
  message: string
  data?: any
}

export default function StoragePolicyTestPage() {
  const [results, setResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("read")
  const [user, setUser] = useState<any>(null)

  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    checkUser()
  }, [supabase])

  const addResult = (result: TestResult) => {
    setResults((prev) => [result, ...prev])
  }

  const clearResults = () => {
    setResults([])
  }

  // Тест на чтение изображений из хранилища
  const testReadAccess = async () => {
    setLoading(true)
    clearResults()

    try {
      // Получаем список файлов из бакета product-images
      const { data: productImages, error: productImagesError } = await supabase.storage.from("product-images").list()

      addResult({
        name: "Чтение списка файлов из product-images",
        success: !productImagesError,
        message: productImagesError
          ? `Ошибка: ${productImagesError.message}`
          : `Успешно получено ${productImages?.length || 0} файлов`,
        data: productImages,
      })

      // Получаем список файлов из бакета blog-images
      const { data: blogImages, error: blogImagesError } = await supabase.storage.from("blog-images").list()

      addResult({
        name: "Чтение списка файлов из blog-images",
        success: !blogImagesError,
        message: blogImagesError
          ? `Ошибка: ${blogImagesError.message}`
          : `Успешно получено ${blogImages?.length || 0} файлов`,
        data: blogImages,
      })

      // Проверяем публичный доступ к файлам
      if (productImages && productImages.length > 0) {
        const testFile = productImages[0]
        const { data: publicUrl } = supabase.storage.from("product-images").getPublicUrl(testFile.name)

        addResult({
          name: "Получение публичного URL для файла из product-images",
          success: !!publicUrl,
          message: publicUrl ? `Публичный URL: ${publicUrl.publicUrl}` : "Не удалось получить публичный URL",
          data: publicUrl,
        })

        // Проверяем доступность файла по публичному URL
        try {
          const response = await fetch(publicUrl.publicUrl, { method: "HEAD" })
          addResult({
            name: "Проверка доступности файла по публичному URL",
            success: response.ok,
            message: response.ok
              ? `Файл доступен, статус: ${response.status}`
              : `Файл недоступен, статус: ${response.status}`,
          })
        } catch (error: any) {
          addResult({
            name: "Проверка доступности файла по публичному URL",
            success: false,
            message: `Ошибка при проверке доступности файла: ${error.message}`,
          })
        }
      }
    } catch (error: any) {
      addResult({
        name: "Общая ошибка при тестировании чтения",
        success: false,
        message: `Произошла ошибка: ${error.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  // Тест на запись изображений в хранилище
  const testWriteAccess = async () => {
    setLoading(true)
    clearResults()

    try {
      // Создаем тестовый файл
      const testData = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) // PNG header
      const testFileName = `test-${uuidv4()}.png`

      // Пробуем загрузить файл в product-images
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(testFileName, testData)

      addResult({
        name: "Загрузка файла в product-images",
        success: !uploadError,
        message: uploadError ? `Ошибка: ${uploadError.message}` : `Файл успешно загружен: ${testFileName}`,
        data: uploadData,
      })

      // Если загрузка успешна, пробуем удалить файл
      if (!uploadError && uploadData) {
        const { error: deleteError } = await supabase.storage.from("product-images").remove([testFileName])

        addResult({
          name: "Удаление файла из product-images",
          success: !deleteError,
          message: deleteError ? `Ошибка: ${deleteError.message}` : `Файл успешно удален: ${testFileName}`,
        })
      }

      // Пробуем загрузить файл в blog-images
      const testFileNameBlog = `test-${uuidv4()}.png`
      const { data: uploadDataBlog, error: uploadErrorBlog } = await supabase.storage
        .from("blog-images")
        .upload(testFileNameBlog, testData)

      addResult({
        name: "Загрузка файла в blog-images",
        success: !uploadErrorBlog,
        message: uploadErrorBlog ? `Ошибка: ${uploadErrorBlog.message}` : `Файл успешно загружен: ${testFileNameBlog}`,
        data: uploadDataBlog,
      })

      // Если загрузка успешна, пробуем удалить файл
      if (!uploadErrorBlog && uploadDataBlog) {
        const { error: deleteErrorBlog } = await supabase.storage.from("blog-images").remove([testFileNameBlog])

        addResult({
          name: "Удаление файла из blog-images",
          success: !deleteErrorBlog,
          message: deleteErrorBlog ? `Ошибка: ${deleteErrorBlog.message}` : `Файл успешно удален: ${testFileNameBlog}`,
        })
      }
    } catch (error: any) {
      addResult({
        name: "Общая ошибка при тестировании записи",
        success: false,
        message: `Произошла ошибка: ${error.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  // Тест на проверку политик доступа
  const testPolicies = async () => {
    setLoading(true)
    clearResults()

    try {
      // Получаем политики для хранилища
      const { data: policies, error: policiesError } = await supabase
        .from("pg_policies")
        .select("*")
        .ilike("tablename", "objects")

      addResult({
        name: "Получение политик для хранилища",
        success: !policiesError,
        message: policiesError
          ? `Ошибка: ${policiesError.message}`
          : `Успешно получено ${policies?.length || 0} политик`,
        data: policies,
      })

      // Проверяем наличие политик для product-images
      const productImagesPolicies = policies?.filter(
        (p) => p.policyname.includes("product images") || p.policyname.includes("Product images"),
      )

      addResult({
        name: "Проверка политик для product-images",
        success: productImagesPolicies && productImagesPolicies.length >= 4,
        message:
          productImagesPolicies && productImagesPolicies.length >= 4
            ? `Найдено ${productImagesPolicies.length} политик для product-images`
            : `Недостаточно политик для product-images. Найдено: ${productImagesPolicies?.length || 0}, ожидалось минимум 4`,
        data: productImagesPolicies,
      })

      // Проверяем наличие политик для blog-images
      const blogImagesPolicies = policies?.filter(
        (p) => p.policyname.includes("blog images") || p.policyname.includes("Blog images"),
      )

      addResult({
        name: "Проверка политик для blog-images",
        success: blogImagesPolicies && blogImagesPolicies.length >= 4,
        message:
          blogImagesPolicies && blogImagesPolicies.length >= 4
            ? `Найдено ${blogImagesPolicies.length} политик для blog-images`
            : `Недостаточно политик для blog-images. Найдено: ${blogImagesPolicies?.length || 0}, ожидалось минимум 4`,
        data: blogImagesPolicies,
      })
    } catch (error: any) {
      addResult({
        name: "Общая ошибка при тестировании политик",
        success: false,
        message: `Произошла ошибка: ${error.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Тестирование политик доступа к хранилищу</h1>
        <Link href="/admin">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад в админ-панель
          </Button>
        </Link>
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="read">Чтение</TabsTrigger>
          <TabsTrigger value="write">Запись</TabsTrigger>
          <TabsTrigger value="policies">Политики</TabsTrigger>
        </TabsList>

        <TabsContent value="read" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Тестирование доступа на чтение</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Этот тест проверяет возможность чтения файлов из хранилища Supabase Storage. Будет проверено:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Получение списка файлов из бакетов product-images и blog-images</li>
                <li>Получение публичного URL для файла</li>
                <li>Проверка доступности файла по публичному URL</li>
              </ul>

              <Button onClick={testReadAccess} disabled={loading}>
                {loading ? (
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
        </TabsContent>

        <TabsContent value="write" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Тестирование доступа на запись</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Этот тест проверяет возможность записи и удаления файлов в хранилище Supabase Storage. Будет проверено:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Загрузка тестового файла в бакеты product-images и blog-images</li>
                <li>Удаление тестового файла из бакетов</li>
              </ul>

              <Alert>
                <AlertTitle>Примечание</AlertTitle>
                <AlertDescription>
                  Для успешного выполнения этого теста вы должны быть авторизованы как администратор.
                </AlertDescription>
              </Alert>

              <Button onClick={testWriteAccess} disabled={loading}>
                {loading ? (
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
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Проверка политик доступа</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Этот тест проверяет наличие и настройку политик доступа к хранилищу Supabase Storage. Будет проверено:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Наличие политик для бакетов product-images и blog-images</li>
                <li>Корректность настройки политик для различных операций (SELECT, INSERT, UPDATE, DELETE)</li>
              </ul>

              <Button onClick={testPolicies} disabled={loading}>
                {loading ? (
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
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Результаты тестов</CardTitle>
        </CardHeader>
        <CardContent>
          {results.length > 0 ? (
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
            <p className="text-center text-gray-500 py-4">Запустите тест, чтобы увидеть результаты</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Рекомендации по настройке политик</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Если тесты показывают проблемы с политиками доступа, выполните следующие действия:</p>

          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Убедитесь, что в Supabase созданы бакеты <code>product-images</code> и <code>blog-images</code>
            </li>
            <li>
              Выполните SQL-скрипт <code>supabase/storage-policies.sql</code> в SQL-редакторе Supabase
            </li>
            <li>
              Убедитесь, что для бакетов включена опция <strong>Enable Row Level Security (RLS)</strong>
            </li>
            <li>Проверьте, что политики применяются к правильным бакетам и операциям</li>
            <li>Перезапустите тесты для проверки корректности настройки политик</li>
          </ol>

          <div className="mt-4">
            <Link href="/admin/test">
              <Button variant="outline">Перейти к странице тестирования</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
