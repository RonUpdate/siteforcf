"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import ImageUploader from "@/components/image-uploader"
import MarkdownPreview from "@/components/markdown-preview"

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  image_url?: string
}

interface BlogPostFormProps {
  blogPost: BlogPost | null
}

export function BlogPostForm({ blogPost }: BlogPostFormProps) {
  const isNew = !blogPost
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    title: blogPost?.title || "",
    slug: blogPost?.slug || "",
    content: blogPost?.content || "",
    image_url: blogPost?.image_url || "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }))
  }

  const handleImageUploaded = (url: string) => {
    setFormData((prev) => ({ ...prev, image_url: url }))
  }

  // Автоматически генерируем slug из заголовка
  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")

    setFormData((prev) => ({ ...prev, slug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isNew) {
        // Создаем новый пост
        const { error } = await supabase.from("blog_posts").insert([formData])

        if (error) throw error
      } else {
        // Обновляем существующий пост
        const { error } = await supabase.from("blog_posts").update(formData).eq("id", blogPost.id)

        if (error) throw error
      }

      router.push("/admin/blog-posts")
      router.refresh()
    } catch (error: any) {
      console.error("Ошибка при сохранении блог-поста:", error)
      setError(error.message || "Произошла ошибка при сохранении")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/admin/blog-posts">
            <Button variant="outline" type="button">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Сохранить
              </>
            )}
          </Button>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>}

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Заголовок</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={() => !formData.slug && generateSlug()}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <div className="flex space-x-2">
                <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required />
                <Button type="button" variant="outline" onClick={generateSlug}>
                  Сгенерировать
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Изображение для статьи</Label>
              <ImageUploader
                bucketName="blog-images"
                onImageUploaded={handleImageUploaded}
                existingImageUrl={formData.image_url}
                folder="posts"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Содержание (Markdown)</Label>
              <MarkdownPreview content={formData.content} onChange={handleContentChange} />
              <p className="text-xs text-gray-500">
                Поддерживается Markdown форматирование. Вы можете использовать # для заголовков, * для списков,
                **текст** для жирного текста и т.д.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
