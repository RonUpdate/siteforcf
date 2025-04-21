// Функция для безопасного получения данных из Supabase
export async function safeQueryData<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  defaultValue: T,
): Promise<T> {
  try {
    const { data, error } = await queryFn()

    if (error) {
      // Проверяем, является ли ошибка "Too Many Requests"
      if (error.message && error.message.includes("Too Many Requests")) {
        console.warn("Rate limit exceeded. Using default value.")
        return defaultValue
      } else {
        console.error("Error fetching data:", error)
      }
      return defaultValue
    }

    return data || defaultValue
  } catch (error: any) {
    console.error("Unexpected error:", error)
    return defaultValue
  }
}

// Функция для безопасного выполнения промисов
export async function safePromise<T>(
  promise: Promise<T>,
  defaultValue: T,
  errorMessage = "Error executing promise",
): Promise<T> {
  try {
    return await promise
  } catch (error) {
    console.error(errorMessage, error)
    return defaultValue
  }
}
