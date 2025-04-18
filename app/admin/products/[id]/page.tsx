"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import ImageUploader from "@/components/image-uploader"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Category {
  id: string
  title: string
}

interface Product {
  id: string
  title: string
  description: string
  image_url: string
  external_url: string
  category_id: string
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [externalUrl, setExternalUrl] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()
  const isNew = params.id === "new"

  // Fetch product and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("id, title")
          .order("title")

        if (categoriesError) throw categoriesError
        setCategories(categoriesData || [])

        // If not a new product, fetch existing product data
        if (!isNew) {
          const { data: productData, error: productError } = await supabase
            .from("products")
            .select("*")
            .eq("id", params.id)
            .single()

          if (productError) throw productError

          // Set state
          setProduct(productData)
          setTitle(productData.title)
          setDescription(productData.description)
          setImageUrl(productData.image_url || "")
          setExternalUrl(productData.external_url || "")
          setCategoryId(productData.category_id)
        } else if (categoriesData && categoriesData.length > 0) {
          // For new product, set default category if available
          setCategoryId(categoriesData[0].id)
        }
      } catch (err: any) {
        console.error("Error fetching data:", err)
        setError("Error loading data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [supabase, params.id, isNew])

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
      if (!description.trim()) {
        throw new Error("Description is required")
      }
      if (!categoryId) {
        throw new Error("Category is required")
      }

      const productData = {
        title,
        description,
        image_url: imageUrl,
        external_url: externalUrl,
        category_id: categoryId,
      }

      if (isNew) {
        // Create new product
        const { error } = await supabase.from("products").insert([productData])
        if (error) throw error
        setMessage("Product created successfully!")
      } else {
        // Update existing product
        const { error } = await supabase.from("products").update(productData).eq("id", params.id)
        if (error) throw error
        setMessage("Product updated successfully!")
      }

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/admin/products")
        router.refresh()
      }, 1500)
    } catch (err: any) {
      console.error("Error saving product:", err)
      setError(err.message || "Error saving product")
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
      <Link href="/admin/products" className="flex items-center gap-1 text-blue-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Назад к списку продуктов
      </Link>

      <h1 className="text-3xl font-bold mb-6">{isNew ? "Создать новый продукт" : "Редактировать продукт"}</h1>

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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Описание *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Категория *
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Выберите категорию</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="externalUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Внешняя ссылка
            </label>
            <input
              id="externalUrl"
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Изображение продукта</label>
            <ImageUploader
              bucketName="product-images"
              onImageUploaded={setImageUrl}
              existingImageUrl={imageUrl}
              folder="products"
            />
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
              {isSaving ? "Сохранение..." : "Сохранить продукт"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
