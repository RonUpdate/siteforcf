"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function NewCategoryPage() {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  // Generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)

    // Generate slug from title
    const newSlug = newTitle
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")

    setSlug(newSlug)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
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

      // Check if slug already exists
      const { data: existingCategory, error: checkError } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", slug)
        .single()

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError
      }

      if (existingCategory) {
        throw new Error("A category with this slug already exists. Please use a different slug.")
      }

      // Insert new category
      const { data, error } = await supabase
        .from("categories")
        .insert([
          {
            title,
            slug,
          },
        ])
        .select()

      if (error) throw error

      setMessage("Category created successfully!")

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/admin/categories")
        router.refresh()
      }, 1500)
    } catch (err: any) {
      console.error("Error creating category:", err)
      setError(err.message || "Error creating category")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href="/admin/categories" className="flex items-center gap-1 text-blue-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Categories
      </Link>

      <h1 className="text-3xl font-bold mb-6">Add New Category</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Slug *
            </label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be used in URLs for filtering products: /?category={slug || "example-category"}
            </p>
          </div>

          {error && <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

          {message && <div className="p-3 bg-green-100 text-green-700 rounded-md">{message}</div>}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Creating..." : "Create Category"}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
