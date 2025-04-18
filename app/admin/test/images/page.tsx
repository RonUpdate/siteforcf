"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2, ImageIcon } from "lucide-react"
import Link from "next/link"
import { v4 as uuidv4 } from "uuid"

export default function ImagesTestPage() {
  const [uploading, setUploading] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const supabase = createClient()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Проверяем тип файла
    if (!file.type.startsWith("image/")) {
      setError("Пожалуйста, выберите изображение")
      return
    }

    setUploading(true)
    setError(null)
    setSuccess(null)

    try {
      // Создаем уникальное имя файла
      const fileExt = file.name.split(".").pop()
      const fileName = `test-${uuidv4()}.${fileExt}`
      const filePath = `test/${fileName}`

      // Загружаем файл в Supabase Storage
      const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, file)

      if (uploadError) throw uploadError

      // Получаем публичный URL файла
      const { data: publicUrlData } = supabase.storage.from("product-images").getPublicUrl(filePath)

      setUploadedImageUrl(publicUrlData.publicUrl)
      setSuccess("Изображение успешно загружено")
    } catch (error: any) {
      console.error("Ошибка загрузки изображения:", error)
      setError(error.message || "Ошибка загрузки изображения")
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteImage = async () => {
    if (!uploadedImageUrl) return

    setUploading(true)
    setError(null)
    setSuccess(null)

    try {
      // Извлекаем путь файла из URL
      const filePathMatch = uploadedImageUrl.match(/\/storage\/v1\/object\/public\/product-images\/(.+)/)

      if (!filePathMatch || !filePathMatch[1]) {
        throw new Error("Не удалось извлечь путь файла из URL")
      }

      const filePath = filePathMatch[1]

      // Удаляем файл из Supabase Storage
      const { error: deleteError } = await supabase.storage.from("product-images").remove([filePath])

      if (deleteError) throw deleteError

      setUploadedImageUrl(null)
      setSuccess("Изображение успешно удалено")
    } catch (error: any) {
      console.error("Ошибка удаления изображения:", error)
      setError(error.message || "Ошибка удаления изображения")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Тестирование загрузки изображений</h1>
        <Link href="/admin/test">
          <Button variant="outline">Назад к тестам</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Загрузка изображений в Supabase Storage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!uploadedImageUrl ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                >
                  <span>Загрузить изображение</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>
                <p className="pl-1">или перетащите файл</p>
              </div>
              <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF до 10MB</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={uploadedImageUrl || "/placeholder.svg"}
                  alt="Uploaded"
                  className="max-h-64 rounded-lg mx-auto"
                />
              </div>

              <div className="flex justify-center">
                <Button variant="destructive" onClick={handleDeleteImage} disabled={uploading}>
                  {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Удалить изображение
                </Button>
              </div>

              <div className="bg-gray-100 p-4 rounded-md">
                <p className="font-medium">URL изображения:</p>
                <p className="text-sm break-all mt-1">{uploadedImageUrl}</p>
              </div>
            </div>
          )}

          {uploading && (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2">Загрузка...</span>
            </div>
          )}

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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Проверка компонента ImageUploader</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Компонент ImageUploader используется в формах для загрузки изображений. Проверьте его работу на следующих
            страницах:
          </p>

          <div className="space-y-2">
            <div className="flex items-center">
              <input type="checkbox" id="check1" className="mr-2" />
              <label htmlFor="check1">Форма создания/редактирования продукта</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="check2" className="mr-2" />
              <label htmlFor="check2">Форма создания/редактирования блог-поста</label>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Link href="/admin/products/new">
              <Button variant="outline">Форма продукта</Button>
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
