import { redirect } from "next/navigation"
import { isAdminServer } from "@/utils/auth-utils-server"
import AdminDashboard from "@/components/admin/dashboard"

export default async function AdminPage() {
  // Проверяем, является ли пользователь администратором
  const isAdmin = await isAdminServer()

  // Если не админ, перенаправляем на главную
  if (!isAdmin) {
    redirect("/")
  }

  return <AdminDashboard />
}
