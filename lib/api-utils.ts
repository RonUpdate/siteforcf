// Функция для безопасного выполнения запросов к API
export async function safeApiCall<T>(apiCall: () => Promise<T>, defaultValue: T): Promise<T> {
  try {
    return await apiCall()
  } catch (error) {
    console.error("API call failed:", error)
    return defaultValue
  }
}

// Функция для обработки ответов Supabase
export function handleSupabaseResponse<T>(response: { data: T | null; error: any }, defaultValue: T): T {
  if (response.error) {
    console.error("Supabase error:", response.error)
    return defaultValue
  }
  return response.data || defaultValue
}
