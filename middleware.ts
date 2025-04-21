import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Продолжаем обработку запроса как обычно
  return NextResponse.next()
}

// Указываем, для каких путей должен срабатывать middleware
export const config = {
  matcher: [
    /*
     * Совпадает со всеми путями, кроме:
     * 1. Путей, начинающихся с api/ (API routes)
     * 2. Путей, начинающихся с _next/static (статические файлы)
     * 3. Путей, начинающихся с _next/image (оптимизированные изображения)
     * 4. Путей, начинающихся с favicon.ico (иконка сайта)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
