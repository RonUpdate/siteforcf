import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Get admin emails from environment variables or use default
const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS
  ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",")
  : ["ronupert@gmail.com"]

export async function middleware(request: NextRequest) {
  // Создаем ответ для модификации
  const res = NextResponse.next()

  // Создаем клиент Supabase с поддержкой cookies
  const supabase = createMiddlewareClient({ req: request, res })

  // Обновляем сессию если она истекла - необходимо для Server Components
  await supabase.auth.getSession()

  // Проверяем доступ к админке
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Пропускаем отладочные страницы и страницу настройки админа
    if (
      request.nextUrl.pathname === "/admin-setup" ||
      request.nextUrl.pathname.startsWith("/api/") ||
      request.nextUrl.pathname.startsWith("/create-admin")
    ) {
      return res
    }

    // Получаем сессию
    const { data } = await supabase.auth.getSession()
    const session = data.session

    if (!session) {
      // Нет сессии - перенаправляем на страницу входа
      const redirectUrl = new URL("/login", request.url)
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    const isAdmin = session.user.email && ADMIN_EMAILS.includes(session.user.email.toLowerCase())

    if (!isAdmin) {
      // Не админ - перенаправляем на главную
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
}
