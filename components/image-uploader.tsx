"use client"

import type React from "react"

import { useState, useRef } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, X, ImageIcon } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface ImageUploaderProps {
  bucketName: string
  onImageUploaded: (url: string) => void
  existingImageUrl?: string
  folder?: string
}

export default function ImageUploader({
  bucketName,
  onImageUploaded,
  existingImageUrl = "",
  folder = "",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string>(existingImageUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith("image/")) {
      setError("Пожалуйста, выберите изображение")
      return
    }

    setUploading(true)
    setError(null)

    try {
      // Создаем уникальное имя файла
      const fileExt = file.name.split(".").pop()
      const filePath = folder ? `${folder}/${uuidv4()}.${fileExt}` : `${uuidv4()}.${fileExt}`

      // Загружаем файл в Supabase Storage
      const { error: uploadError, data } = await supabase.storage.from(bucketName).upload(filePath, file)

      if (uploadError) throw uploadError

      // Получаем публичный URL файла
      const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filePath)

      const publicUrl = publicUrlData.publicUrl

      // Обновляем превью и вызываем callback
      setPreview(publicUrl)
      onImageUploaded(publicUrl)
    } catch (error: any) {
      console.error("Ошибка загрузки изображения:", error)
      setError(error.message || "Ошибка загрузки изображения")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = async () => {
    if (!preview) return

    try {
      // Если есть существующее изображение, удаляем его из хранилища
      if (preview) {
        // Извлекаем путь файла из URL
        const filePathMatch = preview.match(/\/storage\/v1\/object\/public\/.+?\/(.+)/)
        if (filePathMatch && filePathMatch[1]) {
          const filePath = decodeURIComponent(filePathMatch[1])
          await supabase.storage.from(bucketName).remove([filePath])
        }
      }

      // Сбрасываем превью и вызываем callback с пустой строкой
      setPreview("")
      onImageUploaded("")

      // Сбрасываем значение input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error: any) {
      console.error("Ошибка удаления изображения:", error)
      setError(error.message || "Ошибка удаления изображения")
    }
  }

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative">
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="max-h-64 rounded-md object-contain border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border border-dashed border-gray-300 rounded-md p-8 text-center">
          <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 mb-4">Перетащите изображение сюда или нажмите для выбора</p>
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Загрузка...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Выбрать изображение
              </>
            )}
          </Button>
        </div>
      )}

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
