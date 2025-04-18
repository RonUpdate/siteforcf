"use client"

import { useState } from "react"
import type { Session } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { LogIn, LogOut, Settings } from "lucide-react"
import AuthModal from "./auth-modal"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AuthButton({
  session,
  isAdmin,
}: {
  session: Session | null
  isAdmin: boolean
}) {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <>
      {/* Floating auth button */}
      <div className="fixed bottom-6 right-6 z-10 flex flex-col gap-2 items-end">
        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="sr-only">Admin Panel</span>
          </Link>
        )}

        <button
          onClick={session ? handleSignOut : () => setShowAuthModal(true)}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
        >
          {session ? <LogOut className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
          <span className="sr-only">{session ? "Sign Out" : "Sign In"}</span>
        </button>
      </div>

      {/* Auth modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  )
}
