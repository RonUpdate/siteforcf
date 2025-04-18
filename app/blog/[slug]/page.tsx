import { getBlogPostBySlug } from "@/utils/db-utils"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { formatDate } from "@/utils/date-utils"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Link href="/blog" className="inline-block mb-6">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к блогу
        </Button>
      </Link>

      <article>
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-500 mb-6">{formatDate(post.created_at)}</div>

        {post.image_url && (
          <div className="mb-6">
            <img
              src={post.image_url || "/placeholder.svg"}
              alt={post.title}
              className="w-full rounded-lg object-cover"
              style={{ maxHeight: "500px" }}
              onError={(e) => {
                e.currentTarget.src = "/diverse-blog-community.png"
              }}
            />
          </div>
        )}

        <div className="prose max-w-none">
          {post.content.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  )
}
