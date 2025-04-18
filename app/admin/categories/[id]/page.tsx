"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Category {
  id: string
  title: string
  slug: string
}

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const [category, setCategory] = useState<Category | null>(null)
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()
  const isNew = params.id === "new"

  // Fetch category on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (isNew) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const { data, error } = await supabase.from("categories").select("*").eq("id", params.id).single()

        if (error) throw error

        setCategory(data)
        setTitle(data.title)
        setSlug(data.slug)
      } catch (err: any) {
        console.error("Error fetching category:", err)
        setError("Error loading category. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [supabase, params.id, isNew])

  const generateSlug = () => {
    const newSlug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")

    setSlug(newSlug)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setMessage(null)

    try {
      // Validate form
      if (!title.trim()) {
        throw new Error("Title is required")
      }
      if (!slug.trim()) {
        throw new Error("Slug is required")
      }

      const categoryData = {
        title,
        slug,
      }

      if (isNew) {
        // Create new category
        const { error } = await supabase.from("categories").insert([categoryData])
        if (error) throw error
        setMessage("Category created successfully!")
      } else {
        // Update existing category
        const { error } = await supabase.from("categories").update(categoryData).eq("id", params.id)
        if (error) throw error
        setMessage("Category updated successfully!")
      }

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/admin/categories")
        router.refresh()
      }, 1500)
    } catch (err: any) {
      console.error("Error saving category:", err)
      setError(err.message || "Error saving category")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/admin/categories" className="flex items-center gap-1 text-blue-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Назад к списку категорий
      </Link>

      <h1 className="text-3xl font-bold mb-6">{isNew ? "Создать новую категорию" : "Редактировать категорию"}</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Название *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => !slug && generateSlug()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Slug *
            </label>
            <div className="flex gap-2">
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <Button type="button" variant="outline" onClick={generateSlug}>
                Сгенерировать
              </Button>
            </div>
          </div>

          {error && <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

          {message && <div className="p-3 bg-green-100 text-green-700 rounded-md">{message}</div>}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSaving ? "Сохранение..." : "Сохранить категорию"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
