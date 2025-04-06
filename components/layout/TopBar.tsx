"use client"

import TopBarDesktop from "./TopBarDesktop"
import TopBarMobile from "./TopBarMobile"

export default function TopBar() {
  return (
    <div className="w-full">
      {/* Masaüstü için */}
      <div className="hidden md:block">
        <TopBarDesktop />
      </div>
      {/* Mobil için */}
      <div className="block md:hidden">
        <TopBarMobile />
      </div>
    </div>
  )
}
