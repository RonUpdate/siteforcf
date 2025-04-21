"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabaseClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"
import { ImageUpload } from "./image-upload"
import type { Product, Category } from "@/lib/types"

interface ProductFormProps {
  product?: Product & { images?: any[] }
  categories: Category[]
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [primaryImageUrl, setPrimaryImageUrl] = useState<string>(
    product?.images?.find((img) => img.is_primary)?.image_url || "",
  )
  const [additionalImages, setAdditionalImages] = useState<string[]>(
    product?.images?.filter((img) => !img.is_primary).map((img) => img.image_url) || [],
  )
  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price || 0,
    discount_price: product?.discount_price || 0,
    stock: product?.stock || 0,
    category_id: product?.category_id || "",
    featured: product?.featured || false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement
      setFormData({
        ...formData,
        [name]: target.checked,
      })
    } else if (type === "number") {
      setFormData({
        ...formData,
        [name]: Number.parseFloat(value),
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleAddImage = () => {
    setAdditionalImages([...additionalImages, ""])
  }

  const handleUpdateAdditionalImage = (index: number, url: string) => {
    const newImages = [...additionalImages]
    newImages[index] = url
    setAdditionalImages(newImages.filter((url) => url !== ""))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let productId = product?.id

      // Create or update product
      if (productId) {
        // Update existing product
        const { error } = await supabaseClient().from("products").update(formData).eq("id", productId)

        if (error) throw error
      } else {
        // Create new product
        const { data, error } = await supabaseClient().from("products").insert(formData).select("id").single()

        if (error) throw error
        productId = data.id
      }

      // Handle primary image
      if (primaryImageUrl) {
        // Check if primary image already exists
        const { data: existingPrimaryImage } = await supabaseClient()
          .from("product_images")
          .select("id")
          .eq("product_id", productId)
          .eq("is_primary", true)
          .single()

        if (existingPrimaryImage) {
          // Update existing primary image
          await supabaseClient()
            .from("product_images")
            .update({ image_url: primaryImageUrl })
            .eq("id", existingPrimaryImage.id)
        } else {
          // Insert new primary image
          await supabaseClient().from("product_images").insert({
            product_id: productId,
            image_url: primaryImageUrl,
            is_primary: true,
            display_order: 0,
          })
        }
      }

      // Handle additional images
      if (additionalImages.length > 0) {
        // Get existing additional images
        const { data: existingImages } = await supabaseClient()
          .from("product_images")
          .select("id, image_url")
          .eq("product_id", productId)
          .eq("is_primary", false)

        // Delete images that are no longer in the list
        if (existingImages && existingImages.length > 0) {
          const existingUrls = existingImages.map((img) => img.image_url)
          const imagesToDelete = existingImages.filter((img) => !additionalImages.includes(img.image_url))

          if (imagesToDelete.length > 0) {
            await supabaseClient()
              .from("product_images")
              .delete()
              .in(
                "id",
                imagesToDelete.map((img) => img.id),
              )
          }

          // Update existing images
          for (let i = 0; i < additionalImages.length; i++) {
            const imageUrl = additionalImages[i]
            const existingImage = existingImages.find((img) => img.image_url === imageUrl)

            if (existingImage) {
              // Image already exists, update display order
              await supabaseClient()
                .from("product_images")
                .update({ display_order: i + 1 })
                .eq("id", existingImage.id)
            } else {
              // New image, insert it
              await supabaseClient()
                .from("product_images")
                .insert({
                  product_id: productId,
                  image_url: imageUrl,
                  is_primary: false,
                  display_order: i + 1,
                })
            }
          }
        } else {
          // No existing additional images, insert all
          const imagesToInsert = additionalImages.map((url, index) => ({
            product_id: productId,
            image_url: url,
            is_primary: false,
            display_order: index + 1,
          }))

          await supabaseClient().from("product_images").insert(imagesToInsert)
        }
      }

      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Ошибка при сохранении товара")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Название товара
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              URL-адрес (slug)
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">Используется в URL: /products/slug</p>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Описание
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Цена
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="discount_price" className="block text-sm font-medium text-gray-700 mb-1">
                Цена со скидкой
              </label>
              <input
                type="number"
                id="discount_price"
                name="discount_price"
                value={formData.discount_price || ""}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                Количество в наличии
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                Категория
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Выберите категорию</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                Популярный товар (отображается на главной странице)
              </label>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Основное изображение товара</label>
            <ImageUpload
              bucket="product-images"
              folder={product?.id || "new"}
              onUpload={setPrimaryImageUrl}
              existingUrl={primaryImageUrl}
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Дополнительные изображения</label>
              <button type="button" onClick={handleAddImage} className="text-sm text-blue-600 hover:text-blue-800">
                + Добавить изображение
              </button>
            </div>

            <div className="space-y-4">
              {additionalImages.map((url, index) => (
                <ImageUpload
                  key={index}
                  bucket="product-images"
                  folder={product?.id || "new"}
                  onUpload={(newUrl) => handleUpdateAdditionalImage(index, newUrl)}
                  existingUrl={url}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 mr-2"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center"
        >
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {product ? "Сохранить изменения" : "Создать товар"}
        </button>
      </div>
    </form>
  )
}
