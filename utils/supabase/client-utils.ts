"use client"

import { createClient } from "@/utils/supabase/client"

// Функция для проверки, является ли пользователь администратором (клиентская сторона)
export async function isAdmin(): Promise<boolean> {
  const supabase = createClient()

  const { data } = await supabase.auth.getUser()
  const user = data.user

  return user?.email === "admin@example.com" || user?.email === "ronupert@gmail.com"
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
