"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { ensureUniqueSlug } from "@/utils/slug-utils"

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
  const supabase = createClient()

  try {
    // Проверяем и обеспечиваем уникальность слага
    const uniqueSlug = await ensureUniqueSlug(data.slug, "products")

    // Создаем продукт с уникальным слагом
    const { error } = await supabase.from("products").insert({
      title: data.title,
      slug: uniqueSlug, // Добавляем слаг в таблицу продуктов
      description: data.description,
      image_url: data.image_url,
      external_url: data.external_url,
      category_id: data.category_id,
    })

    if (error) throw error

    revalidatePath("/admin/products")
    return { success: true }
  } catch (error: any) {
    console.error("Ошибка при создании продукта:", error)
    throw new Error(error.message || "Не удалось создать продукт")
  }
}

export async function updateProduct(data: ProductUpdateData) {
  const supabase = createClient()

  try {
    // Проверяем и обеспечиваем уникальность слага, исключая текущую запись
    const uniqueSlug = await ensureUniqueSlug(data.slug, "products", data.id)

    // Обновляем продукт с уникальным слагом
    const { error } = await supabase
      .from("products")
      .update({
        title: data.title,
        slug: uniqueSlug, // Обновляем слаг в таблице продуктов
        description: data.description,
        image_url: data.image_url,
        external_url: data.external_url,
        category_id: data.category_id,
      })
      .eq("id", data.id)

    if (error) throw error

    revalidatePath("/admin/products")
    return { success: true }
  } catch (error: any) {
    console.error("Ошибка при обновлении продукта:", error)
    throw new Error(error.message || "Не удалось обновить продукт")
  }
}

export async function deleteProduct(id: string) {
  const supabase = createClient()

  try {
    // Удаляем продукт
    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/admin/products")
    return { success: true }
  } catch (error: any) {
    console.error("Ошибка при удалении продукта:", error)
    throw new Error(error.message || "Не удалось удалить продукт")
  }
}
