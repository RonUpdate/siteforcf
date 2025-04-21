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
      return NextResponse.json({
        authenticated: false,
        message: "Нет активной сессии",
        timestamp: new Date().toISOString(),
        cookies: cookieStore.getAll().map((c) => ({ name: c.name })),
      })
    }

    // Если есть сессия, проверяем права администратора
    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", session.user.email)
      .single()

    // Проверяем наличие таблицы admin_users
    const { data: tableInfo, error: tableError } = await supabase
      .from("admin_users")
      .select("count(*)", { count: "exact", head: true })

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        lastSignInAt: session.user.last_sign_in_at,
      },
      session: {
        expiresAt: session.expires_at,
      },
      isAdmin: !adminError && !!adminUser,
      adminError: adminError ? adminError.message : null,
      adminUser: adminUser || null,
      tableInfo: {
        exists: !tableError,
        error: tableError ? tableError.message : null,
        count: tableInfo?.count || 0,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
