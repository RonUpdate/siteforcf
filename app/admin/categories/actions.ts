"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { ensureUniqueSlug } from "@/utils/slug-utils"

interface CategoryData {
  title: string
  slug: string
}

interface CategoryUpdateData extends CategoryData {
  id: string
}

export async function createCategory(data: CategoryData) {
  const supabase = createClient()

  try {
    // Проверяем и обеспечиваем уникальность слага
    const uniqueSlug = await ensureUniqueSlug(data.slug, "categories")

    // Создаем категорию с уникальным слагом
    const { error } = await supabase.from("categories").insert({
      title: data.title,
      slug: uniqueSlug,
    })

    if (error) throw error

    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error: any) {
    console.error("Ошибка при создании категории:", error)
    throw new Error(error.message || "Не удалось создать категорию")
  }
}

export async function updateCategory(data: CategoryUpdateData) {
  const supabase = createClient()

  try {
    // Проверяем и обеспечиваем уникальность слага, исключая текущую запись
    const uniqueSlug = await ensureUniqueSlug(data.slug, "categories", data.id)

    // Обновляем категорию с уникальным слагом
    const { error } = await supabase
      .from("categories")
      .update({
        title: data.title,
        slug: uniqueSlug,
      })
      .eq("id", data.id)

    if (error) throw error

    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error: any) {
    console.error("Ошибка при обновлении категории:", error)
    throw new Error(error.message || "Не удалось обновить категорию")
  }
}

export async function deleteCategory(id: string) {
  const supabase = createClient()

  try {
    // Проверяем, есть ли продукты, связанные с этой категорией
    const { count, error: countError } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("category_id", id)

    if (countError) throw countError

    if (count && count > 0) {
      throw new Error(`Нельзя удалить категорию, так как с ней связано ${count} продуктов`)
    }

    // Удаляем категорию
    const { error } = await supabase.from("categories").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error: any) {
    console.error("Ошибка при удалении категории:", error)
    throw new Error(error.message || "Не удалось удалить категорию")
  }
}
