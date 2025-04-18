"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function AnalyticsAdmin() {
  const [productCount, setProductCount] = useState(0)
  const [categoryCount, setCategoryCount] = useState(0)
  const [blogPostCount, setBlogPostCount] = useState(0)
  const [productsByCategory, setProductsByCategory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)

      try {
        // Get counts
        const { count: pCount } = await supabase.from("products").select("*", { count: "exact", head: true })
        const { count: cCount } = await supabase.from("categories").select("*", { count: "exact", head: true })
        const { count: bCount } = await supabase.from("blog_posts").select("*", { count: "exact", head: true })

        setProductCount(pCount || 0)
        setCategoryCount(cCount || 0)
        setBlogPostCount(bCount || 0)

        // Get products by category
        const { data: categories } = await supabase.from("categories").select("id, title")

        if (categories) {
          const categoryData = []

          for (const category of categories) {
            const { count } = await supabase
              .from("products")
              .select("*", { count: "exact", head: true })
              .eq("category_id", category.id)

            categoryData.push({
              name: category.title,
              count: count || 0,
            })
          }

          // Add uncategorized
          const { count: uncategorizedCount } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .is("category_id", null)

          categoryData.push({
            name: "Uncategorized",
            count: uncategorizedCount || 0,
          })

          setProductsByCategory(categoryData)
        }
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [supabase])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-500 mb-2">Total Products</h3>
              <p className="text-4xl font-bold">{productCount}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-500 mb-2">Total Categories</h3>
              <p className="text-4xl font-bold">{categoryCount}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-500 mb-2">Total Blog Posts</h3>
              <p className="text-4xl font-bold">{blogPostCount}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-500 mb-4">Products by Category</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productsByCategory}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
