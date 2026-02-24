import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartProvider } from "@/lib/cart-context"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "Cersanit Shop — Керамическая плитка и керамогранит",
  description:
    "Официальный магазин керамической плитки Cersanit. Большой выбор керамогранита, мозаики и ступеней. Доставка по всей России.",
}

export const viewport: Viewport = {
  themeColor: "#1e3a5f",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={`${inter.className} antialiased`}>
        <CartProvider>
          <SiteHeader />
          <main className="min-h-screen">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  )
}
