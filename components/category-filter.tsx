"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Category {
  id: string
  title: string
  slug: string
}

interface CategoryFilterProps {
  categories: Category[]
  activeCategory?: string
}

export default function CategoryFilter({ categories, activeCategory }: CategoryFilterProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleCategoryClick = (slug: string | null) => {
    if (slug) {
      router.push(`${pathname}?category=${slug}`)
    } else {
      router.push(pathname)
    }
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button variant={!activeCategory ? "default" : "outline"} onClick={() => handleCategoryClick(null)} size="sm">
        Все
      </Button>

      {categories.map((category) => (
        <Button
          key={category.id}
          variant={activeCategory === category.slug ? "default" : "outline"}
          onClick={() => handleCategoryClick(category.slug)}
          size="sm"
        >
          {category.title}
        </Button>
      ))}
    </div>
  )
}
