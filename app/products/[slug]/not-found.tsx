import Link from "next/link"
import { FileQuestion } from "lucide-react"

export default function ProductNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
      <FileQuestion className="h-16 w-16 text-gray-400 mb-4" />
      <h2 className="text-2xl font-bold mb-4">Товар не найден</h2>
      <p className="text-gray-600 mb-6 max-w-md">Запрашиваемый товар не существует или был удален.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/products"
          className="px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Все товары
        </Link>
        <Link href="/" className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          На главную
        </Link>
      </div>
    </div>
  )
}
