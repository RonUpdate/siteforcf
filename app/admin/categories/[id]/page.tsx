import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { CategoryForm } from "@/components/category-form"

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerComponentClient({ cookies })

  const { data: category, error } = await supabase.from("categories").select("*").eq("id", params.id).single()

  if (error || !category) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Category</h1>
      <CategoryForm category={category} />
    </div>
  )
}
