"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/utils/supabase/client"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import BlogForm from "./blog-form"

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  created_at: string
}

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const supabase = createClient()

  const fetchPosts = useCallback(async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, content, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching blog posts:", error)
    } else {
      setPosts(data || [])
    }

    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return

    const { error } = await supabase.from("blog_posts").delete().eq("id", id)

    if (error) {
      console.error("Error deleting blog post:", error)
      alert("Failed to delete blog post")
    } else {
      setPosts(posts.filter((post) => post.id !== id))
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingPost(null)
  }

  const handleFormSubmit = () => {
    fetchPosts()
    handleFormClose()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Blog Posts</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Blog Post
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{post.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{post.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Eye className="w-5 h-5" />
                        <span className="sr-only">View</span>
                      </a>
                      <button onClick={() => handleEdit(post)} className="text-blue-600 hover:text-blue-800">
                        <Edit className="w-5 h-5" />
                        <span className="sr-only">Edit</span>
                      </button>
                      <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-5 h-5" />
                        <span className="sr-only">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {posts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No blog posts found. Add your first post!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isFormOpen && <BlogForm post={editingPost} onClose={handleFormClose} onSubmit={handleFormSubmit} />}
    </div>
  )
}
