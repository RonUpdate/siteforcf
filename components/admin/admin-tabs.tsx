"use client"

import { useState } from "react"
import ProductsAdmin from "./products-admin"
import CategoriesAdmin from "./categories-admin"
import BlogAdmin from "./blog-admin"
import AnalyticsAdmin from "./analytics-admin"

export default function AdminTabs() {
  const [activeTab, setActiveTab] = useState("products")

  return (
    <div>
      <div className="border-b mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab("products")}
            className={`py-2 px-4 font-medium ${
              activeTab === "products"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`py-2 px-4 font-medium ${
              activeTab === "categories"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab("blog")}
            className={`py-2 px-4 font-medium ${
              activeTab === "blog" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Blog Posts
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`py-2 px-4 font-medium ${
              activeTab === "analytics"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Analytics
          </button>
        </nav>
      </div>

      <div>
        {activeTab === "products" && <ProductsAdmin />}
        {activeTab === "categories" && <CategoriesAdmin />}
        {activeTab === "blog" && <BlogAdmin />}
        {activeTab === "analytics" && <AnalyticsAdmin />}
      </div>
    </div>
  )
}
