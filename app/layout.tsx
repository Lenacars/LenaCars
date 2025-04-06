import type React from "react"
import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import MainHeader from "@/components/MainHeader" // Header bileşeninizi import edin
import Footer from "@/components/Footer" // Footer bileşeninizi import edin

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LenaCars - Otomobilde Güvenli Rotanız",
  description: "Yüzlerce Araç Tek Ekranda Seç Beğen Güvenle Kirala",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <MainHeader /> {/* Header bileşenini ekleyin */}
          {children}
          <Footer /> {/* Footer bileşenini ekleyin */}
        </ThemeProvider>
      </body>
    </html>
  )
}
