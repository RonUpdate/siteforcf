"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Category {
  id: string
  title: string
  slug: string
}

interface ClientCategoryFilterProps {
  categories: Category[]
  activeCategory?: string | null
}

export default function ClientCategoryFilter({ categories, activeCategory }: ClientCategoryFilterProps) {
  const router = useRouter()

  const handleCategoryChange = (slug: string | null) => {
    if (slug) {
      router.push(`/?category=${slug}`)
    } else {
      router.push("/")
    }
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button variant={!activeCategory ? "default" : "outline"} onClick={() => handleCategoryChange(null)} size="sm">
        Все
      </Button>

      {categories.map((category) => (
        <Button
          key={category.id}
          variant={activeCategory === category.slug ? "default" : "outline"}
          onClick={() => handleCategoryChange(category.slug)}
          size="sm"
        >
          {category.title}
        </Button>
      ))}
    </div>
  )
}
