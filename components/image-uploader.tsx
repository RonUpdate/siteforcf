"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, X, ImageIcon, AlertCircle } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImageUploaderProps {
  bucketName: string
  onImageUploaded: (url: string) => void
  existingImageUrl?: string
  folder?: string
  maxSizeMB?: number
  allowedTypes?: string[]
}

export default function ImageUploader({
  bucketName,
  onImageUploaded,
  existingImageUrl = "",
  folder = "",
  maxSizeMB = 5,
  allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string>(existingImageUrl)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  // Обновляем превью, если изменился existingImageUrl
  useEffect(() => {
    if (existingImageUrl) {
      setPreview(existingImageUrl)
      setImageLoaded(false)
      setImageError(false)
    }
  }, [existingImageUrl])

  const validateFile = (file: File): string | null => {
    // Проверка типа файла
    if (!allowedTypes.includes(file.type)) {
      return `Недопустимый тип файла. Разрешены только: ${allowedTypes.join(", ")}`
    }

    // Проверка размера файла
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return `Файл слишком большой. Максимальный размер: ${maxSizeMB}MB`
    }

    return null
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]

    // Валидация файла
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setUploading(true)
    setError(null)
    setImageError(false)

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
        const filePathMatch = preview.match(new RegExp(`/storage/v1/object/public/${bucketName}/(.+)`))
        if (filePathMatch && filePathMatch[1]) {
          const filePath = decodeURIComponent(filePathMatch[1])
          await supabase.storage.from(bucketName).remove([filePath])
        }
      }

      // Сбрасываем превью и вызываем callback с пустой строкой
      setPreview("")
      onImageUploaded("")
      setImageLoaded(false)
      setImageError(false)

      // Сбрасываем значение input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error: any) {
      console.error("Ошибка удаления изображения:", error)
      setError(error.message || "Ошибка удаления изображения")
    }
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(false)
  }

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          )}

          {imageError ? (
            <div className="h-64 flex items-center justify-center border rounded-md bg-gray-50">
              <div className="text-center p-4">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Ошибка загрузки изображения</p>
              </div>
            </div>
          ) : (
            <img
              src={preview || "/placeholder.svg"}
              alt="Preview"
              className={`max-h-64 rounded-md object-contain border ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}

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
          <p className="text-xs text-gray-500 mt-2">
            Поддерживаемые форматы: {allowedTypes.map((type) => type.replace("image/", "").toUpperCase()).join(", ")}
            <br />
            Максимальный размер: {maxSizeMB}MB
          </p>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={allowedTypes.join(",")}
        className="hidden"
      />

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
