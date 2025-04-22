"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Layers, LayoutDashboard, LogOut, FileImage, Palette } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = getSupabaseClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  const links = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="w-5 h-5 mr-3" />,
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: <Layers className="w-5 h-5 mr-3" />,
    },
    {
      name: "Coloring Pages",
      href: "/admin/coloring-pages",
      icon: <FileImage className="w-5 h-5 mr-3" />,
    },
  ]

  return (
    <div className="w-64 border-r bg-gray-50 dark:bg-gray-900 dark:border-gray-800 h-screen flex flex-col">
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2">
          <Palette className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold">Art Market</span>
        </Link>
        <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start", pathname === link.href && "bg-primary/10 text-primary")}
                >
                  {link.icon}
                  {link.name}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t dark:border-gray-800">
        <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleSignOut}>
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
