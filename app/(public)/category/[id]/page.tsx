import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export default async function CategoryPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerComponentClient({ cookies })

  const { data: category, error } = await supabase.from("categories").select("*").eq("slug", params.id).single()

  if (error || !category) {
    notFound()
  }

  // Get coloring pages in this category
  const { data: coloringPages } = await supabase
    .from("coloring_pages")
    .select("*")
    .eq("category_id", category.id)
    .order("created_at", { ascending: false })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <Link href="/" className="flex items-center text-sm mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to categories
      </Link>

      <div className="grid gap-6 lg:grid-cols-2 mb-12">
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <Image
            src={category.image_url || "/placeholder.svg?height=600&width=600&query=coloring+category"}
            alt={category.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold">{category.name}</h1>
          <p className="mt-4 text-gray-500 dark:text-gray-400">{category.description}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Coloring Pages in {category.name}</h2>

        {coloringPages && coloringPages.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coloringPages.map((page) => (
              <Link href={`/coloring-page/${page.slug}`} key={page.id}>
                <div className="group border rounded-lg overflow-hidden transition-all hover:shadow-lg">
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={
                        page.thumbnail_url ||
                        page.image_url ||
                        "/placeholder.svg?height=256&width=256&query=coloring+page" ||
                        "/placeholder.svg"
                      }
                      alt={page.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    {page.is_featured && (
                      <div className="absolute top-2 right-2">
                        <Badge>Featured</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{page.title}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="outline">{page.difficulty_level}</Badge>
                      <span className="font-bold text-primary">{formatPrice(page.price)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">No coloring pages found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
