"use server"

const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") ?? ["ronupert@gmail.com"]

export async function isAdminServer(): Promise<boolean> {
  const { createServerClient } = await import("@/utils/supabase/server")
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return !!user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase())
}

// Функция для получения текущего пользователя (серверная)
export async function getCurrentUserServer() {
  const { createServerClient } = await import("@/utils/supabase/server")
  const supabase = await createServerClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}
