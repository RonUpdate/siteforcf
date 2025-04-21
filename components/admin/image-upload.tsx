"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { supabaseClient } from "@/lib/supabase/client"
import { Upload, X, Loader2 } from "lucide-react"

interface ImageUploadProps {
  bucket: "product-images" | "category-images" | "blog-images" | "avatars"
  folder?: string
  onUpload: (url: string) => void
  existingUrl?: string
  className?: string
}

export function ImageUpload({ bucket, folder = "", onUpload, existingUrl, className = "" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(existingUrl || null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null)

      if (!event.target.files || event.target.files.length === 0) {
        return
      }

      const file = event.target.files[0]
      const fileExt = file.name.split(".").pop()
      const fileName = `${folder ? `${folder}/` : ""}${Date.now()}.${fileExt}`
      const filePath = fileName

      setUploading(true)

      const { data, error } = await supabaseClient().storage.from(bucket).upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        throw error
      }

      const { data: urlData } = supabaseClient().storage.from(bucket).getPublicUrl(data.path)

      setPreview(urlData.publicUrl)
      onUpload(urlData.publicUrl)
    } catch (error: any) {
      console.error("Ошибка загрузки:", error.message)
      setError("Ошибка загрузки изображения. Пожалуйста, попробуйте снова.")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onUpload("")
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {preview ? (
        <div className="relative">
          <div className="relative h-48 w-full rounded-md overflow-hidden border">
            <Image src={preview || "/placeholder.svg"} alt="Предпросмотр" fill className="object-cover" />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {uploading ? (
                <Loader2 className="w-8 h-8 mb-2 text-gray-500 animate-spin" />
              ) : (
                <>
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Нажмите для загрузки</span> или перетащите файл
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, WEBP (макс. 5MB)</p>
                </>
              )}
            </div>
            <input
              id="image-upload"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
