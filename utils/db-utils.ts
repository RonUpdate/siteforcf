import { createClient } from "@/utils/supabase/server"

/**
 * Получает продукт по слагу
 * @param slug Слаг продукта
 * @returns Данные продукта или null, если продукт не найден
 */
export async function getProductBySlug(slug: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories:category_id (
        id,
        title,
        slug
      )
    `)
    .eq("slug", slug)
    .single()

  if (error) {
    console.error("Ошибка при получении продукта по слагу:", error)
    return null
  }

  return data
}

/**
 * Получает категорию по слагу
 * @param slug Слаг категории
 * @returns Данные категории или null, если категория не найдена
 */
export async function getCategoryBySlug(slug: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).single()

  if (error) {
    console.error("Ошибка при получении категории по слагу:", error)
    return null
  }

  return data
}

/**
 * Получает блог-пост по слагу
 * @param slug Слаг блог-поста
 * @returns Данные блог-поста или null, если блог-пост не найден
 */
export async function getBlogPostBySlug(slug: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).single()

  if (error) {
    console.error("Ошибка при получении блог-поста по слагу:", error)
    return null
  }

  return data
}

/**
 * Получает продукты по категории
 * @param categorySlug Слаг категории
 * @returns Список продуктов в категории
 */
export async function getProductsByCategory(categorySlug: string) {
  const supabase = createClient()

  // Сначала получаем ID категории по слагу
  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single()

  if (categoryError || !category) {
    console.error("Ошибка при получении категории:", categoryError)
    return []
  }

  // Затем получаем продукты по ID категории
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", category.id)
    .order("created_at", { ascending: false })

  if (productsError) {
    console.error("Ошибка при получении продуктов:", productsError)
    return []
  }

  return products
}
