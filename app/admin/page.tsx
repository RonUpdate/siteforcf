import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Layers, FileImage, Download } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = createServerComponentClient({ cookies })

  // Get category count
  const { count: categoryCount } = await supabase.from("categories").select("*", { count: "exact", head: true })

  // Get coloring pages count
  const { count: coloringPagesCount } = await supabase
    .from("coloring_pages")
    .select("*", { count: "exact", head: true })

  // Get total downloads
  const { data: downloadData } = await supabase.from("coloring_pages").select("download_count")
  const totalDownloads = downloadData?.reduce((sum, item) => sum + (item.download_count || 0), 0) || 0

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Layers className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Coloring Pages</CardTitle>
            <FileImage className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coloringPagesCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDownloads}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
