"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Skeleton } from "@/components/ui/skeleton"

type ColoringPage = {
  id: string
  title: string
  description: string
  price: number
  image_url: string
  thumbnail_url: string
  slug: string
  difficulty_level: string
  age_group: string
  is_featured: boolean
  download_count: number
  created_at: string
}

export function FeaturedColoringPages() {
  const [coloringPages, setColoringPages] = useState<ColoringPage[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchFeaturedPages() {
      try {
        const { data, error } = await supabase
          .from("coloring_pages")
          .select("*")
          .eq("is_featured", true)
          .order("created_at", { ascending: false })
          .limit(6)

        if (error) {
          console.error("Error fetching coloring pages:", error)
          return
        }

        setColoringPages(data || [])
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedPages()
  }, [supabase])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-64 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (coloringPages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No featured coloring pages found. Add some in the admin panel.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {coloringPages.map((page) => (
        <Link href={`/coloring-page/${page.slug}`} key={page.id}>
          <Card className="overflow-hidden transition-all hover:shadow-lg group">
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src={
                  page.thumbnail_url || page.image_url || "/placeholder.svg?height=256&width=256&query=coloring+page"
                }
                alt={page.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary">{page.age_group}</Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">{page.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 line-clamp-2 text-sm mt-1">{page.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Badge variant="outline">{page.difficulty_level}</Badge>
              <span className="font-bold text-primary">{formatPrice(page.price)}</span>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
