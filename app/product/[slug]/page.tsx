import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export default async function ProductPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = createServerComponentClient({ cookies })

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      categories:category_id (
        name,
        slug
      )
    `)
    .eq("slug", params.slug)
    .single()

  if (error || !product) {
    notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b dark:bg-gray-950 dark:border-gray-800">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="text-xl font-bold">
            Product Categories
          </Link>
          <Link href="/admin">
            <Button variant="outline">Admin Panel</Button>
          </Link>
        </div>
      </header>
      <main className="container px-4 py-12 md:px-6 md:py-16">
        {product.categories && (
          <Link href={`/category/${product.categories.slug}`} className="flex items-center text-sm mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {product.categories.name}
          </Link>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={product.image_url || "/placeholder.svg?height=600&width=600&query=product"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.is_featured && <Badge className="absolute top-4 right-4">Featured</Badge>}
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-4">
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            </div>

            <div className="mt-4">
              {product.stock_quantity > 0 ? (
                <Badge variant="outline" className="bg-green-50">
                  {product.stock_quantity} in stock
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50">
                  Out of Stock
                </Badge>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
            </div>

            <div className="mt-8">
              <Button className="w-full md:w-auto" disabled={product.stock_quantity <= 0}>
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
