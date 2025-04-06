"use client"

import TopBarDesktop from "./TopBarDesktop"
import TopBarMobile from "./TopBarMobile"

export default function TopBar() {
  return (
    <div className="w-full">
      <div className="hidden md:block">
        <TopBarDesktop />
      </div>
      <div className="block md:hidden">
        <TopBarMobile />
      </div>
    </div>
  )
}
