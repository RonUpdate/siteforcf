import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

interface Product {
  id: string
  title: string
  description: string
  image_url?: string
  external_url?: string
  categories?: {
    id: string
    title: string
    slug: string
  }
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 h-full w-full flex items-center justify-center">
            <span className="text-gray-500 text-2xl font-bold">{product.title.charAt(0).toUpperCase()}</span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
          {product.external_url && (
            <a
              href={product.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
              title="Внешняя ссылка"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
        {product.categories && (
          <div className="mb-2">
            <Link
              href={`/products?category=${product.categories.slug}`}
              className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
            >
              {product.categories.title}
            </Link>
          </div>
        )}
        <p className="text-gray-600 text-sm line-clamp-3">{product.description}</p>
      </CardContent>
    </Card>
  )
}
