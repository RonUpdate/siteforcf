import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export default async function FeaturedPage() {
  const supabase = createServerComponentClient({ cookies })

  const { data: featuredPages } = await supabase
    .from("coloring_pages")
    .select(`
      *,
      categories:category_id (
        name,
        slug
      )
    `)
    .eq("is_featured", true)
    .order("download_count", { ascending: false })

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
        Back to home
      </Link>

      <div className="flex flex-col items-center justify-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter mb-4">Featured Coloring Pages</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-[700px]">
          Our hand-picked selection of the most beautiful and popular coloring pages
        </p>
      </div>

      {featuredPages && featuredPages.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPages.map((page) => (
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
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-primary">Featured</Badge>
                  </div>
                  {page.categories && (
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="outline" className="bg-white/80 text-black">
                        {page.categories.name}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{page.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 line-clamp-2 text-sm mt-1">{page.description}</p>
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
          <p className="text-gray-500 dark:text-gray-400">No featured coloring pages found.</p>
        </div>
      )}
    </div>
  )
}
