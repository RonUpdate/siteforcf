"use client"

import { Button } from "@/components/ui/button"

interface Category {
  id: string
  title: string
  slug: string
}

interface CategoryFilterProps {
  categories: Category[]
  activeCategory?: string | null
  onCategoryChange: (slug: string | null) => void
}

export default function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
  const handleCategoryClick = (slug: string | null) => {
    onCategoryChange(slug)
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
