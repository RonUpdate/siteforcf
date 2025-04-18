"use client"

import { useEffect, useRef } from "react"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

export function AdminNotifications() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const processedParams = useRef(false)

  useEffect(() => {
    // Предотвращаем повторную обработку тех же параметров
    const paramsKey = Array.from(searchParams.entries()).toString()

    // Если параметры уже были обработаны, пропускаем
    if (processedParams.current) return

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

        // Отмечаем, что параметры обработаны
        processedParams.current = true

        // Очищаем URL от параметров уведомлений после их обработки
        // Используем setTimeout, чтобы избежать проблем с обновлением во время рендеринга
        setTimeout(() => {
          const newUrl = pathname
          router.replace(newUrl, { scroll: false })
        }, 100)
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

      // Отмечаем, что параметры обработаны
      processedParams.current = true

      // Очищаем URL от параметров уведомлений после их обработки
      setTimeout(() => {
        const newUrl = pathname
        router.replace(newUrl, { scroll: false })
      }, 100)
    }
  }, [searchParams, toast, pathname, router])

  return null
}
