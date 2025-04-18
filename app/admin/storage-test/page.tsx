"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, AlertCircle, ArrowLeft, Loader2, Database } from "lucide-react"
import Link from "next/link"
import EnhancedImageUploader from "@/components/enhanced-image-uploader"
import { checkBucketExists, checkBucketPolicies } from "@/utils/storage-utils"

export default function StorageTestPage() {
  const [productImageUrl, setProductImageUrl] = useState("")
  const [blogImageUrl, setBlogImageUrl] = useState("")
  const [customImageUrl, setCustomImageUrl] = useState("")
  const [testImageUrl, setTestImageUrl] = useState("")
  const [imageLoadError, setImageLoadError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Состояние для проверки бакетов
  const [productBucketExists, setProductBucketExists] = useState<boolean | null>(null)
  const [blogBucketExists, setBlogBucketExists] = useState<boolean | null>(null)
  const [checkingBuckets, setCheckingBuckets] = useState(false)

  // Состояние для проверки политик
  const [productPolicies, setProductPolicies] = useState<{
    canRead: boolean
    canWrite: boolean
    canDelete: boolean
  } | null>(null)
  const [blogPolicies, setBlogPolicies] = useState<{
    canRead: boolean
    canWrite: boolean
    canDelete: boolean
  } | null>(null)
  const [checkingPolicies, setCheckingPolicies] = useState(false)

  const supabase = createClient()

  // Проверяем существование бакетов при загрузке страницы
  useEffect(() => {
    checkBuckets()
  }, [])

  const checkBuckets = async () => {
    setCheckingBuckets(true)
    try {
      const productExists = await checkBucketExists("product-images")
      const blogExists = await checkBucketExists("blog-images")

      setProductBucketExists(productExists)
      setBlogBucketExists(blogExists)
    } catch (error) {
      console.error("Ошибка при проверке бакетов:", error)
    } finally {
      setCheckingBuckets(false)
    }
  }

  const checkPolicies = async () => {
    setCheckingPolicies(true)
    try {
      const productResults = await checkBucketPolicies("product-images")
      const blogResults = await checkBucketPolicies("blog-images")

      setProductPolicies(productResults)
      setBlogPolicies(blogResults)
    } catch (error) {
      console.error("Ошибка при проверке политик:", error)
    } finally {
      setCheckingPolicies(false)
    }
  }

  const handleImageTest = () => {
    setImageLoaded(false)
    setImageLoadError(false)
    setTestImageUrl(customImageUrl)
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center mb-6">
        <Link href="/admin" className="mr-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к админ-панели
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Тестирование хранилища</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Статус бакетов
          </CardTitle>
          <CardDescription>Проверка существования бакетов и политик доступа</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {checkingBuckets ? (
              <div className="flex items-center">
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                <span>Проверка бакетов...</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Бакет product-images</h3>
                    {productBucketExists === true ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        <span>Бакет существует</span>
                      </div>
                    ) : productBucketExists === false ? (
                      <div className="flex items-center text-red-600">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span>Бакет не существует</span>
                      </div>
                    ) : (
                      <span>Статус неизвестен</span>
                    )}

                    {productPolicies && (
                      <div className="mt-2 text-sm">
                        <p className={productPolicies.canRead ? "text-green-600" : "text-red-600"}>
                          Чтение: {productPolicies.canRead ? "Разрешено" : "Запрещено"}
                        </p>
                        <p className={productPolicies.canWrite ? "text-green-600" : "text-red-600"}>
                          Запись: {productPolicies.canWrite ? "Разрешено" : "Запрещено"}
                        </p>
                        <p className={productPolicies.canDelete ? "text-green-600" : "text-red-600"}>
                          Удаление: {productPolicies.canDelete ? "Разрешено" : "Запрещено"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Бакет blog-images</h3>
                    {blogBucketExists === true ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        <span>Бакет существует</span>
                      </div>
                    ) : blogBucketExists === false ? (
                      <div className="flex items-center text-red-600">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span>Бакет не существует</span>
                      </div>
                    ) : (
                      <span>Статус неизвестен</span>
                    )}

                    {blogPolicies && (
                      <div className="mt-2 text-sm">
                        <p className={blogPolicies.canRead ? "text-green-600" : "text-red-600"}>
                          Чтение: {blogPolicies.canRead ? "Разрешено" : "Запрещено"}
                        </p>
                        <p className={blogPolicies.canWrite ? "text-green-600" : "text-red-600"}>
                          Запись: {blogPolicies.canWrite ? "Разрешено" : "Запрещено"}
                        </p>
                        <p className={blogPolicies.canDelete ? "text-green-600" : "text-red-600"}>
                          Удаление: {blogPolicies.canDelete ? "Разрешено" : "Запрещено"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button onClick={checkBuckets} variant="outline">
                    Проверить бакеты
                  </Button>
                  <Button
                    onClick={checkPolicies}
                    disabled={checkingPolicies || !productBucketExists || !blogBucketExists}
                  >
                    {checkingPolicies ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Проверка политик...
                      </>
                    ) : (
                      "Проверить политики"
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="uploader">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="uploader">Загрузка изображений</TabsTrigger>
          <TabsTrigger value="display">Отображение изображений</TabsTrigger>
          <TabsTrigger value="test">Тестирование URL</TabsTrigger>
        </TabsList>

        <TabsContent value="uploader" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Загрузка изображений продуктов</CardTitle>
              <CardDescription>Тестирование загрузки изображений в бакет product-images</CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedImageUploader
                bucketName="product-images"
                onImageUploaded={setProductImageUrl}
                existingImageUrl={productImageUrl}
                folder="test"
                showBucketStatus={true}
              />
            </CardContent>
            {productImageUrl && (
              <CardFooter className="flex flex-col items-start">
                <p className="text-sm font-medium mb-1">URL изображения:</p>
                <code className="text-xs bg-gray-100 p-2 rounded w-full overflow-auto">{productImageUrl}</code>
              </CardFooter>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Загрузка изображений блога</CardTitle>
              <CardDescription>Тестирование загрузки изображений в бакет blog-images</CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedImageUploader
                bucketName="blog-images"
                onImageUploaded={setBlogImageUrl}
                existingImageUrl={blogImageUrl}
                folder="test"
                showBucketStatus={true}
              />
            </CardContent>
            {blogImageUrl && (
              <CardFooter className="flex flex-col items-start">
                <p className="text-sm font-medium mb-1">URL изображения:</p>
                <code className="text-xs bg-gray-100 p-2 rounded w-full overflow-auto">{blogImageUrl}</code>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="display" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Отображение загруженных изображений</CardTitle>
              <CardDescription>Проверка корректного отображения загруженных изображений</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Изображение продукта</h3>
                {productImageUrl ? (
                  <div className="border rounded-md p-4 bg-gray-50">
                    <img
                      src={productImageUrl || "/placeholder.svg"}
                      alt="Product"
                      className="max-h-64 mx-auto"
                      onError={() => console.error("Ошибка загрузки изображения продукта")}
                    />
                    <p className="text-sm text-center mt-2 text-gray-500">
                      Если изображение не отображается, проверьте URL и права доступа
                    </p>
                  </div>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Сначала загрузите изображение продукта во вкладке "Загрузка изображений"
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Изображение блога</h3>
                {blogImageUrl ? (
                  <div className="border rounded-md p-4 bg-gray-50">
                    <img
                      src={blogImageUrl || "/placeholder.svg"}
                      alt="Blog"
                      className="max-h-64 mx-auto"
                      onError={() => console.error("Ошибка загрузки изображения блога")}
                    />
                    <p className="text-sm text-center mt-2 text-gray-500">
                      Если изображение не отображается, проверьте URL и права доступа
                    </p>
                  </div>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Сначала загрузите изображение блога во вкладке "Загрузка изображений"
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Тестирование URL изображений</CardTitle>
              <CardDescription>Проверка корректности отображения изображений по URL</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-url">URL изображения</Label>
                <div className="flex gap-2">
                  <Input
                    id="image-url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="Введите URL изображения для проверки"
                  />
                  <Button onClick={handleImageTest}>Проверить</Button>
                </div>
              </div>

              {testImageUrl && (
                <div className="border rounded-md p-4 bg-gray-50">
                  {!imageLoaded && !imageLoadError && (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-500">Загрузка изображения...</p>
                    </div>
                  )}

                  <img
                    src={testImageUrl || "/placeholder.svg"}
                    alt="Test"
                    className={`max-h-64 mx-auto ${imageLoaded ? "block" : "hidden"}`}
                    onLoad={() => {
                      setImageLoaded(true)
                      setImageLoadError(false)
                    }}
                    onError={() => {
                      setImageLoadError(true)
                      setImageLoaded(false)
                    }}
                  />

                  {imageLoadError && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Ошибка загрузки изображения</AlertTitle>
                      <AlertDescription>
                        Не удалось загрузить изображение по указанному URL. Проверьте URL и права доступа.
                      </AlertDescription>
                    </Alert>
                  )}

                  {imageLoaded && (
                    <Alert className="mt-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertTitle>Изображение загружено успешно</AlertTitle>
                      <AlertDescription>Изображение по указанному URL отображается корректно.</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Проверка политик доступа</CardTitle>
              <CardDescription>Проверка настроек политик доступа к хранилищу Supabase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input type="checkbox" id="check1" className="mr-2" />
                  <label htmlFor="check1">Публичный доступ на чтение для product-images</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="check2" className="mr-2" />
                  <label htmlFor="check2">Публичный доступ на чтение для blog-images</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="check3" className="mr-2" />
                  <label htmlFor="check3">Доступ на запись для авторизованных пользователей</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="check4" className="mr-2" />
                  <label htmlFor="check4">Доступ на удаление для авторизованных пользователей</label>
                </div>
              </div>

              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Проверьте настройки политик доступа в панели управления Supabase, если возникают проблемы с загрузкой
                  или отображением изображений.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
