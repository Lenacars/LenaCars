// app/layout.tsx

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import MainHeader from "@/components/layout/MainHeader"
import Footer from "@/components/footer"

import { Suspense, useEffect, useState } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LenaCars - Kurumsal Araç Kiralama Çözümleri",
  description:
    "Kurumsal araç kiralama adımlarını LenaCars uzmanlığı ile tek bir ekranda çözebileceğiniz, yüzlerce araç seçeneğine ve en uygun fiyatlara hızlıca ulaşabileceğiniz online tabanlı araç kiralama platformu.",
  generator: "v0.dev",
}

interface PageData {
  id: string;
  title: string;
  slug: string;
}

async function getPages(): Promise<PageData[]> {
  try {
    const res = await fetch("https://adminpanel-green-two.vercel.app/api/pages", {
      cache: "no-store", // Her istek taze veri çeksin
    });
    if (!res.ok) {
      throw new Error("Sayfa verisi alınamadı");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pages = await getPages();

  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <MainHeader pages={pages} /> {/* <-- Burada sayfaları gönderiyoruz */}
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
