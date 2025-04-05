"use client"

import TopBar from "./topbar"
import MainHeader from "./mainheader"
import NavigationMenu from "./navigationmenu"

export default function SiteHeader() {
  return (
    <header className="w-full">
      <TopBar />
      <MainHeader />
      <NavigationMenu />
    </header>
  )
}
