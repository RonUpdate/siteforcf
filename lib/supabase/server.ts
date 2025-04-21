// Реэкспортируем безопасную версию
import { createServerClientSafe } from "./server-safe"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { createServerClientLegacy } from "./server-legacy"

export const createServerClient = createServerClientSafe

export function createServerClient_old() {
  const cookieStore = cookies()

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

// Реэкспортируем legacy версию для использования в pages/ директории
export { createServerClientLegacy }
