"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

interface TestResult {
  operation: string
  entity: string
  success: boolean
  message: string
  data?: any
}

export default function CrudTestPage() {
  const [results, setResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("products")

  // Состояния для продукта
  const [productTitle, setProductTitle] = useState("Тестовый продукт")
  const [productDescription, setProductDescription] = useState("Описание тестового продукта")
  const [productId, setProductId] = useState("")

  // Состояния для категории
  const [categoryTitle, setCategoryTitle] = useState("Тестовая категория")
  const [categorySlug, setCategorySlug] = useState("test-category")
  const [categoryId, setCategoryId] = useState("")

  // Состояния для блог-поста
  const [blogTitle, setBlogTitle] = useState("Тестовый блог-пост")
  const [blogSlug, setBlogSlug] = useState("test-blog-post")
  const [blogContent, setBlogContent] = useState("Содержимое тестового блог-поста")
  const [blogId, setBlogId] = useState("")

  const supabase = createClient()

  const addResult = (result: TestResult) => {
    setResults((prev) => [result, ...prev])
  }

  // Функции для тестирования CRUD операций с продуктами
  const createProduct = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            title: productTitle,
            description: productDescription,
          },
        ])
        .select()
        .single()

      if (error) throw error

      setProductId(data.id)

      addResult({
        operation: "CREATE",
        entity: "Product",
        success: true,
        message: `Продукт успешно создан с ID: ${data.id}`,
        data,
      })
    } catch (error: any) {
      addResult({
        operation: "CREATE",
        entity: "Product",
        success: false,
        message: `Ошибка при создании продукта: ${error.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const readProduct = async () => {
    if (!productId) {
      addResult({
        operation: "READ",
        entity: "Product",
        success: false,
        message: "Сначала создайте продукт или введите ID существующего продукта",
      })
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.from("products").select("*").eq("id", productId).single()

      if (error) throw error

      addResult({
        operation: "READ",
        entity: "Product",
        success: true,
        message: `Продукт успешно получен: ${data.title}`,
        data,
      })
    } catch (error: any) {
      addResult({
        operation: "READ",
        entity: "Product",
        success: false,
        message: `Ошибка при получении продукта: ${error.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const updateProduct = async () => {
    if (!productId) {
      addResult({
        operation: "UPDATE",
        entity: "Product",
        success: false,
        message: "Сначала создайте продукт или введите ID существующего продукта",
      })
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("products")
        .update({
          title: `${productTitle} (обновлено)`,
          description: `${productDescription} (обновлено)`,
        })
        .eq("id", productId)
        .select()
        .single()

      if (error) throw error

      addResult({
        operation: "UPDATE",
        entity: "Product",
        success: true,
        message: `Продукт успешно обновлен: ${data.title}`,
        data,
      })
    } catch (error: any) {
      addResult({
        operation: "UPDATE",
        entity: "Product",
        success: false,
        message: `Ошибка при обновлении продукта: ${error.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async () => {
    if (!productId) {
      addResult({
        operation: "DELETE",
        entity: "Product",
        success: false,
        message: "Сначала создайте продукт или введите ID существующего продукта",
      })
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.from("products").delete().eq("id", productId)

      if (error) throw error

      addResult({
        operation: "DELETE",
        entity: "Product",
        success: true,
        message: `Продукт успешно удален с ID: ${productId}`,
      })

      setProductId("")
    } catch (error: any) {
      addResult({
        operation: "DELETE",
        entity: "Product",
        success: false,
        message: `Ошибка при удалении продукта: ${error.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  // Функции для тестирования CRUD операций с категориями
  const createCategory = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("categories")
        .insert([
          {
            title: categoryTitle,
            slug: categorySlug,
          },
        ])
        .select()
        .single()

      if (error) throw error

      setCategoryId(data.id)

      addResult({
        operation: "CREATE",
        entity: "Category",
        success: true,
        message: `Категория успешно создана с ID: ${data.id}`,
        data,
      })
    } catch (error: any) {
      addResult({
        operation: "CREATE",
        entity: "Category",
        success: false,
        message: `Ошибка при создании категории: ${error.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const readCategory = async () => {
    if (!categoryId) {
      addResult({
        operation: "READ",
        entity: "Category",
        success: false,
        message: "Сначала создайте категорию или введите ID существующей категории",
      })
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.from("categories").select("*").eq("id", categoryId).single()

      if (error) throw error

      addResult({
        operation: "READ",
        entity: "Category",
        success: true,
        message: `Категория успешно получена: ${data.title}`,
        data,
      })
    } catch (error: any) {
      addResult({
        operation: "READ",
        entity: "Category",
        success: false,
        message: `Ошибка при получении категории: ${error.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const updateCategory = async () => {
    if (!categoryId) {
      addResult({
        operation: "UPDATE",
        entity: "Category",
        success: false,
        message: "Сначала создайте категорию или введите ID существующей категории",
      })
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("categories")
        .update({
          title: `${categoryTitle} (обновлено)`,
          slug: `${categorySlug}-updated`,
        })
        .eq("id", categoryId)
        .select()
        .single()

      if (error) throw error

      addResult({
        operation: "UPDATE",
        entity: "Category",
        success: true,
        message: `Категория успешно обновлена: ${data.title}`,
        data,
      })
    } catch (error: any) {
      addResult({
        operation: "UPDATE",
        entity: "Category",
        success: false,
        message: `Ошибка при обновлении категории: ${error.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteCategory = async () => {
    if (!categoryId) {
      addResult({
        operation: "DELETE",
        entity: "Category",
        success: false,
        message: "Сначала создайте категорию или введите ID существующей категории",
      })
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.from("categories").delete().eq("id", categoryId)

      if (error) throw error

      addResult({
        operation: "DELETE",
        entity: "Category",
        success: true,
        message: `Категория успешно удалена с ID: ${categoryId}`,
      })

      setCategoryId("")
    } catch (error: any) {
      addResult({
        operation: "DELETE",
        entity: "Category",
        success: false,
        message: `Ошибка при удалении категории: ${error.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  // Функции для тестирования CRUD операций с блог-постами
  const createBlogPost = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .insert([
          {
            title: blogTitle,
            slug: blogSlug,
            content: blogContent,
          },
        ])
        .select()
        .single()

      if (error) throw error

      setBlogId(data.id)

      addResult({
        operation: "CREATE",
        entity: "BlogPost",
        success: true,
        message: `Блог-пост успешно создан с ID: ${data.id}`,
        data,
      })
    } catch (error: any) {
      addResult({
        operation: "CREATE",
        entity: "BlogPost",
        success: false,
        message: `Ошибка при создании блог-поста: ${error.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const readBlogPost = async () => {
    if (!blogId) {
      addResult({
        operation: "READ",
        entity: "BlogPost",
        success: false,
        message: "Сначала создайте блог-пост или введите ID существующего блог-поста",
      })
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("id", blogId).single()

      if (error) throw error

      addResult({
        operation: "READ",
        entity: "BlogPost",
        success: true,
        message: `Блог-пост успешно получен: ${data.title}`,
        data,
      })
    } catch (error: any) {
      addResult({
        operation: "READ",
        entity: "BlogPost",
        success: false,
        message: `Ошибка при получении блог-поста: ${error.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const updateBlogPost = async () => {
    if (!blogId) {
      addResult({
        operation: "UPDATE",
        entity: "BlogPost",
        success: false,
        message: "Сначала создайте блог-пост или введите ID существующего блог-поста",
      })
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .update({
          title: `${blogTitle} (обновлено)`,
          slug: `${blogSlug}-updated`,
          content: `${blogContent} (обновлено)`,
        })
        .eq("id", blogId)
        .select()
        .single()

      if (error) throw error

      addResult({
        operation: "UPDATE",
        entity: "BlogPost",
        success: true,
        message: `Блог-пост успешно обновлен: ${data.title}`,
        data,
      })
    } catch (error: any) {
      addResult({
        operation: "UPDATE",
        entity: "BlogPost",
        success: false,
        message: `Ошибка при обновлении блог-поста: ${error.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteBlogPost = async () => {
    if (!blogId) {
      addResult({
        operation: "DELETE",
        entity: "BlogPost",
        success: false,
        message: "Сначала создайте блог-пост или введите ID существующего блог-поста",
      })
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", blogId)

      if (error) throw error

      addResult({
        operation: "DELETE",
        entity: "BlogPost",
        success: true,
        message: `Блог-пост успешно удален с ID: ${blogId}`,
      })

      setBlogId("")
    } catch (error: any) {
      addResult({
        operation: "DELETE",
        entity: "BlogPost",
        success: false,
        message: `Ошибка при удалении блог-поста: ${error.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Тестирование CRUD операций</h1>
        <Link href="/admin/test">
          <Button variant="outline">Назад к тестам</Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="products">Продукты</TabsTrigger>
          <TabsTrigger value="categories">Категории</TabsTrigger>
          <TabsTrigger value="blog-posts">Блог-посты</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Тестирование CRUD операций с продуктами</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Название продукта</label>
                  <Input
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    placeholder="Введите название продукта"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ID продукта (для чтения/обновления/удаления)</label>
                  <Input
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    placeholder="ID существующего продукта или создайте новый"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Описание продукта</label>
                <Textarea
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Введите описание продукта"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={createProduct} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Создать
                </Button>
                <Button onClick={readProduct} disabled={loading} variant="outline">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Прочитать
                </Button>
                <Button onClick={updateProduct} disabled={loading} variant="outline">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Обновить
                </Button>
                <Button onClick={deleteProduct} disabled={loading} variant="destructive">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Удалить
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Тестирование CRUD операций с категориями</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Название категории</label>
                  <Input
                    value={categoryTitle}
                    onChange={(e) => setCategoryTitle(e.target.value)}
                    placeholder="Введите название категории"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    ID категории (для чтения/обновления/удаления)
                  </label>
                  <Input
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    placeholder="ID существующей категории или создайте новую"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Slug категории</label>
                <Input
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  placeholder="Введите slug категории"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={createCategory} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Создать
                </Button>
                <Button onClick={readCategory} disabled={loading} variant="outline">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Прочитать
                </Button>
                <Button onClick={updateCategory} disabled={loading} variant="outline">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Обновить
                </Button>
                <Button onClick={deleteCategory} disabled={loading} variant="destructive">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Удалить
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blog-posts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Тестирование CRUD операций с блог-постами</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Заголовок блог-поста</label>
                  <Input
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    placeholder="Введите заголовок блог-поста"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    ID блог-поста (для чтения/обновления/удаления)
                  </label>
                  <Input
                    value={blogId}
                    onChange={(e) => setBlogId(e.target.value)}
                    placeholder="ID существующего блог-поста или создайте новый"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Slug блог-поста</label>
                <Input
                  value={blogSlug}
                  onChange={(e) => setBlogSlug(e.target.value)}
                  placeholder="Введите slug блог-поста"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Содержимое блог-поста</label>
                <Textarea
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  placeholder="Введите содержимое блог-поста"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={createBlogPost} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Создать
                </Button>
                <Button onClick={readBlogPost} disabled={loading} variant="outline">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Прочитать
                </Button>
                <Button onClick={updateBlogPost} disabled={loading} variant="outline">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Обновить
                </Button>
                <Button onClick={deleteBlogPost} disabled={loading} variant="destructive">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Удалить
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Результаты операций</CardTitle>
        </CardHeader>
        <CardContent>
          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result, index) => (
                <Alert key={index} variant={result.success ? "default" : "destructive"}>
                  {result.success ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  <AlertTitle>{`${result.operation} ${result.entity}`}</AlertTitle>
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
            <p className="text-center text-gray-500 py-4">Выполните операцию, чтобы увидеть результаты</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
