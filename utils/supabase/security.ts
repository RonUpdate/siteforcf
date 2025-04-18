import { createClient } from "./server"
import { cookies } from "next/headers"

/**
 * Checks if the current user is an admin
 * @returns boolean indicating if the user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user?.email === "admin@example.com"
}

/**
 * Middleware function to check if user is admin and redirect if not
 * @param redirectTo The path to redirect to if user is not admin
 * @returns An object with isAdmin boolean and redirectUrl if not admin
 */
export async function checkAdminAccess(redirectTo = "/"): Promise<{
  isAdmin: boolean
  redirectUrl?: string
}> {
  const isUserAdmin = await isAdmin()

  if (!isUserAdmin) {
    return {
      isAdmin: false,
      redirectUrl: redirectTo,
    }
  }

  return { isAdmin: true }
}

/**
 * Gets the current user's ID
 * @returns The user ID or null if not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user?.id || null
}
