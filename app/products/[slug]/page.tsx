import { getProductBySlug } from "@/utils/db-utils"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink } from "lucide-react"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/products" className="inline-block mb-6">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к продуктам
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.image_url || "/placeholder.svg?height=400&width=600&query=product"}
            alt={product.title}
            className="w-full rounded-lg object-cover"
            style={{ maxHeight: "500px" }}
            onError={(e) => {
              e.currentTarget.src = "/assorted-products-display.png"
            }}
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>

          {product.categories && (
            <Link href={`/categories/${product.categories.slug}`} className="inline-block mb-4">
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {product.categories.title}
              </span>
            </Link>
          )}

          <div className="prose max-w-none mb-6">
            <p>{product.description}</p>
          </div>

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
  )
}
