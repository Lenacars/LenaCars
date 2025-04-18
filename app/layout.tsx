// app/layout.tsx

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import MainHeader from "@/components/layout/MainHeader"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LenaCars - Kurumsal Araç Kiralama Çözümleri",
  description:
    "Kurumsal araç kiralama adımlarını LenaCars uzmanlığı ile tek bir ekranda çözebileceğiniz, yüzlerce araç seçeneğine ve en uygun fiyatlara hızlıca ulaşabileceğiniz online tabanlı araç kiralama platformu.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <MainHeader />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
