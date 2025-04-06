import TopBarDesktop from "@/components/layout/TopBarDesktop"
import TopBarMobile from "@/components/layout/TopBarMobile"
import MainHeader from "@/components/layout/MainHeader"
import NavigationMenuDesktop from "@/components/layout/NavigationMenuDesktop"
import NavigationMenuMobile from "@/components/layout/NavigationMenuMobile"

export default function SiteHeader() {
  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="hidden md:block">
        <TopBarDesktop />
      </div>
      <div className="block md:hidden">
        <TopBarMobile />
      </div>

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
