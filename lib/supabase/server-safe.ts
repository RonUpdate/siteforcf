import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// Simple in-memory cache for requests
const requestCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 60 * 1000 // 1 minute cache

export function createServerClientSafe() {
  try {
    const cookieStore = cookies()
    return createServerComponentClient({
      cookies: () => cookieStore,
      options: {
        global: {
          fetch: async (url, options) => {
            // Create a cache key from the request
            const cacheKey = `${url}:${options?.method || "GET"}:${options?.body || ""}`

            // Check if we have a cached response
            const cachedResponse = requestCache.get(cacheKey)
            if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_TTL) {
              return new Response(JSON.stringify(cachedResponse.data), {
                headers: { "Content-Type": "application/json" },
              })
            }

            // Make the actual request
            try {
              const response = await fetch(url, options)

              // Clone the response so we can read it twice
              const clonedResponse = response.clone()

              // Try to parse the response as JSON
              try {
                const data = await clonedResponse.json()

                // Cache the successful response
                if (response.ok) {
                  requestCache.set(cacheKey, { data, timestamp: Date.now() })
                }

                // Return the original response
                return response
              } catch (error) {
                // If JSON parsing fails, return the original response
                return response
              }
            } catch (error) {
              console.error("Fetch error:", error)
              // Return a generic error response
              return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
              })
            }
          },
        },
      },
    })
  } catch (error) {
    // If cookies() vызывает ошибку, используем сервисную роль
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
