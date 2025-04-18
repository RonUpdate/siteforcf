import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ProductPreview from "@/components/product-preview"
import { getProductBySlug } from "@/utils/db-utils"

interface ProductPreviewPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPreviewPage({ params }: ProductPreviewPageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к продуктам
          </Button>
        </Link>

        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md text-sm">Режим предварительного просмотра</div>
      </div>

      <div className="max-w-2xl mx-auto">
        <ProductPreview product={product} isPreview={true} />
      </div>
    </div>
  )
}
