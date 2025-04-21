"use client"

import { createClient } from "@/utils/supabase/client"
import { createClient as createServerClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

// Client-side admin check
export async function isAdminClient(): Promise<boolean> {
  const supabase = createClient()

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error("Error checking admin status:", error)
      return false
    }

    if (!user) {
      return false
    }

    // Проверяем, является ли пользователь администратором
    // Используем список email-адресов из переменной окружения, если она доступна
    const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS
      ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",")
      : ["admin@example.com", "ronupert@gmail.com"]

    return adminEmails.includes(user.email || "")
  } catch (error) {
    console.error("Unexpected error in isAdminClient:", error)
    return false
  }
}

// Server-side admin check
export async function isAdminServer(): Promise<boolean> {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error("Error checking admin status:", error)
      return false
    }

    if (!user) {
      return false
    }

    // Проверяем, является ли пользователь администратором
    // Используем список email-адресов из переменной окружения, если она доступна
    const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS
      ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",")
      : ["admin@example.com", "ronupert@gmail.com"]

    return adminEmails.includes(user.email || "")
  } catch (error) {
    console.error("Unexpected error in isAdminServer:", error)
    return false
  }
}

// Get current user
export async function getCurrentUser() {
  const supabase = createClient()

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error("Error getting current user:", error)
      return null
    }

    return user
  } catch (error) {
    console.error("Unexpected error in getCurrentUser:", error)
    return null
  }
}
