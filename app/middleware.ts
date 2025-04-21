import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Создаем ответ для модификации
  const res = NextResponse.next()

  // Создаем клиент Supabase с поддержкой cookies
  const supabase = createMiddlewareClient({ req: request, res })

  // Обновляем сессию если она истекла - необходимо для Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Добавляем отладочную информацию в заголовки
  res.headers.set("x-debug-has-session", session ? "yes" : "no")

  if (session) {
    res.headers.set("x-debug-user-email", session.user.email || "no-email")
    res.headers.set("x-debug-user-id", session.user.id || "no-id")
    res.headers.set(
      "x-debug-is-admin",
      session.user.email === "ronupert@gmail.com" || session.user.email === "admin@example.com" ? "yes" : "no",
    )
    res.headers.set("x-debug-session-expires", new Date(session.expires_at! * 1000).toISOString())
  }

  // Проверяем доступ к админке
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Пропускаем отладочные страницы
    if (
      request.nextUrl.pathname === "/debug" ||
      request.nextUrl.pathname.startsWith("/api/") ||
      request.nextUrl.pathname.startsWith("/create-admin")
    ) {
      return res
    }

    if (!session) {
      // Нет сессии - перенаправляем на страницу входа
      const redirectUrl = new URL("/login", request.url)
      res.headers.set("x-debug-redirect-reason", "no-session")
      return NextResponse.redirect(redirectUrl)
    }

    if (session.user.email !== "ronupert@gmail.com" && session.user.email !== "admin@example.com") {
      // Не админ - перенаправляем на главную
      const redirectUrl = new URL("/", request.url)
      res.headers.set("x-debug-redirect-reason", "not-admin")
      return NextResponse.redirect(redirectUrl)
    }

    // Доступ разрешен
    res.headers.set("x-debug-admin-access", "granted")
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
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
