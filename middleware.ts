import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Получаем путь запроса
  const path = req.nextUrl.pathname

  // Логирование для отладки
  console.log("Middleware запущен для пути:", path)

  // Получаем текущую сессию
  const {
    data: { session },
  } = await supabase.auth.getSession()

  console.log("Middleware: сессия существует:", !!session)

  // Проверяем доступ к защищенным маршрутам
  if (path.startsWith("/admin")) {
    // Если нет сессии, перенаправляем на страницу входа
    if (!session) {
      const redirectUrl = new URL("/login", req.url)
      redirectUrl.searchParams.set("redirect", path)
      return NextResponse.redirect(redirectUrl)
    }

    // Если есть сессия, проверяем права администратора
    try {
      console.log("Middleware: проверка прав администратора для:", session?.user?.email)

      const { data: adminUser, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", session.user.email)
        .single()

      console.log("Middleware: результат проверки:", { adminUser, error })

      // Если пользователь не администратор, перенаправляем на страницу входа
      if (error || !adminUser) {
        console.log("Middleware: пользователь не является администратором")

        // Выходим из системы
        await supabase.auth.signOut()

        // Перенаправляем на страницу входа с сообщением об ошибке
        const redirectUrl = new URL("/login", req.url)
        redirectUrl.searchParams.set("redirect", path)
        redirectUrl.searchParams.set("error", "not_admin")
        return NextResponse.redirect(redirectUrl)
      }

      console.log("Middleware: пользователь имеет права администратора")
    } catch (error) {
      console.error("Ошибка при проверке прав администратора:", error)

      // В случае ошибки перенаправляем на страницу входа
      const redirectUrl = new URL("/login", req.url)
      redirectUrl.searchParams.set("redirect", path)
      redirectUrl.searchParams.set("error", "admin_check_failed")
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Для других защищенных маршрутов (notes, profile)
  if ((path.startsWith("/notes") || path.startsWith("/profile")) && !session) {
    const redirectUrl = new URL("/login", req.url)
    redirectUrl.searchParams.set("redirect", path)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*", "/notes/:path*", "/profile/:path*"],
}
