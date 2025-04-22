import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { ColoringPageForm } from "@/components/coloring-page-form"

export default async function EditColoringPagePage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerComponentClient({ cookies })

  const { data: coloringPage, error } = await supabase.from("coloring_pages").select("*").eq("id", params.id).single()

  if (error || !coloringPage) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Coloring Page</h1>
      <ColoringPageForm coloringPage={coloringPage} />
    </div>
  )
}
