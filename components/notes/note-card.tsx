"use client"

import { useState } from "react"
import { Edit, Trash2 } from "lucide-react"
import type { Note } from "@/lib/types"

interface NoteCardProps {
  note: Note
  onEdit: (note: Note) => void
  onDelete: (noteId: string) => void
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirm("Вы уверены, что хотите удалить эту заметку?")) {
      setIsDeleting(true)
      try {
        await onDelete(note.id)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-2 flex items-start justify-between">
        <h3 className="text-lg font-semibold">{note.title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(note)}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Редактировать"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-red-500"
            aria-label="Удалить"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mb-3 whitespace-pre-wrap text-gray-600">{note.content}</div>
      <div className="text-xs text-gray-400">Обновлено: {formatDate(note.updated_at)}</div>
    </div>
  )
}
