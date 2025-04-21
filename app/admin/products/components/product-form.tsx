"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { supabaseClient } from "@/lib/supabase/client"
import { X, Upload, Loader2 } from "lucide-react"
import type { Product, Category } from "@/lib/types"

interface ProductFormProps {
  product?: Product & { images?: any[] }
  categories: Category[]
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [uploadedImages, setUploadedImages] = useState<{ url: string; isPrimary: boolean }[]>(
    product?.images?.map((img) => ({
      url: img.image_url,
      isPrimary: img.is_primary,
    })) || [],
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files)
      setImages([...images, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const removeUploadedImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index))
  }

  const setPrimaryImage = (index: number) => {
    setUploadedImages(
      uploadedImages.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      })),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let productId = product?.id

      // Create or update product
      if (productId) {
        // Update existing product
        const { error } = await supabaseClient.from("products").update(formData).eq("id", productId)

        if (error) throw error
      } else {
        // Create new product
        const { data, error } = await supabaseClient.from("products").insert(formData).select("id").single()

        if (error) throw error
        productId = data.id
      }

      // Upload new images
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const file = images[i]
          const fileExt = file.name.split(".").pop()
          const fileName = `${productId}/${Date.now()}.${fileExt}`

          const { error: uploadError } = await supabaseClient.storage.from("product-images").upload(fileName, file)

          if (uploadError) throw uploadError

          const { data: publicUrlData } = supabaseClient.storage.from("product-images").getPublicUrl(fileName)

          // Insert image record
          await supabaseClient.from("product_images").insert({
            product_id: productId,
            image_url: publicUrlData.publicUrl,
            is_primary: i === 0 && uploadedImages.length === 0,
            display_order: i,
          })
        }
      }

      // Update primary image status if changed
      if (product && uploadedImages.length > 0) {
        for (let i = 0; i < uploadedImages.length; i++) {
          const img = uploadedImages[i]
          const productImage = product.images?.find((pImg) => pImg.image_url === img.url)

          if (productImage && productImage.is_primary !== img.isPrimary) {
            await supabaseClient.from("product_images").update({ is_primary: img.isPrimary }).eq("id", productImage.id)
          }
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Изображения товара</label>

            {/* Existing images */}
            {uploadedImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Загруженные изображения:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="relative h-32 w-full border rounded-md overflow-hidden">
                        <Image
                          src={img.url || "/placeholder.svg"}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => removeUploadedImage(index)}
                          className="p-1 bg-red-600 text-white rounded-full"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-1 flex items-center">
                        <input
                          type="radio"
                          name="primaryImage"
                          checked={img.isPrimary}
                          onChange={() => setPrimaryImage(index)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-xs text-gray-500">Основное</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New images */}
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Добавить новые изображения:</p>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="images"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Нажмите для загрузки</span> или перетащите файлы
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP (макс. 5MB)</p>
                  </div>
                  <input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Preview new images */}
            {images.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Предпросмотр новых изображений:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {images.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="relative h-32 w-full border rounded-md overflow-hidden">
                        <Image
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt={`New product image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-1 bg-red-600 text-white rounded-full"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
