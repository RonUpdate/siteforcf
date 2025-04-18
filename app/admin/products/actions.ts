"use server"

import { revalidatePath } from "next/cache"
import { ensureUniqueSlug, generateSlug } from "@/utils/slug-utils"

interface ProductData {
  title: string
  slug: string
  description: string
  image_url: string
  external_url: string
  category_id: string
}

interface ProductUpdateData extends ProductData {
  id: string
}

export async function createProduct(data: ProductData) {
  const { createServerClient } = await import("@/utils/supabase/server")
  const supabase = await createServerClient()

  try {
    // Если слаг не предоставлен, генерируем его из заголовка
    const slugToUse = data.slug || generateSlug(data.title)

    if (!slugToUse) {
      throw new Error("Слаг не может быть пустым")
    }

    // Проверяем и обеспечиваем уникальность слага
    const uniqueSlug = await ensureUniqueSlug(slugToUse, "products")

    // Создаем продукт с уникальным слагом
    const { error, data: newProduct } = await supabase
      .from("products")
      .insert({
        title: data.title,
        slug: uniqueSlug,
        description: data.description,
        image_url: data.image_url || null,
        external_url: data.external_url || null,
        category_id: data.category_id,
      })
      .select()
      .single()

    if (error) {
      console.error("Ошибка при создании продукта:", error)
      throw new Error(error.message || "Не удалось создать продукт")
    }

    revalidatePath("/admin/products")
    return { success: true, product: newProduct }
  } catch (error: any) {
    console.error("Ошибка при создании продукта:", error)
    throw new Error(error.message || "Не удалось создать продукт")
  }
}

export async function updateProduct(data: ProductUpdateData) {
  const { createServerClient } = await import("@/utils/supabase/server")
  const supabase = await createServerClient()

  try {
    // Если слаг не предоставлен, генерируем его из заголовка
    const slugToUse = data.slug || generateSlug(data.title)

    if (!slugToUse) {
      throw new Error("Слаг не может быть пустым")
    }

    // Проверяем и обеспечиваем уникальность слага, исключая текущую запись
    const uniqueSlug = await ensureUniqueSlug(slugToUse, "products", data.id)

    // Обновляем продукт с уникальным слагом
    const { error, data: updatedProduct } = await supabase
      .from("products")
      .update({
        title: data.title,
        slug: uniqueSlug,
        description: data.description,
        image_url: data.image_url || null,
        external_url: data.external_url || null,
        category_id: data.category_id,
      })
      .eq("id", data.id)
      .select()
      .single()

    if (error) {
      console.error("Ошибка при обновлении продукта:", error)
      throw new Error(error.message || "Не удалось обновить продукт")
    }

    revalidatePath("/admin/products")
    return { success: true, product: updatedProduct }
  } catch (error: any) {
    console.error("Ошибка при обновлении продукта:", error)
    throw new Error(error.message || "Не удалось обновить продукт")
  }
}

export async function deleteProduct(id: string) {
  const { createServerClient } = await import("@/utils/supabase/server")
  const supabase = await createServerClient()

  try {
    // Удаляем продукт
    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error("Ошибка при удалении продукта:", error)
      throw new Error(error.message || "Не удалось удалить продукт")
    }

    revalidatePath("/admin/products")
    return { success: true }
  } catch (error: any) {
    console.error("Ошибка при удалении продукта:", error)
    throw new Error(error.message || "Не удалось удалить продукт")
  }
}
