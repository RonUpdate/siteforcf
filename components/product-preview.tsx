"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ExternalLink, Eye, X } from "lucide-react"

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
  external_url?: string
  category_id?: string
  slug: string
  categories?: Category
}

interface ProductPreviewProps {
  product: Product
  isPreview?: boolean
}

export default function ProductPreview({ product, isPreview = false }: ProductPreviewProps) {
  const [showModal, setShowModal] = useState(false)

  // Обрезаем описание до 100 символов для карточки
  const truncatedDescription =
    product.description.length > 100 ? `${product.description.substring(0, 100)}...` : product.description

  return (
    <>
      <Card className={`h-full flex flex-col ${isPreview ? "border-2 border-blue-500" : ""}`}>
        {isPreview && (
          <div className="bg-blue-500 text-white text-xs font-bold py-1 px-2 text-center">ПРЕДВАРИТЕЛЬНЫЙ ПРОСМОТР</div>
        )}
        <div className="aspect-video relative overflow-hidden">
          <img
            src={product.image_url || "/placeholder.svg?height=200&width=300&query=product"}
            alt={product.title}
            className="object-cover w-full h-full"
            onError={(e) => {
              e.currentTarget.src = "/assorted-products-display.png"
            }}
          />
        </div>
        <CardContent className="p-4 flex-grow">
          <h3 className="text-lg font-medium mb-2">{product.title}</h3>
          <p className="text-sm text-gray-600">{truncatedDescription}</p>
          {product.categories && (
            <div className="mt-2">
              <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                {product.categories.title}
              </span>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <Button variant="outline" size="sm" onClick={() => setShowModal(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Просмотр
          </Button>
          {product.external_url && (
            <a href={product.external_url} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Перейти
              </Button>
            </a>
          )}
        </CardFooter>
      </Card>

      {/* Модальное окно для детального просмотра */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-2xl font-bold">{product.title}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <div className="relative h-64 md:h-full w-full">
                <img
                  src={product.image_url || "/placeholder.svg?height=400&width=600&query=product"}
                  alt={product.title}
                  className="object-contain w-full h-full"
                  onError={(e) => {
                    e.currentTarget.src = "/assorted-products-display.png"
                  }}
                />
              </div>

              <div className="flex flex-col">
                <p className="text-gray-700 mb-4">{product.description}</p>

                {product.categories && (
                  <p className="text-sm text-gray-500 mb-4">Категория: {product.categories.title}</p>
                )}

                <div className="mt-auto flex gap-2">
                  {isPreview ? (
                    <Button variant="outline" onClick={() => setShowModal(false)}>
                      Закрыть
                    </Button>
                  ) : (
                    <Link href={`/products/${product.slug}`}>
                      <Button variant="outline">Подробнее</Button>
                    </Link>
                  )}

                  {product.external_url && (
                    <a href={product.external_url} target="_blank" rel="noopener noreferrer">
                      <Button>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Перейти на сайт
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
