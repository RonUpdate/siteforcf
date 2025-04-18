"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Grid2X2, List } from "lucide-react"
import ProductPreview from "./product-preview"

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

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Продукты не найдены.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="flex border rounded-md overflow-hidden">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="rounded-none"
          >
            <Grid2X2 className="h-4 w-4" />
            <span className="sr-only">Сетка</span>
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="rounded-none"
          >
            <List className="h-4 w-4" />
            <span className="sr-only">Список</span>
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductPreview key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-48">
                  <img
                    src={product.image_url || "/placeholder.svg?height=200&width=300&query=product"}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/assorted-products-display.png"
                    }}
                  />
                </div>
                <div className="md:w-2/3 p-4">
                  <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  {product.categories && (
                    <div className="mb-4">
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {product.categories.title}
                      </span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => {}}>
                      Подробнее
                    </Button>
                    {product.external_url && (
                      <a href={product.external_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm">
                          Перейти
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
