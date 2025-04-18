import { createClient } from "@/utils/supabase/client"
import { createClient as createServerClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

// Get admin emails from environment variables or use default
const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS
  ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",")
  : ["admin@example.com"]

// Client-side admin check
export async function isAdminClient(): Promise<boolean> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.email) return false
  return ADMIN_EMAILS.includes(user.email.toLowerCase())
}

// Server-side admin check
export async function isAdminServer(): Promise<boolean> {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.email) return false
  return ADMIN_EMAILS.includes(user.email.toLowerCase())
}

// Get current user
export async function getCurrentUser() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
