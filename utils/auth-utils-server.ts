"use server"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

// Server-side admin check
export async function isAdminServer(): Promise<boolean> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.email) return false

  // Get admin emails from environment variables or use default
  const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS
    ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",")
    : ["admin@example.com"]

  return ADMIN_EMAILS.includes(user.email.toLowerCase())
}
