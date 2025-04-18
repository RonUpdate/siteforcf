"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import ImageUploader from "@/components/image-uploader"
import Link from "next/link"
import { ArrowLeft, Loader2, ImageIcon } from "lucide-react"

export default function NewBlogPostPage() {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [content, setContent] = useState("")
  const [uploadedImageUrl, setUploadedImageUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  // Generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)

    // Generate slug from title
    const newSlug = newTitle
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")

    setSlug(newSlug)
  }

  // Insert uploaded image into content
  const insertImageIntoContent = () => {
    if (!uploadedImageUrl) return

    const imageMarkdown = `![Image](${uploadedImageUrl})\n\n`
    setContent((prevContent) => prevContent + imageMarkdown)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setMessage(null)

    try {
      // Validate form
      if (!title.trim()) {
        throw new Error("Title is required")
      }
      if (!slug.trim()) {
        throw new Error("Slug is required")
      }
      if (!content.trim()) {
        throw new Error("Content is required")
      }

      // Insert new blog post
      const { data, error } = await supabase
        .from("blog_posts")
        .insert([
          {
            title,
            slug,
            content,
          },
        ])
        .select()

      if (error) throw error

      setMessage("Blog post created successfully!")

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/admin/blog")
        router.refresh()
      }, 1500)
    } catch (err: any) {
      console.error("Error creating blog post:", err)
      setError(err.message || "Error creating blog post")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/admin/blog" className="flex items-center gap-1 text-blue-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Blog Posts
      </Link>

      <h1 className="text-3xl font-bold mb-6">Add New Blog Post</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Slug *
            </label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">This will be used in the URL: /blog/{slug || "example-slug"}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
              <ImageUploader
                bucketName="blog-images"
                onImageUploaded={setUploadedImageUrl}
                existingImageUrl={uploadedImageUrl}
              />
              {uploadedImageUrl && (
                <button
                  type="button"
                  onClick={insertImageIntoContent}
                  className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <ImageIcon className="w-4 h-4" />
                  Insert image into content
                </button>
              )}
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content * (Markdown)
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Supports Markdown formatting. Use # for headings, * for lists, etc.
              </p>
            </div>
          </div>

          {error && <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

          {message && <div className="p-3 bg-green-100 text-green-700 rounded-md">{message}</div>}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Creating..." : "Create Blog Post"}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
