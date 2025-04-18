"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import { createProduct, updateProduct } from "../actions"
import EnhancedImageUploader from "@/components/enhanced-image-uploader"
import SlugInput from "@/components/slug-input"
import { generateSlug } from "@/utils/slug-utils"

interface Category {
  id: string
  title: string
}

interface ProductFormProps {
  product?: {
    id: string
    title: string
    description: string
    image_url: string
    external_url: string
    category_id: string
    slug: string
  }
  categories: Category[]
  action: "create" | "edit"
}

export default function ProductForm({ product, categories, action }: ProductFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(product?.title || "")
  const [slug, setSlug] = useState(product?.slug || "")
  const [description, setDescription] = useState(product?.description || "")
  const [imageUrl, setImageUrl] = useState(product?.image_url || "")
  const [externalUrl, setExternalUrl] = useState(product?.external_url || "")
  const [categoryId, setCategoryId] = useState(product?.category_id || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Генерируем слаг при первой загрузке, если его нет
  useEffect(() => {
    if (!slug && title) {
      setSlug(generateSlug(title))
    }
  }, [])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    // Слаг будет обновляться автоматически через компонент SlugInput
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Проверяем обязательные поля
    if (!title || !description || !categoryId || !slug) {
      setError("Пожалуйста, заполните все обязательные поля")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      if (action === "create") {
        const result = await createProduct({
          title,
          slug,
          description,
          image_url: imageUrl,
          external_url: externalUrl,
          category_id: categoryId,
        })

        // Перенаправляем с параметрами для уведомления
        router.push(`/admin/products?success=true&action=create&type=product&title=${encodeURIComponent(title)}`)
        router.refresh()
      } else if (action === "edit" && product) {
        const result = await updateProduct({
          id: product.id,
          title,
          slug,
          description,
          image_url: imageUrl,
          external_url: externalUrl,
          category_id: categoryId,
        })

        // Перенаправляем с параметрами для уведомления
        router.push(`/admin/products?success=true&action=update&type=product&title=${encodeURIComponent(title)}`)
        router.refresh()
      }
    } catch (error: any) {
      console.error("Ошибка при сохранении продукта:", error)
      setError(error.message || "Произошла ошибка при сохранении продукта")
    } finally {
      // Всегда сбрасываем состояние отправки
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{action === "create" ? "Создание продукта" : "Редактирование продукта"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название</Label>
            <Input
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Введите название продукта"
              required
            />
          </div>

          <SlugInput title={title} initialSlug={slug} onChange={setSlug} disabled={isSubmitting} />

          <div className="space-y-2">
            <Label htmlFor="category">Категория</Label>
            <Select value={categoryId} onValueChange={setCategoryId} disabled={isSubmitting} required>
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Изображение</Label>
            <EnhancedImageUploader
              bucketName="product-images"
              onImageUploaded={setImageUrl}
              existingImageUrl={imageUrl}
              folder="products"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Введите описание продукта"
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="externalUrl">Внешняя ссылка</Label>
            <Input
              id="externalUrl"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="Введите ссылку на внешний ресурс (необязательно)"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Отмена
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Сохранение...
              </>
            ) : (
              "Сохранить"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
