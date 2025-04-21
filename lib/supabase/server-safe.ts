import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// Simple in-memory cache for requests
const requestCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes cache

export function createServerClientSafe() {
  try {
    const cookieStore = cookies()
    return createServerComponentClient({
      cookies: () => cookieStore,
    })
  } catch (error) {
    console.error("Error creating server client:", error)
    // Fallback to service role if cookies() fails
    return createServerComponentClient({
      cookies: () => {
        return {
          get: () => undefined,
          getAll: () => [],
          set: () => {},
        }
      },
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    })
  }
}

// Function to safely fetch data with caching
export async function fetchWithCache<T>(
  fetchFn: () => Promise<{ data: T | null; error: any }>,
  cacheKey: string,
  defaultValue: T,
): Promise<T> {
  // Check cache first
  const cachedItem = requestCache.get(cacheKey)
  if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_TTL) {
    return cachedItem.data
  }

  try {
    const { data, error } = await fetchFn()

    if (error) {
      console.error(`Error fetching data for ${cacheKey}:`, error)

      // If we have cached data, use it even if expired
      if (cachedItem) {
        return cachedItem.data
      }

      return defaultValue
    }

    // Cache the successful response
    const result = data || defaultValue
    requestCache.set(cacheKey, { data: result, timestamp: Date.now() })

    return result
  } catch (error) {
    console.error(`Fetch error for ${cacheKey}:`, error)

    // If we have cached data, use it even if expired
    if (cachedItem) {
      return cachedItem.data
    }

    return defaultValue
  }
}
