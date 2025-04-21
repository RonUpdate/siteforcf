import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: Request, { params }: { params: { id: string } }) {
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

    // Получаем заметку по ID
    const { data, error } = await supabase.from("notes").select("*").eq("id", params.id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Заметка не найдена" }, { status: 404 })
      }
      throw error
    }

    // Проверяем, принадлежит ли заметка пользователю
    if (data.user_id !== session.user.id) {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Ошибка при получении заметки:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

    // Проверяем, существует ли заметка и принадлежит ли она пользователю
    const { data: existingNote, error: fetchError } = await supabase
      .from("notes")
      .select("user_id")
      .eq("id", params.id)
      .single()

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return NextResponse.json({ error: "Заметка не найдена" }, { status: 404 })
      }
      throw fetchError
    }

    if (existingNote.user_id !== session.user.id) {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 })
    }

    // Обновляем заметку
    const { data, error } = await supabase
      .from("notes")
      .update({
        title,
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Ошибка при обновлении заметки:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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

    // Проверяем, существует ли заметка и принадлежит ли она пользователю
    const { data: existingNote, error: fetchError } = await supabase
      .from("notes")
      .select("user_id")
      .eq("id", params.id)
      .single()

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return NextResponse.json({ error: "Заметка не найдена" }, { status: 404 })
      }
      throw fetchError
    }

    if (existingNote.user_id !== session.user.id) {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 })
    }

    // Удаляем заметку
    const { error } = await supabase.from("notes").delete().eq("id", params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Ошибка при удалении заметки:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
