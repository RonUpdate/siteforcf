import Link from "next/link"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ColoringPagesTable } from "@/components/coloring-pages-table"

export default async function ColoringPagesPage() {
  const supabase = createServerComponentClient({ cookies })

  // Get coloring pages with category information
  const { data: coloringPages } = await supabase
    .from("coloring_pages")
    .select(`
      *,
      categories:category_id (
        name
      )
    `)
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Coloring Pages</h1>
        <Link href="/admin/coloring-pages/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Coloring Page
          </Button>
        </Link>
      </div>

      <ColoringPagesTable coloringPages={coloringPages || []} />
    </div>
  )
}
