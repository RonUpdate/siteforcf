import Link from "next/link"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CategoryTable } from "@/components/category-table"

export default async function CategoriesPage() {
  const supabase = createServerComponentClient({ cookies })

  const { data: categories } = await supabase.from("categories").select("*").order("created_at", { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Link href="/admin/categories/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </Link>
      </div>

      <CategoryTable categories={categories || []} />
    </div>
  )
}
