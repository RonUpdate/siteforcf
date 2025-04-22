"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"

type Category = {
  id: string
  name: string
  description: string
  image_url: string
  slug: string
}

export function CategoryForm({ category }: { category?: Category }) {
  const isEditing = !!category
  const [name, setName] = useState(category?.name || "")
  const [description, setDescription] = useState(category?.description || "")
  const [slug, setSlug] = useState(category?.slug || "")
  const [imageUrl, setImageUrl] = useState(category?.image_url || "")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(category?.image_url || null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseClient()
  const { toast } = useToast()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)

    // Create a preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const generateSlug = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, "") // Remove all non-word chars
      .replace(/--+/g, "-") // Replace multiple - with single -
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)
    if (!isEditing || !category?.slug) {
      setSlug(generateSlug(newName))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let finalImageUrl = imageUrl

      // Upload image if a new one was selected
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `categories/${fileName}`

        const { error: uploadError, data } = await supabase.storage.from("category-images").upload(filePath, imageFile)

        if (uploadError) {
          throw uploadError
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("category-images").getPublicUrl(filePath)

        finalImageUrl = publicUrl
      }

      // Create or update the category
      if (isEditing) {
        const { error } = await supabase
          .from("categories")
          .update({
            name,
            description,
            slug,
            image_url: finalImageUrl,
          })
          .eq("id", category.id)

        if (error) throw error

        toast({
          title: "Category updated",
          description: "The category has been successfully updated.",
        })
      } else {
        const { error } = await supabase.from("categories").insert({
          name,
          description,
          slug,
          image_url: finalImageUrl,
        })

        if (error) throw error

        toast({
          title: "Category created",
          description: "The category has been successfully created.",
        })
      }

      router.push("/admin/categories")
      router.refresh()
    } catch (error) {
      console.error("Error saving category:", error)
      toast({
        title: "Error",
        description: "Failed to save the category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Link href="/admin/categories" className="flex items-center text-sm mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to categories
      </Link>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={handleNameChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <div className="flex gap-2">
                  <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
                  <Button type="button" variant="outline" onClick={() => setSlug(generateSlug(name))}>
                    Generate
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Used in URLs, e.g., /category/your-slug</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <div className="relative h-24 w-24 rounded overflow-hidden border">
                      <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("image-upload")?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <p className="text-xs text-gray-500 mt-2">Recommended size: 800x600px</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Or use image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/admin/categories">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : isEditing ? "Update Category" : "Create Category"}
          </Button>
        </div>
      </form>
    </div>
  )
}
