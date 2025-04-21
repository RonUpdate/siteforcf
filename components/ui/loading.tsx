import { Loader2 } from "lucide-react"

interface LoadingProps {
  message?: string
  className?: string
}

export function Loading({ message = "Загрузка...", className = "" }: LoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-2" />
      <p className="text-gray-600">{message}</p>
    </div>
  )
}
