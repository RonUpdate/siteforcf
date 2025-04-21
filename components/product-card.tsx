import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from 'lucide-react'

interface Product {
  id: string
  title: string
  slug: string
  description: string
  image_url: string
  external_url?: string
}

interface ProductCardProps {
  product: Product
  showActions?: boolean
}

export default function ProductCard({ product, showActions = false }: ProductCardProps) {
  // Обрезаем описание до 100 символов
  const truncatedDescription =
    product.description.length > 100 ? `${product.description.substring(0, 100)}...` : product.description

  return (
    <Card className="h-full flex flex-col">
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
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Link href={`/products/${product.slug}`}>
          <Button variant="outline" size="sm">
            Подробнее
          </Button>
        </Link>
        {product.external_url && (
          <a href={product.external_url} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Перейти
            </Button>
          </a>
        )}
        {showActions && (
          <div className="flex space-x-2">
            <Link href={`/admin/products/${product.id}`}>
              <Button variant="outline" size="sm">
                Редактировать
              </Button>
            </Link>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
