"use server"

import { revalidatePath } from "next/cache"
import { ensureUniqueSlug, generateSlug } from "@/utils/slug-utils"

interface CategoryData {
  title: string
  slug: string
}

interface CategoryUpdateData extends CategoryData {
  id: string
}

export async function createCategory(data: CategoryData) {
  const { createServerClient } = await import("@/utils/supabase/server")
  const supabase = await createServerClient()

  try {
    // Если слаг не предоставлен, генерируем его из заголовка
    const slugToUse = data.slug || generateSlug(data.title)

    if (!slugToUse) {
      throw new Error("Слаг не может быть пустым")
    }

    // Проверяем и обеспечиваем уникальность слага
    const uniqueSlug = await ensureUniqueSlug(slugToUse, "categories")

    // Создаем категорию с уникальным слагом
    const { error } = await supabase.from("categories").insert({
      title: data.title,
      slug: uniqueSlug,
    })

    if (error) {
      console.error("Ошибка при создании категории:", error)
      throw new Error(error.message || "Не удалось создать категорию")
    }

    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error: any) {
    console.error("Ошибка при создании категории:", error)
    throw new Error(error.message || "Не удалось создать категорию")
  }
}

export async function updateCategory(data: CategoryUpdateData) {
  const { createServerClient } = await import("@/utils/supabase/server")
  const supabase = await createServerClient()

  try {
    // Если слаг не предоставлен, генерируем его из заголовка
    const slugToUse = data.slug || generateSlug(data.title)

    if (!slugToUse) {
      throw new Error("Слаг не может быть пустым")
    }

    // Проверяем и обеспечиваем уникальность слага, исключая текущую запись
    const uniqueSlug = await ensureUniqueSlug(slugToUse, "categories", data.id)

    // Обновляем категорию с уникальным слагом
    const { error } = await supabase
      .from("categories")
      .update({
        title: data.title,
        slug: uniqueSlug,
      })
      .eq("id", data.id)

    if (error) {
      console.error("Ошибка при обновлении категории:", error)
      throw new Error(error.message || "Не удалось обновить категорию")
    }

    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error: any) {
    console.error("Ошибка при обновлении категории:", error)
    throw new Error(error.message || "Не удалось обновить категорию")
  }
}

export async function deleteCategory(id: string) {
  const { createServerClient } = await import("@/utils/supabase/server")
  const supabase = await createServerClient()

  try {
    // Удаляем категорию
    const { error } = await supabase.from("categories").delete().eq("id", id)

    if (error) {
      console.error("Ошибка при удалении категории:", error)
      throw new Error(error.message || "Не удалось удалить категорию")
    }

    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error: any) {
    console.error("Ошибка при удалении категории:", error)
    throw new Error(error.message || "Не удалось удалить категорию")
  }
}
