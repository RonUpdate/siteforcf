"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"

type Category = {
  id: string
  name: string
}

type ColoringPage = {
  id: string
  title: string
  description: string
  price: number
  image_url: string
  thumbnail_url: string
  category_id: string
  slug: string
  difficulty_level: string
  age_group: string
  is_featured: boolean
  download_count: number
}

export function ColoringPageForm({ coloringPage }: { coloringPage?: ColoringPage }) {
  const isEditing = !!coloringPage
  const [title, setTitle] = useState(coloringPage?.title || "")
  const [description, setDescription] = useState(coloringPage?.description || "")
  const [price, setPrice] = useState(coloringPage?.price?.toString() || "")
  const [slug, setSlug] = useState(coloringPage?.slug || "")
  const [difficultyLevel, setDifficultyLevel] = useState(coloringPage?.difficulty_level || "medium")
  const [ageGroup, setAgeGroup] = useState(coloringPage?.age_group || "all")
  const [isFeatured, setIsFeatured] = useState(coloringPage?.is_featured || false)
  const [categoryId, setCategoryId] = useState(coloringPage?.category_id || "")
  const [imageUrl, setImageUrl] = useState(coloringPage?.image_url || "")
  const [thumbnailUrl, setThumbnailUrl] = useState(coloringPage?.thumbnail_url || "")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(coloringPage?.image_url || null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(coloringPage?.thumbnail_url || null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchingCategories, setFetchingCategories] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseClient()
  const { toast } = useToast()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase.from("categories").select("id, name").order("name", { ascending: true })

        if (error) {
          throw error
        }

        setCategories(data || [])
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast({
          title: "Error",
          description: "Failed to load categories. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setFetchingCategories(false)
      }
    }

    fetchCategories()
  }, [supabase, toast])

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

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setThumbnailFile(file)

    // Create a preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string)
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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    if (!isEditing || !coloringPage?.slug) {
      setSlug(generateSlug(newTitle))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let finalImageUrl = imageUrl
      let finalThumbnailUrl = thumbnailUrl

      // Upload image if a new one was selected
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `coloring-pages/${fileName}`

        const { error: uploadError } = await supabase.storage.from("category-images").upload(filePath, imageFile)

        if (uploadError) {
          throw uploadError
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("category-images").getPublicUrl(filePath)

        finalImageUrl = publicUrl
      }

      // Upload thumbnail if a new one was selected
      if (thumbnailFile) {
        const fileExt = thumbnailFile.name.split(".").pop()
        const fileName = `thumbnails/${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `coloring-pages/${fileName}`

        const { error: uploadError } = await supabase.storage.from("category-images").upload(filePath, thumbnailFile)

        if (uploadError) {
          throw uploadError
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("category-images").getPublicUrl(filePath)

        finalThumbnailUrl = publicUrl
      }

      const coloringPageData = {
        title,
        description,
        price: Number.parseFloat(price),
        slug,
        difficulty_level: difficultyLevel,
        age_group: ageGroup,
        is_featured: isFeatured,
        category_id: categoryId || null,
        image_url: finalImageUrl,
        thumbnail_url: finalThumbnailUrl || finalImageUrl, // Use image URL as thumbnail if no thumbnail
      }

      // Create or update the coloring page
      if (isEditing) {
        const { error } = await supabase.from("coloring_pages").update(coloringPageData).eq("id", coloringPage.id)

        if (error) throw error

        toast({
          title: "Coloring page updated",
          description: "The coloring page has been successfully updated.",
        })
      } else {
        const { error } = await supabase.from("coloring_pages").insert(coloringPageData)

        if (error) throw error

        toast({
          title: "Coloring page created",
          description: "The coloring page has been successfully created.",
        })
      }

      router.push("/admin/coloring-pages")
      router.refresh()
    } catch (error) {
      console.error("Error saving coloring page:", error)
      toast({
        title: "Error",
        description: "Failed to save the coloring page. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Link href="/admin/coloring-pages" className="flex items-center text-sm mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to coloring pages
      </Link>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={title} onChange={handleTitleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <div className="flex gap-2">
                    <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
                    <Button type="button" variant="outline" onClick={() => setSlug(generateSlug(title))}>
                      Generate
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Used in URLs, e.g., /coloring-page/your-slug</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age Group</Label>
                  <Select value={ageGroup} onValueChange={setAgeGroup}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="children">Children</SelectItem>
                      <SelectItem value="adults">Adults</SelectItem>
                      <SelectItem value="all">All Ages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={categoryId} onValueChange={setCategoryId} disabled={fetchingCategories}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Uncategorized</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={isFeatured}
                    onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
                  />
                  <Label htmlFor="featured">Featured Coloring Page</Label>
                </div>
              </div>

              <div className="space-y-4">
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
                  <Label htmlFor="image">Full Size Image</Label>
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <div className="relative h-32 w-32 rounded overflow-hidden border">
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
                      <p className="text-xs text-gray-500 mt-2">High-resolution coloring page image</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail Image (Optional)</Label>
                  <div className="flex items-center gap-4">
                    {thumbnailPreview && (
                      <div className="relative h-32 w-32 rounded overflow-hidden border">
                        <Image
                          src={thumbnailPreview || "/placeholder.svg"}
                          alt="Thumbnail Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("thumbnail-upload")?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Thumbnail
                      </Button>
                      <Input
                        id="thumbnail-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleThumbnailChange}
                      />
                      <p className="text-xs text-gray-500 mt-2">Smaller preview image (if different from main image)</p>
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

                <div className="space-y-2">
                  <Label htmlFor="thumbnail_url">Or use thumbnail URL</Label>
                  <Input
                    id="thumbnail_url"
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/admin/coloring-pages">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : isEditing ? "Update Coloring Page" : "Create Coloring Page"}
          </Button>
        </div>
      </form>
    </div>
  )
}
