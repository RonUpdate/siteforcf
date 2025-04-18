import { redirect } from "next/navigation"
import SecurityDashboard from "@/components/admin/security-dashboard"

export const metadata = {
  title: "Security Dashboard - Admin Panel",
  description: "View and test security policies",
}

export default async function SecurityPage() {
  const { createServerClient } = await import("@/utils/supabase/server")
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user is admin
  if (!user || user.email !== "admin@example.com") {
    redirect("/")
  }

  // Fetch policy information
  const { data: productPolicies } = await supabase.from("pg_policies").select("*").ilike("tablename", "products")

  const { data: categoryPolicies } = await supabase.from("pg_policies").select("*").ilike("tablename", "categories")

  const { data: blogPolicies } = await supabase.from("pg_policies").select("*").ilike("tablename", "blog_posts")

  // Fetch counts
  const { count: productCount } = await supabase.from("products").select("*", { count: "exact", head: true })

  const { count: categoryCount } = await supabase.from("categories").select("*", { count: "exact", head: true })

  const { count: blogCount } = await supabase.from("blog_posts").select("*", { count: "exact", head: true })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Security Dashboard</h1>

      <SecurityDashboard
        productPolicies={productPolicies || []}
        categoryPolicies={categoryPolicies || []}
        blogPolicies={blogPolicies || []}
        counts={{
          products: productCount || 0,
          categories: categoryCount || 0,
          blogPosts: blogCount || 0,
        }}
      />
    </div>
  )
}
