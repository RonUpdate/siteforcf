"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, Loader2 } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { NoteCard } from "@/components/notes/note-card"
import { NoteForm } from "@/components/notes/note-form"
import type { Note } from "@/lib/types"

export default function NotesPage() {
  const router = useRouter()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const supabase = createClientComponentClient()

  // Проверяем аутентификацию при загрузке страницы
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.push("/login?redirect=/notes")
      }
    }

    checkAuth()
  }, [router, supabase.auth])

  // Загружаем заметки
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/notes")
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Ошибка при загрузке заметок")
        }
        const data = await response.json()
        setNotes(data)
      } catch (error: any) {
        console.error("Ошибка при загрузке заметок:", error)
        setError(error.message || "Не удалось загрузить заметки")
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [])

  // Создание новой заметки
  const handleCreateNote = async (data: { title: string; content: string }) => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Ошибка при создании заметки")
      }

      const newNote = await response.json()
      setNotes([newNote, ...notes])
      setIsCreating(false)
    } catch (error: any) {
      console.error("Ошибка при создании заметки:", error)
      throw error
    }
  }

  // Обновление заметки
  const handleUpdateNote = async (data: { title: string; content: string }) => {
    if (!editingNote) return

    try {
      const response = await fetch(`/api/notes/${editingNote.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Ошибка при обновлении заметки")
      }

      const updatedNote = await response.json()
      setNotes(notes.map((note) => (note.id === updatedNote.id ? updatedNote : note)))
      setEditingNote(null)
    } catch (error: any) {
      console.error("Ошибка при обновлении заметки:", error)
      throw error
    }
  }

  // Удаление заметки
  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Ошибка при удалении заметки")
      }

      setNotes(notes.filter((note) => note.id !== noteId))
    } catch (error: any) {
      console.error("Ошибка при удалении заметки:", error)
      alert("Не удалось удалить заметку: " + error.message)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Мои заметки</h1>
        {!isCreating && !editingNote && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Новая заметка
          </button>
        )}
      </div>

      {error && <div className="mb-6 rounded-md bg-red-50 p-4 text-red-700">{error}</div>}

      {isCreating && (
        <div className="mb-6">
          <h2 className="mb-2 text-lg font-semibold">Создать новую заметку</h2>
          <NoteForm onSubmit={handleCreateNote} onCancel={() => setIsCreating(false)} />
        </div>
      )}

      {editingNote && (
        <div className="mb-6">
          <h2 className="mb-2 text-lg font-semibold">Редактировать заметку</h2>
          <NoteForm note={editingNote} onSubmit={handleUpdateNote} onCancel={() => setEditingNote(null)} />
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Загрузка заметок...</span>
        </div>
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onEdit={setEditingNote} onDelete={handleDeleteNote} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">У вас пока нет заметок</h2>
          <p className="mb-4 text-gray-600">Создайте свою первую заметку, нажав на кнопку "Новая заметка".</p>
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Новая заметка
            </button>
          )}
        </div>
      )}
    </div>
  )
}
