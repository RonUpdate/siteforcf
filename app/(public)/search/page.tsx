import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { SearchForm } from "@/components/search-form"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string }
}) {
  const query = searchParams.q || ""
  const supabase = createServerComponentClient({ cookies })

  const { data: searchResults } = await supabase
    .from("coloring_pages")
    .select(`
      *,
      categories:category_id (
        name,
        slug
      )
    `)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order("is_featured", { ascending: false })

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
        <h1 className="text-3xl font-bold tracking-tighter mb-4">Search Results</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-[700px] mb-6">
          {query ? `Showing results for "${query}"` : "Search for coloring pages"}
        </p>
        <SearchForm className="max-w-md" />
      </div>

      {searchResults && searchResults.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {searchResults.map((page) => (
            <Link href={`/coloring-page/${page.slug}`} key={page.id}>
              <div className="group border rounded-lg overflow-hidden transition-all hover:shadow-lg">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={
                      page.thumbnail_url ||
                      page.image_url ||
                      "/placeholder.svg?height=256&width=256&query=coloring+page" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg"
                    }
                    alt={page.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {page.is_featured && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-primary">Featured</Badge>
                    </div>
                  )}
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
          <p className="text-gray-500 dark:text-gray-400">
            {query ? `No coloring pages found for "${query}".` : "Enter a search term to find coloring pages."}
          </p>
        </div>
      )}
    </div>
  )
}
