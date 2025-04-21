import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import BlogPostForm from "./blog-post-form"
import SlugInfo from "@/components/slug-info"

interface BlogPostPageProps {
  params: {
    action: string
    id?: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { action, id } = params

  // Проверяем, что действие допустимо
  if (action !== "create" && action !== "edit") {
    notFound()
  }

  // Если действие - редактирование, получаем данные блог-поста
  let blogPost = null
  if (action === "edit" && id) {
    const supabase = createClient()
    const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).single()

    if (error || !data) {
      notFound()
    }

    blogPost = data
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{action === "create" ? "Создание статьи" : "Редактирование статьи"}</h1>

      <SlugInfo className="mb-6" />

      <BlogPostForm blogPost={blogPost} action={action as "create" | "edit"} />
    </div>
  )
}
