import type React from "react"
import { redirect } from "next/navigation"
import { createServerClientSafe } from "@/lib/supabase/server-safe"
import { AdminSidebar } from "@/components/admin/sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClientSafe()

  // Проверяем аутентификацию
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/admin/login")
  }

  // Проверяем, является ли пользователь администратором
  const { data: adminUser } = await supabase.from("admin_users").select("*").eq("email", session.user.email).single()

  if (!adminUser) {
    redirect("/")
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 flex-shrink-0">
        <AdminSidebar />
      </div>
      <div className="flex-1 overflow-auto p-8">{children}</div>
    </div>
  )
}
