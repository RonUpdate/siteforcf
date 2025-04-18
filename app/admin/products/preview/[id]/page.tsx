import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ProductPreview from "@/components/product-preview"
import { isAdminServer } from "@/utils/auth-utils-server"

interface AdminProductPreviewPageProps {
  params: {
    id: string
  }
}

export default async function AdminProductPreviewPage({ params }: AdminProductPreviewPageProps) {
  // Проверяем, является ли пользователь администратором
  const isAdmin = await isAdminServer()
  if (!isAdmin) {
    redirect("/login?redirect=/admin/products")
  }

  const { createServerClient } = await import("@/utils/supabase/server")
  const supabase = await createServerClient()

  // Получаем данные продукта
  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      categories:category_id (
        id,
        title,
        slug
      )
    `)
    .eq("id", params.id)
    .single()

  if (error || !product) {
    console.error("Ошибка при получении продукта:", error)
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex justify-between items-center">
        <Link href={`/admin/products/edit/${params.id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к редактированию
          </Button>
        </Link>

        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md text-sm">
          Режим предварительного просмотра (администратор)
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <ProductPreview product={product} isPreview={true} />
      </div>
    </div>
  )
}
