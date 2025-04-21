import { NextResponse } from "next/server"
import { createServerClientSafe } from "@/lib/supabase/server-safe"

export async function GET() {
  try {
    const supabase = createServerClientSafe()

    // Проверяем аутентификацию
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      return NextResponse.json({ error: sessionError.message }, { status: 500 })
    }

    if (!session) {
      return NextResponse.json({ authenticated: false, message: "Нет активной сессии" }, { status: 200 })
    }

    // Проверяем, является ли пользователь администратором
    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", session.user.email)
      .single()

    if (adminError) {
      return NextResponse.json({ error: adminError.message }, { status: 500 })
    }

    if (!adminUser) {
      return NextResponse.json(
        { authenticated: true, isAdmin: false, message: "Пользователь не является администратором" },
        { status: 200 },
      )
    }

    return NextResponse.json(
      {
        authenticated: true,
        isAdmin: true,
        user: {
          email: session.user.email,
          name: adminUser.name,
          role: adminUser.role,
        },
      },
      { status: 200 },
    )
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
