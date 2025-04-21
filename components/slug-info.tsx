import { CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SlugInfoProps {
  className?: string
}

export default function SlugInfo({ className = "" }: SlugInfoProps) {
  return (
    <Alert className={`bg-blue-50 border-blue-200 ${className}`}>
      <div className="flex items-start">
        <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
        <AlertDescription className="text-blue-700">
          <p className="font-medium">Автоматическое формирование слагов</p>
          <p className="text-sm mt-1">
            Слаги для URL формируются автоматически на основе заголовка. Вы можете изменить слаг вручную или оставить
            поле пустым для автоматической генерации.
          </p>
          <ul className="text-sm mt-2 list-disc list-inside">
            <li>Слаги должны быть уникальными</li>
            <li>Используйте только латинские буквы, цифры и дефисы</li>
            <li>Не используйте пробелы и специальные символы</li>
          </ul>
        </AlertDescription>
      </div>
    </Alert>
  )
}
