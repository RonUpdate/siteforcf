import { createClient } from "@/utils/supabase/client"
import { createClient as createServerClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

// Client-side admin check
export async function isAdminClient(): Promise<boolean> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.email === "admin@example.com"
}

// Server-side admin check
export async function isAdminServer(): Promise<boolean> {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.email === "admin@example.com"
}

// Get current user
export async function getCurrentUser() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
