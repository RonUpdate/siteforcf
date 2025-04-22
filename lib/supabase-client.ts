import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Create a single supabase client for the entire client-side application
let supabaseClient: ReturnType<typeof createClientComponentClient> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClientComponentClient()
  }
  return supabaseClient
}
