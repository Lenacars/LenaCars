import TopBar from "@/components/layout/TopBar"
import MainHeader from "@/components/layout/MainHeader"
import NavigationMenuDesktop from "@/components/layout/NavigationMenuDesktop"
import NavigationMenuMobile from "@/components/layout/NavigationMenuMobile"

export default function SiteHeader() {
  return (
    <header className="w-full">
      {/* Top Bar */}
      <TopBar />

      {/* Main Header */}
      <MainHeader />

      {/* Navigation */}
      <div className="hidden md:block">
        <NavigationMenuDesktop />
      </div>
      <div className="block md:hidden">
        <NavigationMenuMobile />
      </div>
    </header>
  )
}
