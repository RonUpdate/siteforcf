import { createClient } from "@/utils/supabase/server"
import ProductCard from "@/components/product-card"
import CategoryFilter from "@/components/category-filter"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const supabase = createClient()

  // Получаем категории для фильтра
  const { data: categories } = await supabase.from("categories").select("id, title, slug").order("title")

  // Формируем запрос для продуктов с фильтрацией по категории
  let productsQuery = supabase
    .from("products")
    .select(`
      id, 
      title, 
      description, 
      image_url, 
      external_url,
      categories (
        id, 
        title,
        slug
      )
    `)
    .order("created_at", { ascending: false })

  // Применяем фильтр по категории, если он указан
  if (searchParams.category) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", searchParams.category)
      .single()

    if (categoryData) {
      productsQuery = productsQuery.eq("category_id", categoryData.id)
    }
  }

  // Выполняем запрос
  const { data: products } = await productsQuery

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Все продукты</h1>

      {/* Фильтр по категориям */}
      {categories && (
        <div className="mb-8">
          <CategoryFilter categories={categories} activeCategory={searchParams.category} />
        </div>
      )}

      {/* Сетка продуктов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products && products.length > 0 ? (
          products.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Продукты не найдены</p>
          </div>
        )}
      </div>
    </div>
  )
}
