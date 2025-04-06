"use client"

import TopBar from "@/components/layout/TopBar"
import MainHeader from "@/components/layout/MainHeader"
import NavigationMenuDesktop from "@/components/layout/NavigationMenuDesktop"
import NavigationMenuMobile from "@/components/layout/NavigationMenuMobile"

export default function SiteHeader() {
  return (
    <header>
      <TopBar />
      <MainHeader />
      <NavigationMenuDesktop />
      <div className="md:hidden">
        <NavigationMenuMobile />
      </div>
    </header>
  )
}
