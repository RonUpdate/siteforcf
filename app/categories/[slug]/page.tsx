import { getCategoryBySlug, getProductsByCategory } from "@/utils/db-utils"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ProductCard from "@/components/product-card"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug)

  if (!category) {
    notFound()
  }

  const products = await getProductsByCategory(params.slug)

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/categories" className="inline-block mb-6">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к категориям
        </Button>
      </Link>

      <h1 className="text-3xl font-bold mb-6">{category.title}</h1>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">В этой категории пока нет продуктов</p>
        </div>
      )}
    </div>
  )
}
