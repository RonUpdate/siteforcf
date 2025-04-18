"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react"

interface Category {
  id: string
  title: string
  slug: string
  productCount: number
}

export default function DeleteCategoryPage({ params }: { params: { id: string } }) {
  const [category, setCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  // Fetch category and product count on component mount
  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch category
        const { data, error } = await supabase.from("categories").select("id, title, slug").eq("id", params.id).single()

        if (error) throw error

        // Count products in this category
        const { count, error: countError } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("category_id", data.id)

        if (countError) throw countError

        setCategory({
          ...data,
          productCount: count || 0,
        })
      } catch (err: any) {
        console.error("Error fetching category:", err)
        setError("Error loading category. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategory()
  }, [supabase, params.id])

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      // Update products to remove category reference
      if (category?.productCount && category.productCount > 0) {
        const { error: updateError } = await supabase
          .from("products")
          .update({ category_id: null })
          .eq("category_id", params.id)

        if (updateError) throw updateError
      }

      // Delete the category
      const { error } = await supabase.from("categories").delete().eq("id", params.id)

      if (error) throw error

      // Redirect to categories page
      router.push("/admin/categories")
      router.refresh()
    } catch (err: any) {
      console.error("Error deleting category:", err)
      setError(err.message || "Error deleting category")
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span>Loading category...</span>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          Category not found.{" "}
          <Link href="/admin/categories" className="underline">
            Return to categories
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href="/admin/categories" className="flex items-center gap-1 text-blue-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Categories
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center mb-6 text-red-600">
          <AlertTriangle className="w-16 h-16" />
        </div>

        <h1 className="text-2xl font-bold mb-4 text-center">Delete Category</h1>

        <p className="text-center mb-6">
          Are you sure you want to delete the category <strong>{category.title}</strong>? This action cannot be undone.
        </p>

        {category.productCount > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-6">
            <p className="text-yellow-800">
              <strong>Warning:</strong> This category contains {category.productCount}{" "}
              {category.productCount === 1 ? "product" : "products"}. If you delete this category, these products will
              become uncategorized.
            </p>
          </div>
        )}

        {error && <div className="p-3 bg-red-100 text-red-700 rounded-md mb-6">{error}</div>}

        <div className="flex justify-between">
          <Link
            href="/admin/categories"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isDeleting ? "Deleting..." : "Delete Category"}
          </button>
        </div>
      </div>
    </div>
  )
}
