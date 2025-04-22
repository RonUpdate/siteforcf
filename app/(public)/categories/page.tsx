import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CategoryGrid } from "@/components/category-grid"

export default function CategoriesPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <Link href="/" className="flex items-center text-sm mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to home
      </Link>

      <div className="flex flex-col items-center justify-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter mb-4">Browse Categories</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-[700px]">
          Explore our collection of coloring pages by category
        </p>
      </div>

      <CategoryGrid />
    </div>
  )
}
