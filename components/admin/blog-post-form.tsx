"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabaseClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"
import { ImageUpload } from "./image-upload"
import type { BlogPost, BlogCategory } from "@/lib/types"

interface BlogPostFormProps {
  post?: BlogPost
  categories: BlogCategory[]
}

export default function BlogPostForm({ post, categories }: BlogPostFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>(post?.featured_image || "")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(post?.categories?.map((cat) => cat.id) || [])
  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    author: post?.author || "",
    published: post?.published || false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement
      setFormData({
        ...formData,
        [name]: target.checked,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target

    if (checked) {
      setSelectedCategories([...selectedCategories, value])
    } else {
      setSelectedCategories(selectedCategories.filter((id) => id !== value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = {
        ...formData,
        featured_image: imageUrl,
        published_at: formData.published ? new Date().toISOString() : null,
      }

      let postId = post?.id

      if (post) {
        // Update existing post
        const { error } = await supabaseClient().from("blog_posts").update(data).eq("id", post.id)
        if (error) throw error
      } else {
        // Create new post
        const { data: newPost, error } = await supabaseClient().from("blog_posts").insert(data).select("id").single()
        if (error) throw error
        postId = newPost.id
      }

      // Handle categories
      if (postId) {
        // First, delete all existing category relationships
        await supabaseClient().from("blog_posts_categories").delete().eq("blog_post_id", postId)

        // Then insert new relationships
        if (selectedCategories.length > 0) {
          const categoryRelations = selectedCategories.map((categoryId) => ({
            blog_post_id: postId,
            blog_category_id: categoryId,
          }))

          const { error } = await supabaseClient().from("blog_posts_categories").insert(categoryRelations)
          if (error) throw error
        }
      }

      router.push("/admin/blog")
      router.refresh()
    } catch (error) {
      console.error("Error saving blog post:", error)
      alert("Ошибка при сохранении статьи")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Заголовок статьи
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              URL-адрес (slug)
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">Используется в URL: /blog/slug</p>
          </div>

          <div className="mb-4">
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
              Краткое описание
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt || ""}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Содержание статьи
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content || ""}
              onChange={handleChange}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">Поддерживается Markdown разметка</p>
          </div>

          <div className="mb-4">
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Автор
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                Опубликовать статью
              </label>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Изображение для статьи</label>
            <ImageUpload
              bucket="blog-images"
              folder={post?.id || "new"}
              onUpload={setImageUrl}
              existingUrl={imageUrl}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Категории</label>
            <div className="space-y-2 border border-gray-300 rounded-md p-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    value={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onChange={handleCategoryChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`category-${category.id}`} className="ml-2 block text-sm text-gray-700">
                    {category.name}
                  </label>
                </div>
              ))}
              {categories.length === 0 && <p className="text-sm text-gray-500">Нет доступных категорий</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 mr-2"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center"
        >
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {post ? "Сохранить изменения" : "Создать статью"}
        </button>
      </div>
    </form>
  )
}
