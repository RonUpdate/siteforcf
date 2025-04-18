"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { isAdminClient, getCurrentUser } from "@/utils/auth-utils"
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react"

interface Policy {
  policyname: string
  permissive: string
  roles: string[]
  cmd: string
  qual: string
}

interface SecurityDashboardProps {
  productPolicies: Policy[]
  categoryPolicies: Policy[]
  blogPolicies: Policy[]
  counts: {
    products: number
    categories: number
    blogPosts: number
  }
}

export default function SecurityDashboard({
  productPolicies,
  categoryPolicies,
  blogPolicies,
  counts,
}: SecurityDashboardProps) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [user, setUser] = useState<any>(null)
  const [testResults, setTestResults] = useState<{ [key: string]: boolean }>({})
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({})

  const supabase = createClient()

  useEffect(() => {
    const checkAdmin = async () => {
      const adminStatus = await isAdminClient()
      setIsAdmin(adminStatus)

      const currentUser = await getCurrentUser()
      setUser(currentUser)
    }

    checkAdmin()
  }, [])

  const testOperation = async (operation: string) => {
    setLoading((prev) => ({ ...prev, [operation]: true }))

    try {
      let result = false

      switch (operation) {
        case "readProducts":
          const { data: products } = await supabase.from("products").select("*").limit(1)
          result = !!products && products.length >= 0
          break

        case "createProduct":
          const { error: insertError } = await supabase.from("products").insert({
            title: "Test Product",
            description: "This is a test product",
            image_url: "",
            external_url: "",
          })
          result = !insertError
          break

        case "updateProduct":
          if (counts.products > 0) {
            const { data: firstProduct } = await supabase.from("products").select("id").limit(1)
            if (firstProduct && firstProduct.length > 0) {
              const { error: updateError } = await supabase
                .from("products")
                .update({ title: "Updated Test Product" })
                .eq("id", firstProduct[0].id)
              result = !updateError
            }
          }
          break

        case "deleteProduct":
          if (counts.products > 0) {
            const { data: lastProduct } = await supabase
              .from("products")
              .select("id")
              .order("created_at", { ascending: false })
              .limit(1)
            if (lastProduct && lastProduct.length > 0) {
              const { error: deleteError } = await supabase.from("products").delete().eq("id", lastProduct[0].id)
              result = !deleteError
            }
          }
          break

        case "readCategories":
          const { data: categories } = await supabase.from("categories").select("*").limit(1)
          result = !!categories && categories.length >= 0
          break

        case "readBlogPosts":
          const { data: posts } = await supabase.from("blog_posts").select("*").limit(1)
          result = !!posts && posts.length >= 0
          break
      }

      setTestResults((prev) => ({ ...prev, [operation]: result }))
    } catch (error) {
      console.error(`Error testing ${operation}:`, error)
      setTestResults((prev) => ({ ...prev, [operation]: false }))
    } finally {
      setLoading((prev) => ({ ...prev, [operation]: false }))
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Current User Status</h2>
        </div>

        {user ? (
          <div className="space-y-2">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Admin Status:</strong>{" "}
              {isAdmin ? (
                <span className="inline-flex items-center text-green-600">
                  <ShieldCheck className="w-4 h-4 mr-1" /> Admin
                </span>
              ) : (
                <span className="inline-flex items-center text-red-600">
                  <ShieldAlert className="w-4 h-4 mr-1" /> Not Admin
                </span>
              )}
            </p>
          </div>
        ) : (
          <p>Not logged in</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Security Policy Tests</h2>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Products Table</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => testOperation("readProducts")}
                disabled={loading.readProducts}
                className="p-3 border rounded-md hover:bg-gray-50 flex justify-between items-center"
              >
                <span>Test Read Access</span>
                {loading.readProducts ? (
                  <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                ) : testResults.readProducts === undefined ? null : testResults.readProducts ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
              </button>

              <button
                onClick={() => testOperation("createProduct")}
                disabled={loading.createProduct}
                className="p-3 border rounded-md hover:bg-gray-50 flex justify-between items-center"
              >
                <span>Test Create Access</span>
                {loading.createProduct ? (
                  <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                ) : testResults.createProduct === undefined ? null : testResults.createProduct ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
              </button>

              <button
                onClick={() => testOperation("updateProduct")}
                disabled={loading.updateProduct || counts.products === 0}
                className="p-3 border rounded-md hover:bg-gray-50 flex justify-between items-center"
              >
                <span>Test Update Access</span>
                {loading.updateProduct ? (
                  <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                ) : testResults.updateProduct === undefined ? null : testResults.updateProduct ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
              </button>

              <button
                onClick={() => testOperation("deleteProduct")}
                disabled={loading.deleteProduct || counts.products === 0}
                className="p-3 border rounded-md hover:bg-gray-50 flex justify-between items-center"
              >
                <span>Test Delete Access</span>
                {loading.deleteProduct ? (
                  <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                ) : testResults.deleteProduct === undefined ? null : testResults.deleteProduct ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Other Tables</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => testOperation("readCategories")}
                disabled={loading.readCategories}
                className="p-3 border rounded-md hover:bg-gray-50 flex justify-between items-center"
              >
                <span>Test Categories Read</span>
                {loading.readCategories ? (
                  <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                ) : testResults.readCategories === undefined ? null : testResults.readCategories ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
              </button>

              <button
                onClick={() => testOperation("readBlogPosts")}
                disabled={loading.readBlogPosts}
                className="p-3 border rounded-md hover:bg-gray-50 flex justify-between items-center"
              >
                <span>Test Blog Posts Read</span>
                {loading.readBlogPosts ? (
                  <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                ) : testResults.readBlogPosts === undefined ? null : testResults.readBlogPosts ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Active Security Policies</h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Products Table Policies</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Policy Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Operation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roles
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productPolicies.map((policy, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {policy.policyname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.cmd}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.roles.join(", ")}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.permissive}</td>
                    </tr>
                  ))}
                  {productPolicies.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        No policies found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Categories Table Policies</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Policy Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Operation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roles
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categoryPolicies.map((policy, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {policy.policyname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.cmd}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.roles.join(", ")}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.permissive}</td>
                    </tr>
                  ))}
                  {categoryPolicies.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        No policies found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Blog Posts Table Policies</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Policy Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Operation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roles
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blogPolicies.map((policy, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {policy.policyname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.cmd}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.roles.join(", ")}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.permissive}</td>
                    </tr>
                  ))}
                  {blogPolicies.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        No policies found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
