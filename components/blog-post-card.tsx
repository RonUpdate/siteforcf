import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/utils/date-utils"

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  image_url: string
  created_at: string
}

interface BlogPostCardProps {
  post: BlogPost
  showActions?: boolean
}

export default function BlogPostCard({ post, showActions = false }: BlogPostCardProps) {
  // Обрезаем содержание до 150 символов
  const truncatedContent = post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content

  return (
    <Card className="h-full flex flex-col">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={post.image_url || "/placeholder.svg?height=200&width=300&query=blog"}
          alt={post.title}
          className="object-cover w-full h-full"
          onError={(e) => {
            e.currentTarget.src = "/diverse-blog-community.png"
          }}
        />
      </div>
      <CardContent className="p-4 flex-grow">
        <div className="text-sm text-gray-500 mb-2">{formatDate(post.created_at)}</div>
        <h3 className="text-lg font-medium mb-2">{post.title}</h3>
        <p className="text-sm text-gray-600">{truncatedContent}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Link href={`/blog/${post.slug}`}>
          <Button variant="outline" size="sm">
            Читать далее
          </Button>
        </Link>
        {showActions && (
          <div className="flex space-x-2">
            <Link href={`/admin/blog-posts/edit/${post.id}`}>
              <Button variant="outline" size="sm">
                Редактировать
              </Button>
            </Link>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
