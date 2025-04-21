import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/context/cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "Креатив Фабрика",
  description: "Магазин креативных товаров для творчества",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <head>
        <link
          rel="preload"
          href="/_next/static/media/6d93bde91c0c2823-s.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  )
}
