"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Download } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"

type ColoringPage = {
  id: string
  title: string
  description: string
  price: number
  image_url: string
  thumbnail_url: string
  slug: string
  difficulty_level: string
  age_group: string
  is_featured: boolean
  download_count: number
  category_id: string
  created_at: string
  categories: {
    name: string
  }
}

export function ColoringPagesTable({ coloringPages }: { coloringPages: ColoringPage[] }) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseClient()
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)

    try {
      const { error } = await supabase.from("coloring_pages").delete().eq("id", deleteId)

      if (error) {
        throw error
      }

      toast({
        title: "Coloring page deleted",
        description: "The coloring page has been successfully deleted.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error deleting coloring page:", error)
      toast({
        title: "Error",
        description: "Failed to delete the coloring page. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  if (coloringPages.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-gray-500 dark:text-gray-400 mb-4">No coloring pages found</p>
        <Link href="/admin/coloring-pages/new">
          <Button>Add your first coloring page</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Age Group</TableHead>
              <TableHead className="hidden md:table-cell">Downloads</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coloringPages.map((page) => (
              <TableRow key={page.id}>
                <TableCell>
                  <div className="relative h-10 w-10 rounded overflow-hidden">
                    <Image
                      src={
                        page.thumbnail_url ||
                        page.image_url ||
                        "/placeholder.svg?height=40&width=40&query=coloring+page"
                      }
                      alt={page.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{page.title}</TableCell>
                <TableCell>{formatPrice(page.price)}</TableCell>
                <TableCell className="hidden md:table-cell">{page.categories?.name || "Uncategorized"}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline">{page.age_group}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center">
                    <Download className="w-3 h-3 mr-1" />
                    {page.download_count}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/coloring-pages/${page.id}`}>
                      <Button size="icon" variant="ghost">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </Link>
                    <Button size="icon" variant="ghost" className="text-red-500" onClick={() => setDeleteId(page.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the coloring page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600" disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
