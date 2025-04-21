"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabaseClient } from "@/lib/supabase/client"

export default function AdminLogoutPage() {
  const router = useRouter()

  useEffect(() => {
    async function signOut() {
      await supabaseClient().auth.signOut()
      router.push("/admin/login")
    }

    signOut()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800 mx-auto"></div>
        <p className="text-gray-600">Выход из системы...</p>
      </div>
    </div>
  )
}
