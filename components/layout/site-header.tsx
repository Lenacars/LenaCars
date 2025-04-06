"use client"

import TopBar from "@/components/layout/TopBar"
import MainHeader from "@/components/layout/MainHeader"
import NavigationMenuDesktop from "@/components/layout/NavigationMenuDesktop"

export default function SiteHeader() {
  return (
    <header className="w-full">
      <TopBar />
      <MainHeader />
      <NavigationMenuDesktop />
    </header>
  )
}
