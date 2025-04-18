import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import MarkdownRenderer from "@/components/markdown-renderer"

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = createClient()

  // Получаем блог-пост по slug
  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("id, title, content, created_at, image_url")
    .eq("slug", params.slug)
    .single()

  if (error || !post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/blog">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад к блогу
        </Button>
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
        </header>

        {post.image_url && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img src={post.image_url || "/placeholder.svg"} alt={post.title} className="w-full h-auto" />
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          <MarkdownRenderer content={post.content} />
        </div>
      </article>
    </div>
  )
}
