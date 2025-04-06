"use client"

import TopBar from "@/components/layout/TopBar"
import MainHeader from "@/components/layout/MainHeader"
import NavigationMenuComponent from "@/components/layout/NavigationMenuComponent"

export default function SiteHeader() {
  return (
    <header className="w-full">
      <TopBar />
      <MainHeader />
      <NavigationMenuComponent />
    </header>
  )
}
