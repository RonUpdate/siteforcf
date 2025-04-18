"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import ProductGrid from "@/components/product-grid"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(query)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const fetchProducts = async () => {
      if (!searchQuery.trim()) {
        setProducts([])
        return
      }

      setLoading(true)

      const { data, error } = await supabase
        .from("products")
        .select(`
          id, 
          title, 
          description, 
          image_url, 
          external_url,
          categories(id, title, slug)
        `)
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .order("created_at", { ascending: false })

      setProducts(data || [])
      setLoading(false)

      if (error) {
        console.error("Error searching products:", error)
      }
    }

    fetchProducts()
  }, [searchQuery, supabase])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Update URL with search query
    const url = new URL(window.location.href)
    url.searchParams.set("q", searchQuery)
    window.history.pushState({}, "", url.toString())
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Search Products</h1>

      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or description..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {searchQuery && (
            <p className="text-center mb-6">
              {products.length === 0
                ? "No products found"
                : `Found ${products.length} product${products.length === 1 ? "" : "s"}`}
            </p>
          )}

          <ProductGrid products={products} />
        </>
      )}
    </div>
  )
}
