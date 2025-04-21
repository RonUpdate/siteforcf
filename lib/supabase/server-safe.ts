import { createClient } from "@supabase/supabase-js"

// Безопасная версия, которая не использует next/headers
export function createServerClientSafe() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string)
}
