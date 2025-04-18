"use client"

import type React from "react"

import { useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"

interface Category {
  id: string
  title: string
  slug: string
}

interface Product {
  id: string
  title: string
  description: string
  image_url: string
  external_url: string
  categories: Category
}

export default function ProductModal({
  product,
  onClose,
}: {
  product: Product
  onClose: () => void
}) {
  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEsc)

    // Prevent scrolling when modal is open
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = "auto"
    }
  }, [onClose])

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Open external link in new tab
  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(product.external_url, "_blank", "noopener,noreferrer")
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">{product.title}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="relative h-64 md:h-full w-full">
            <Image
              src={product.image_url || "/placeholder.svg?height=400&width=600&query=product"}
              alt={product.title}
              fill
              className="object-contain"
            />
          </div>

          <div className="flex flex-col">
            <p className="text-gray-700 mb-4">{product.description}</p>

            <p className="text-sm text-gray-500 mb-4">Category: {product.categories?.title || "Uncategorized"}</p>

            {product.external_url && (
              <button
                onClick={handleExternalLink}
                className="mt-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Product
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
