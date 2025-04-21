import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Получаем текущую сессию
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!session) {
      return NextResponse.json({ authenticated: false, message: "Нет активной сессии" })
    }

    // Если есть сессия, проверяем права администратора
    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", session.user.email)
      .single()

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
      },
      isAdmin: !adminError && !!adminUser,
      adminError: adminError ? adminError.message : null,
      adminUser: adminUser || null,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
