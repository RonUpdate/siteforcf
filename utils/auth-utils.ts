"use client"

import { createClient } from "@/utils/supabase/client"

const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") ?? ["ronupert@gmail.com"]

export async function isAdminClient(): Promise<boolean> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return !!user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase())
}

// Функция для получения текущего пользователя (клиентская)
export async function getCurrentUser() {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}

// Функция для проверки сессии (клиентская)
export async function getSession() {
  const supabase = createClient()
  const { data } = await supabase.auth.getSession()
  return data.session
}
