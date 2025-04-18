import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Страница не найдена</h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Извините, но страница, которую вы ищете, не существует или была перемещена.
      </p>
      <Link href="/">
        <Button>
          <Home className="mr-2 h-4 w-4" />
          Вернуться на главную
        </Button>
      </Link>
    </div>
  )
}
