"use client"

import TopBar from "@/components/layout/TopBar"
import MainHeader from "@/components/layout/MainHeader"

export default function SiteHeader() {
  return (
    <header className="w-full">
      {/* Üst Bar - iletişim ve sosyal medya */}
      <TopBar />

      {/* Ana Header - Logo, arama, garaj/giriş, menü */}
      <MainHeader />
    </header>
  )
}
