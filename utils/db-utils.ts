/**
 * Получает продукт по слагу
 * @param slug Слаг продукта
 * @returns Данные продукта или null, если продукт не найден
 */
export async function getProductBySlug(slug: string) {
  const { createServerClient } = await import("@/utils/supabase/server")
  const supabase = await createServerClient()

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
  const { createServerClient } = await import("@/utils/supabase/server")
  const supabase = await createServerClient()

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
  const { createServerClient } = await import("@/utils/supabase/server")
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).single()

  if (error) {
    console.error("Ошибка при получении блог-поста по слагу:", error)
    return null
  }

  return data
}

/**
 * Получает продукты по слагу категории
 * @param slug Слаг категории
 * @returns Данные продуктов или null, если продукты не найдены
 */
export async function getProductsByCategory(slug: string) {
  const { createServerClient } = await import("@/utils/supabase/server")
  const supabase = await createServerClient()

  const { data: category } = await supabase.from("categories").select("id").eq("slug", slug).single()

  if (!category) {
    console.error("Категория не найдена")
    return null
  }

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
    .eq("category_id", category.id)

  if (error) {
    console.error("Ошибка при получении продуктов по категории:", error)
    return null
  }

  return data
}
