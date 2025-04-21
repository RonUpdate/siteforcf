import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Simple in-memory cache for requests
const requestCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 60 * 1000 // 1 minute cache

// Singleton instance
let supabaseClientInstance: ReturnType<typeof createClientComponentClient> | null = null

export function createClientSafe() {
  if (!supabaseClientInstance) {
    supabaseClientInstance = createClientComponentClient()
  }

  return supabaseClientInstance
}
