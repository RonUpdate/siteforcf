import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Настройка администратора Supabase",
  description: "Настройка пользователя admin@example.com в Supabase",
}

export default function AdminSetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Настройка администратора Supabase</h1>
        <p className="text-muted-foreground mt-2">
          Управление пользователем admin@example.com и настройками безопасности
        </p>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <Link href="/admin-setup" passHref legacyBehavior>
              <TabsTrigger value="user" asChild>
                <a>Управление пользователем</a>
              </TabsTrigger>
            </Link>
            <Link href="/admin-setup/sql-queries" passHref legacyBehavior>
              <TabsTrigger value="sql" asChild>
                <a>SQL-запросы</a>
              </TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>
      </div>

      {children}
    </div>
  )
}
