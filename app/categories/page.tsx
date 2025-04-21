import Link from "next/link"
import Image from "next/image"
import { createServerClientSafe } from "@/lib/supabase/server-safe"
import type { Category } from "@/lib/types"

export default async function CategoriesPage() {
  const supabase = createServerClientSafe()
  const { data: categories, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    console.error("Ошибка при загрузке категорий:", error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Категории товаров</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories && categories.length > 0 ? (
          categories.map((category: Category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              <div className="aspect-video overflow-hidden">
                <Image
                  src={category.image_url || "/placeholder.svg?height=200&width=300&query=category"}
                  alt={category.name}
                  width={300}
                  height={200}
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold">{category.name}</h2>
                {category.description && <p className="mt-2 text-sm text-gray-600">{category.description}</p>}
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center">
            <p className="text-gray-500">Категории не найдены</p>
          </div>
        )}
      </div>
    </div>
  )
}
