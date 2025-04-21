"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { ensureUniqueSlug } from "@/utils/slug-utils"

interface BlogPostData {
  title: string
  slug: string
  content: string
  image_url: string
}

interface BlogPostUpdateData extends BlogPostData {
  id: string
}

export async function createBlogPost(data: BlogPostData) {
  const supabase = createClient()

  try {
    // Проверяем и обеспечиваем уникальность слага
    const uniqueSlug = await ensureUniqueSlug(data.slug, "blog_posts")

    // Создаем блог-пост с уникальным слагом
    const { error } = await supabase.from("blog_posts").insert({
      title: data.title,
      slug: uniqueSlug,
      content: data.content,
      image_url: data.image_url,
    })

    if (error) throw error

    revalidatePath("/admin/blog-posts")
    return { success: true }
  } catch (error: any) {
    console.error("Ошибка при создании блог-поста:", error)
    throw new Error(error.message || "Не удалось создать блог-пост")
  }
}

export async function updateBlogPost(data: BlogPostUpdateData) {
  const supabase = createClient()

  try {
    // Проверяем и обеспечиваем уникальность слага, исключая текущую запись
    const uniqueSlug = await ensureUniqueSlug(data.slug, "blog_posts", data.id)

    // Обновляем блог-пост с уникальным слагом
    const { error } = await supabase
      .from("blog_posts")
      .update({
        title: data.title,
        slug: uniqueSlug,
        content: data.content,
        image_url: data.image_url,
      })
      .eq("id", data.id)

    if (error) throw error

    revalidatePath("/admin/blog-posts")
    return { success: true }
  } catch (error: any) {
    console.error("Ошибка при обновлении блог-поста:", error)
    throw new Error(error.message || "Не удалось обновить блог-пост")
  }
}

export async function deleteBlogPost(id: string) {
  const supabase = createClient()

  try {
    // Удаляем блог-пост
    const { error } = await supabase.from("blog_posts").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/admin/blog-posts")
    return { success: true }
  } catch (error: any) {
    console.error("Ошибка при удалении блог-поста:", error)
    throw new Error(error.message || "Не удалось удалить блог-пост")
  }
}
