import { createClient } from "./client"

/**
 * Checks if the current user is an admin (client-side)
 * @returns Promise<boolean> indicating if the user is an admin
 */
export async function isAdminClient(): Promise<boolean> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user?.email === "admin@example.com"
}

/**
 * Redirects to the specified URL if the user is not an admin
 * @param redirectTo The path to redirect to if user is not admin
 * @returns boolean indicating if the user is an admin
 */
export async function redirectIfNotAdmin(redirectTo = "/"): Promise<boolean> {
  const isAdmin = await isAdminClient()

  if (!isAdmin && typeof window !== "undefined") {
    window.location.href = redirectTo
    return false
  }

  return isAdmin
}
