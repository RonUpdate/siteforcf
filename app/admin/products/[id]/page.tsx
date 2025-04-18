"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const isNew = params.id === "new"

  // Redirect to the new form page
  useEffect(() => {
    if (isNew) {
      router.push("/admin/products/create")
    } else {
      // Используем правильный формат URL для редактирования
      router.push(`/admin/products/edit/${params.id}`)
    }
  }, [isNew, params.id, router])

  // Show loading state while redirecting
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <p className="ml-2">Перенаправление на новую форму...</p>
    </div>
  )
}
