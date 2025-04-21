import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Создаем синглтон для клиентского Supabase клиента
let supabaseInstance: ReturnType<typeof createClientComponentClient> | null = null

export const supabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClientComponentClient()
  }
  return supabaseInstance
}
