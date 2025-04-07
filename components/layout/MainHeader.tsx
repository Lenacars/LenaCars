"use client"

import TopBar from "@/components/layout/TopBar"
import TopBarMobile from "@/components/layout/TopBarMobile"
import MainHeaderDesktop from "@/components/layout/MainHeaderDesktop"
import MainHeaderMobile from "@/components/layout/MainHeaderMobile"
import NavigationMenuDesktop from "@/components/layout/NavigationMenuDesktop"
import NavigationMenuMobile from "@/components/layout/NavigationMenuMobile"

export default function MainHeader() {
  return (
    <>
      {/* Masaüstü */}
      <div className="hidden md:block">
        <TopBar />
        <MainHeaderDesktop />
        <NavigationMenuDesktop />
      </div>

      {/* Mobil */}
      <div className="block md:hidden">
        <TopBarMobile />
        <MainHeaderMobile />
        <NavigationMenuMobile />
      </div>
    </>
  )
}
