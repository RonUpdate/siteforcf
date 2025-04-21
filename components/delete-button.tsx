"use client"

import type React from "react"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface DeleteButtonProps {
  id: string
  name: string
  deleteFunction: (id: string) => Promise<any>
  entityName: string
  children: React.ReactNode
}

export default function DeleteButton({ id, name, deleteFunction, entityName, children }: DeleteButtonProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)
    try {
      await deleteFunction(id)
      setOpen(false)
    } catch (error: any) {
      console.error("Error deleting:", error)
      setError(error.message || "Произошла ошибка при удалении")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
          {children}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы действительно хотите удалить {entityName} <strong>{name}</strong>? Это действие необратимо.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <div className="bg-red-50 p-3 rounded text-red-600 text-sm mb-4">{error}</div>}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Отмена</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleDelete} disabled={isDeleting} variant="destructive">
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Удалить
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
