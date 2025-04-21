import type React from "react"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { AdminSidebar } from "@/components/admin/sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  console.log("AdminLayout: начало проверки аутентификации")
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  try {
    // Проверяем аутентификацию
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    console.log("AdminLayout: результат проверки сессии:", {
      sessionExists: !!session,
      sessionError: sessionError?.message,
    })

    if (sessionError) {
      console.error("Ошибка при получении сессии:", sessionError)
      redirect("/login?error=session&redirect=/admin")
    }

    if (!session) {
      redirect("/login?redirect=/admin")
    }

    // Проверяем, является ли пользователь администратором
    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", session.user.email)
      .single()

    console.log("AdminLayout: результат проверки прав администратора:", {
      adminUser,
      adminError: adminError?.message,
    })

    if (adminError) {
      console.error("Ошибка при проверке прав администратора:", adminError)

      // Если ошибка связана с отсутствием записи, перенаправляем с соответствующим сообщением
      if (adminError.code === "PGRST116") {
        redirect("/login?error=not_admin&redirect=/admin")
      }

      redirect("/login?error=admin_check&redirect=/admin")
    }

    if (!adminUser) {
      redirect("/login?error=not_admin&redirect=/admin")
    }

    return (
      <div className="flex h-screen bg-gray-100">
        <div className="w-64 flex-shrink-0">
          <AdminSidebar />
        </div>
        <div className="flex-1 overflow-auto p-8">{children}</div>
      </div>
    )
  } catch (error) {
    console.error("Непредвиденная ошибка в макете админ-панели:", error)
    redirect("/login?error=unknown&redirect=/admin")
  }
}
