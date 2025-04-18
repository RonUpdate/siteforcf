"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

export function AdminNotifications() {
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    // Проверяем параметры URL для отображения уведомлений
    const success = searchParams.get("success")
    const action = searchParams.get("action")
    const type = searchParams.get("type")
    const title = searchParams.get("title")

    if (success && action && type) {
      const messages = {
        create: {
          product: `Продукт "${title || "Новый продукт"}" успешно создан`,
          category: `Категория "${title || "Новая категория"}" успешно создана`,
          blog: `Статья "${title || "Новая статья"}" успешно создана`,
        },
        update: {
          product: `Продукт "${title || "Продукт"}" успешно обновлен`,
          category: `Категория "${title || "Категория"}" успешно обновлена`,
          blog: `Статья "${title || "Статья"}" успешно обновлена`,
        },
        delete: {
          product: `Продукт успешно удален`,
          category: `Категория успешно удалена`,
          blog: `Статья успешно удалена`,
        },
      }

      const message = messages[action as keyof typeof messages]?.[type as keyof (typeof messages)["create"]]

      if (message) {
        toast({
          title: "Успешно!",
          description: message,
          variant: "default",
          duration: 5000,
        })
      }
    }

    const error = searchParams.get("error")
    if (error) {
      toast({
        title: "Ошибка!",
        description: decodeURIComponent(error),
        variant: "destructive",
        duration: 7000,
        action: <ToastAction altText="Попробовать снова">Попробовать снова</ToastAction>,
      })
    }
  }, [searchParams, toast])

  return null
}
