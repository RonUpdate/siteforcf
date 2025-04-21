import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Перенаправляем пользователя на главную страницу или страницу, с которой он пришел
  const redirectTo = requestUrl.searchParams.get("redirect_to") || "/"
  return NextResponse.redirect(new URL(redirectTo, request.url))
}
