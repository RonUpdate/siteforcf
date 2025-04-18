"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, Code } from "lucide-react"
import MarkdownRenderer from "@/components/markdown-renderer"

interface MarkdownPreviewProps {
  content: string
  onChange: (content: string) => void
}

export default function MarkdownPreview({ content, onChange }: MarkdownPreviewProps) {
  const [activeTab, setActiveTab] = useState<string>("edit")

  return (
    <div className="border rounded-md">
      <div className="flex items-center justify-between border-b p-2">
        <div className="flex gap-2">
          <Button
            type="button"
            variant={activeTab === "edit" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("edit")}
          >
            <Code className="h-4 w-4 mr-2" />
            Редактировать
          </Button>
          <Button
            type="button"
            variant={activeTab === "preview" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("preview")}
          >
            <Eye className="h-4 w-4 mr-2" />
            Предпросмотр
          </Button>
        </div>
      </div>

      <div className="p-4">
        {activeTab === "edit" ? (
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className="w-full min-h-[400px] font-mono text-sm p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <div className="prose prose-sm max-w-none min-h-[400px] p-4 border rounded-md bg-gray-50">
            {content ? (
              <MarkdownRenderer content={content} />
            ) : (
              <p className="text-gray-400">Нет содержимого для предпросмотра</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
