"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import { createBlogPost, updateBlogPost } from "../actions"
import EnhancedImageUploader from "@/components/enhanced-image-uploader"
import SlugInput from "@/components/slug-input"

interface BlogPostFormProps {
  blogPost?: {
    id: string
    title: string
    slug: string
    content: string
    image_url: string
  }
  action: "create" | "edit"
}

export default function BlogPostForm({ blogPost, action }: BlogPostFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(blogPost?.title || "")
  const [slug, setSlug] = useState(blogPost?.slug || "")
  const [content, setContent] = useState(blogPost?.content || "")
  const [imageUrl, setImageUrl] = useState(blogPost?.image_url || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (action === "create") {
        await createBlogPost({ title, slug, content, image_url: imageUrl })
      } else if (action === "edit" && blogPost) {
        await updateBlogPost({ id: blogPost.id, title, slug, content, image_url: imageUrl })
      }

      router.push("/admin/blog-posts")
      router.refresh()
    } catch (error: any) {
      console.error("Ошибка при сохранении блог-поста:", error)
      setError(error.message || "Произошла ошибка при сохранении блог-поста")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{action === "create" ? "Создание блог-поста" : "Редактирование блог-поста"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Заголовок</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите заголовок блог-поста"
              required
            />
          </div>

          <SlugInput title={title} initialSlug={blogPost?.slug} onChange={setSlug} disabled={isSubmitting} />

          <div className="space-y-2">
            <Label htmlFor="image">Изображение</Label>
            <EnhancedImageUploader
              bucketName="blog-images"
              onImageUploaded={setImageUrl}
              existingImageUrl={imageUrl}
              folder="posts"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Содержание</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Введите содержание блог-поста"
              rows={10}
              required
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
          <Button type="submit" disabled={isSubmitting || !title || !slug || !content}>
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
