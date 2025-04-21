"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import { createCategory, updateCategory } from "../actions"
import SlugInput from "@/components/slug-input"

interface CategoryFormProps {
  category?: {
    id: string
    title: string
    slug: string
  }
  action: "create" | "edit"
}

export default function CategoryForm({ category, action }: CategoryFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(category?.title || "")
  const [slug, setSlug] = useState(category?.slug || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (action === "create") {
        await createCategory({ title, slug })
      } else if (action === "edit" && category) {
        await updateCategory({ id: category.id, title, slug })
      }

      router.push("/admin/categories")
      router.refresh()
    } catch (error: any) {
      console.error("Ошибка при сохранении категории:", error)
      setError(error.message || "Произошла ошибка при сохранении категории")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{action === "create" ? "Создание категории" : "Редактирование категории"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название категории"
              required
            />
          </div>

          <SlugInput title={title} initialSlug={category?.slug} onChange={setSlug} disabled={isSubmitting} />

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
          <Button type="submit" disabled={isSubmitting || !title || !slug}>
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
