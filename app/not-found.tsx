import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Страница не найдена</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Извините, страница, которую вы ищете, не существует или была перемещена.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-700 transition-colors"
      >
        Вернуться на главную
      </Link>
    </div>
  )
}
