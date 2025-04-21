import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="mb-4 text-6xl font-bold text-gray-800">404</h1>
      <h2 className="mb-6 text-2xl font-semibold text-gray-600">Страница не найдена</h2>
      <p className="mb-8 max-w-md text-gray-500">
        Извините, запрашиваемая вами страница не существует или была перемещена.
      </p>
      <Link
        href="/"
        className="rounded-md bg-gray-800 px-6 py-3 text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        Вернуться на главную
      </Link>
    </div>
  )
}
