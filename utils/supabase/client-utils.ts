"use client"

import { createClient } from "@/utils/supabase/client"

// Get admin emails from environment variables or use default
const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS
  ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",")
  : ["admin@example.com"]

// Функция для проверки, является ли пользователь администратором (клиентская сторона)
export async function isAdmin(): Promise<boolean> {
  const supabase = createClient()

  const { data } = await supabase.auth.getUser()
  const user = data.user

  if (!user || !user.email) return false
  return ADMIN_EMAILS.includes(user.email.toLowerCase())
}

// Функция для получения текущего пользователя
export async function getCurrentUser() {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}

// Функция для проверки сессии
export async function getSession() {
  const supabase = createClient()
  const { data } = await supabase.auth.getSession()
  return data.session
}
