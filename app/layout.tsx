import type React from "react"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata = {
  title: "Креатив Фабрика - Товары для творчества",
  description: "Магазин товаров для творчества и рукоделия",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
