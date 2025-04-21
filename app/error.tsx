"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
      <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
      <h2 className="text-2xl font-bold mb-4">Что-то пошло не так</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        Произошла ошибка при загрузке страницы. Пожалуйста, попробуйте обновить страницу или вернитесь на главную.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Попробовать снова
        </button>
        <Link href="/" className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          Вернуться на главную
        </Link>
      </div>
    </div>
  )
}
