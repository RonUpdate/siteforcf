import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface Category {
  id: string
  title: string
  slug: string
}

interface CategoryListProps {
  categories: Category[]
}

export default function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => (
        <Link key={category.id} href={`/categories/${category.slug}`} className="block">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium">{category.title}</h3>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
