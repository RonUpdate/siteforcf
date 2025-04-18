import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"

export default function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Доступ запрещен</h1>
      <p className="text-gray-600 mb-6 max-w-md">
        У вас нет прав для доступа к этой странице. Пожалуйста, войдите в систему с учетной записью администратора.
      </p>
      <div className="flex gap-4">
        <Link href="/login">
          <Button>Войти</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">На главную</Button>
        </Link>
      </div>
    </div>
  )
}
