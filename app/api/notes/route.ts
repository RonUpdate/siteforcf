import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Проверяем аутентификацию
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Требуется аутентификация" }, { status: 401 })
    }

    // Получаем заметки пользователя
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", session.user.id)
      .order("updated_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Ошибка при получении заметок:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Проверяем аутентификацию
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Требуется аутентификация" }, { status: 401 })
    }

    // Получаем данные из запроса
    const { title, content } = await request.json()

    if (!title) {
      return NextResponse.json({ error: "Заголовок обязателен" }, { status: 400 })
    }

    // Создаем новую заметку
    const { data, error } = await supabase
      .from("notes")
      .insert([
        {
          user_id: session.user.id,
          title,
          content,
        },
      ])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Ошибка при создании заметки:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
