"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react"
import Image from "next/image"

interface Product {
  id: string
  title: string
  image_url: string
  categories: {
    title: string
  }
}

export default function DeleteProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  // Fetch product on component mount
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const { data, error } = await supabase
          .from("products")
          .select(`
            id, 
            title, 
            image_url,
            categories(title)
          `)
          .eq("id", params.id)
          .single()

        if (error) throw error

        setProduct(data)
      } catch (err: any) {
        console.error("Error fetching product:", err)
        setError("Error loading product. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [supabase, params.id])

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      // Delete the product
      const { error } = await supabase.from("products").delete().eq("id", params.id)

      if (error) throw error

      // If product has an image in our storage, delete it
      if (product?.image_url && product.image_url.includes("product-images")) {
        // Extract the path from the URL
        const path = product.image_url.split("/").slice(-2).join("/")

        if (path) {
          await supabase.storage.from("product-images").remove([path])
        }
      }

      // Redirect to products page
      router.push("/admin/products")
      router.refresh()
    } catch (err: any) {
      console.error("Error deleting product:", err)
      setError(err.message || "Error deleting product")
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span>Loading product...</span>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          Product not found.{" "}
          <Link href="/admin/products" className="underline">
            Return to products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href="/admin/products" className="flex items-center gap-1 text-blue-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center mb-6 text-red-600">
          <AlertTriangle className="w-16 h-16" />
        </div>

        <h1 className="text-2xl font-bold mb-4 text-center">Delete Product</h1>

        <p className="text-center mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>

        <div className="flex items-center gap-4 p-4 border rounded-lg mb-6">
          {product.image_url && (
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src={product.image_url || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover rounded"
              />
            </div>
          )}

          <div className="flex-1">
            <h3 className="font-medium">{product.title}</h3>
            <p className="text-sm text-gray-500">Category: {product.categories?.title || "Uncategorized"}</p>
          </div>
        </div>

        {error && <div className="p-3 bg-red-100 text-red-700 rounded-md mb-6">{error}</div>}

        <div className="flex justify-between">
          <Link
            href="/admin/products"
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
            {isDeleting ? "Deleting..." : "Delete Product"}
          </button>
        </div>
      </div>
    </div>
  )
}
