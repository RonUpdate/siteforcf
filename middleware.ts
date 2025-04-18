import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Создаем клиент Supabase с правильной обработкой куки
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Получаем текущую сессию
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Получаем URL текущего запроса
  const requestUrl = new URL(req.url)
  const path = requestUrl.pathname

  // Проверяем, является ли путь административным
  if (path.startsWith("/admin")) {
    // Если нет сессии, перенаправляем на страницу входа
    if (!session) {
      const redirectUrl = new URL("/login", req.url)
      redirectUrl.searchParams.set("redirect", path)
      return NextResponse.redirect(redirectUrl)
    }

    // Сессия есть, но нужно проверить, имеет ли пользователь права администратора
    // Для отладки добавим заголовок с email пользователя
    const email = session.user?.email
    const newResponse = NextResponse.next()

    // Добавляем заголовок для отладки
    newResponse.headers.set("x-user-email", email || "no-email")

    // Пропускаем пользователя, так как у нас есть сессия
    // Проверку прав администратора будем делать на клиенте
    return newResponse
  }

  return res
}

// Указываем, для каких путей должен срабатывать middleware
export const config = {
  matcher: ["/admin/:path*"],
}
