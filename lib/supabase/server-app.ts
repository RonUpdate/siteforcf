import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Версия только для App Router
export function createServerClientApp() {
  const cookieStore = cookies()

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
    },
  })
}
