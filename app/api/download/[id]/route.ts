import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const supabase = createRouteHandlerClient({ cookies })

  // Get the coloring page
  const { data: coloringPage, error } = await supabase.from("coloring_pages").select("*").eq("id", id).single()

  if (error || !coloringPage) {
    return NextResponse.json({ error: "Coloring page not found" }, { status: 404 })
  }

  // Increment the download count
  await supabase
    .from("coloring_pages")
    .update({ download_count: (coloringPage.download_count || 0) + 1 })
    .eq("id", id)

  // In a real application, you would:
  // 1. Check if the user has purchased the coloring page
  // 2. Generate a download token
  // 3. Log the download in a downloads table
  // 4. Serve the actual file from storage

  // For this demo, we'll redirect to the image URL
  return NextResponse.redirect(coloringPage.image_url)
}
