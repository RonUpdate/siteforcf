import { createClient } from "@/utils/supabase/client"

/**
 * Проверяет существование бакета в хранилище Supabase
 * @param bucketName Имя бакета для проверки
 * @returns Promise<boolean> - существует ли бакет
 */
export async function checkBucketExists(bucketName: string): Promise<boolean> {
  const supabase = createClient()

  try {
    // Пытаемся получить список файлов из бакета
    const { data, error } = await supabase.storage.from(bucketName).list()

    // Если нет ошибки, значит бакет существует
    return !error
  } catch (error) {
    console.error(`Ошибка при проверке бакета ${bucketName}:`, error)
    return false
  }
}

/**
 * Проверяет политики доступа к бакету
 * @param bucketName Имя бакета для проверки
 * @returns Promise с результатами проверки
 */
export async function checkBucketPolicies(bucketName: string): Promise<{
  canRead: boolean
  canWrite: boolean
  canDelete: boolean
}> {
  const supabase = createClient()

  // Результаты по умолчанию
  const results = {
    canRead: false,
    canWrite: false,
    canDelete: false,
  }

  try {
    // Проверяем доступ на чтение
    const { data: readData, error: readError } = await supabase.storage.from(bucketName).list()
    results.canRead = !readError

    // Проверяем доступ на запись (создаем временный файл)
    const testData = new Uint8Array([0x89, 0x50, 0x4e, 0x47]) // Минимальный PNG-заголовок
    const testFileName = `test-${Date.now()}.png`

    const { data: writeData, error: writeError } = await supabase.storage
      .from(bucketName)
      .upload(testFileName, testData)

    results.canWrite = !writeError

    // Если файл был создан, проверяем доступ на удаление
    if (results.canWrite) {
      const { error: deleteError } = await supabase.storage.from(bucketName).remove([testFileName])

      results.canDelete = !deleteError
    }
  } catch (error) {
    console.error(`Ошибка при проверке политик для бакета ${bucketName}:`, error)
  }

  return results
}

/**
 * Получает публичный URL для файла в хранилище
 * @param bucketName Имя бакета
 * @param filePath Путь к файлу в бакете
 * @returns Публичный URL файла
 */
export function getPublicUrl(bucketName: string, filePath: string): string {
  const supabase = createClient()
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath)
  return data.publicUrl
}
