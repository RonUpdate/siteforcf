import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Получаем все заголовки запроса
  const headers: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    if (key.startsWith("x-debug")) {
      headers[key] = value
    }
  })

  // Возвращаем заголовки в ответе
  return NextResponse.json(headers)
}
