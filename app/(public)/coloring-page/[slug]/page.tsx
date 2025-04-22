import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Star } from "lucide-react"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export default async function ColoringPagePage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = createServerComponentClient({ cookies })

  const { data: coloringPage, error } = await supabase
    .from("coloring_pages")
    .select(`
      *,
      categories:category_id (
        name,
        slug
      )
    `)
    .eq("slug", params.slug)
    .single()

  if (error || !coloringPage) {
    notFound()
  }

  // Get related coloring pages from the same category
  const { data: relatedPages } = await supabase
    .from("coloring_pages")
    .select("id, title, thumbnail_url, slug")
    .eq("category_id", coloringPage.category_id)
    .neq("id", coloringPage.id)
    .limit(4)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      {coloringPage.categories && (
        <Link href={`/category/${coloringPage.categories.slug}`} className="flex items-center text-sm mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {coloringPage.categories.name}
        </Link>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg border">
          <Image
            src={coloringPage.image_url || "/placeholder.svg?height=600&width=600&query=coloring+page"}
            alt={coloringPage.title}
            fill
            className="object-contain"
            priority
          />
          {coloringPage.is_featured && (
            <div className="absolute top-4 right-4">
              <Badge className="flex items-center gap-1 bg-primary">
                <Star className="h-3 w-3" />
                Featured
              </Badge>
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">{coloringPage.title}</h1>

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline">{coloringPage.difficulty_level}</Badge>
            <Badge variant="outline">{coloringPage.age_group}</Badge>
            {coloringPage.categories && <Badge variant="outline">{coloringPage.categories.name}</Badge>}
          </div>

          <div className="mt-4">
            <span className="text-3xl font-bold text-primary">{formatPrice(coloringPage.price)}</span>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-300">{coloringPage.description}</p>
          </div>

          <div className="mt-8">
            <Link href={`/api/download/${coloringPage.id}`}>
              <Button className="w-full md:w-auto gap-2" size="lg">
                <Download className="h-5 w-5" />
                Download Now
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-2">
              <Download className="h-3 w-3 inline mr-1" />
              {coloringPage.download_count || 0} downloads
            </p>
          </div>
        </div>
      </div>

      {relatedPages && relatedPages.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You might also like</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {relatedPages.map((page) => (
              <Link href={`/coloring-page/${page.slug}`} key={page.id}>
                <div className="group">
                  <div className="relative aspect-square overflow-hidden rounded-lg border">
                    <Image
                      src={page.thumbnail_url || "/placeholder.svg?height=200&width=200&query=coloring+page"}
                      alt={page.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-2 text-sm font-medium truncate">{page.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
