"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Code, RefreshCw } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export default function SqlQueriesPage() {
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedQuery, setSelectedQuery] = useState<string>("check-user")

  const supabase = createClient()

  const queries = {
    "check-user": {
      title: "Проверить пользователя admin@example.com",
      description: "Проверяет существование пользователя admin@example.com в таблице auth.users",
      sql: `SELECT * FROM auth.users WHERE email = 'admin@example.com';`,
    },
    "check-policies": {
      title: "Проверить политики безопасности",
      description: "Проверяет настройки политик безопасности для таблиц products, categories и blog_posts",
      sql: `-- Проверка политик для таблицы products
SELECT * FROM pg_policies WHERE tablename = 'products';

-- Проверка политик для таблицы categories
SELECT * FROM pg_policies WHERE tablename = 'categories';

-- Проверка политик для таблицы blog_posts
SELECT * FROM pg_policies WHERE tablename = 'blog_posts';`,
    },
    "check-is-admin": {
      title: "Проверить функцию is_admin",
      description: "Проверяет определение функции is_admin",
      sql: `-- Проверка определения функции is_admin
SELECT pg_get_functiondef(oid) FROM pg_proc WHERE proname = 'is_admin';`,
    },
    "update-is-admin": {
      title: "Обновить функцию is_admin",
      description: "Обновляет функцию is_admin для использования правильного email",
      sql: `-- Обновление функции is_admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() ->> 'email') = 'admin@example.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`,
    },
  }

  const executeQuery = async () => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const query = queries[selectedQuery as keyof typeof queries].sql

      // Разделяем запрос на отдельные команды
      const commands = query.split(";").filter((cmd) => cmd.trim().length > 0)

      const results = []

      for (const cmd of commands) {
        // Пропускаем комментарии
        if (cmd.trim().startsWith("--")) continue

        const { data, error } = await supabase.rpc("execute_sql", { query: cmd })

        if (error) throw error

        results.push(data)
      }

      setResults(results)
    } catch (err: any) {
      console.error("Ошибка выполнения SQL:", err)
      setError(err.message || "Ошибка выполнения SQL-запроса")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">SQL-запросы для Supabase</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Доступные запросы</CardTitle>
              <CardDescription>Выберите SQL-запрос для выполнения</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(queries).map(([key, query]) => (
                  <Button
                    key={key}
                    variant={selectedQuery === key ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedQuery(key)}
                  >
                    <Code className="mr-2 h-4 w-4" />
                    {query.title}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{queries[selectedQuery as keyof typeof queries].title}</CardTitle>
              <CardDescription>{queries[selectedQuery as keyof typeof queries].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={queries[selectedQuery as keyof typeof queries].sql}
                readOnly
                className="font-mono h-40"
              />

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Ошибка</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {results && (
                <div className="space-y-4">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Запрос выполнен успешно</AlertTitle>
                  </Alert>

                  <div className="bg-secondary p-4 rounded-md overflow-auto max-h-60">
                    <pre className="text-xs">{JSON.stringify(results, null, 2)}</pre>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={executeQuery} disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Выполнение...
                  </>
                ) : (
                  "Выполнить запрос"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Важно</AlertTitle>
          <AlertDescription>
            Для выполнения некоторых SQL-запросов могут потребоваться права администратора Supabase. Если у вас нет прав
            администратора, некоторые запросы могут не выполниться.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
