"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Skeleton } from "@/components/ui/skeleton"

type Category = {
  id: string
  name: string
  description: string
  image_url: string
  slug: string
  created_at: string
}

export function CategoryGrid({ limit = 0 }: { limit?: number }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchCategories() {
      try {
        let query = supabase.from("categories").select("*").order("created_at", { ascending: false })

        if (limit > 0) {
          query = query.limit(limit)
        }

        const { data, error } = await query

        if (error) {
          console.error("Error fetching categories:", error)
          return
        }

        setCategories(data || [])
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [supabase, limit])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(limit || 6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No categories found. Add some in the admin panel.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Link href={`/category/${category.slug}`} key={category.id}>
          <Card className="overflow-hidden transition-all hover:shadow-lg group">
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={category.image_url || "/placeholder.svg?height=192&width=384&query=coloring+pages+category"}
                alt={category.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">{category.name}</h3>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
