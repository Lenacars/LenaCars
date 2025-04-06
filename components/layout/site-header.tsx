import TopBarDesktop from "@/components/layout/TopBarDesktop"
import TopBarMobile from "@/components/layout/TopBarMobile"
import MainHeaderDesktop from "@/components/layout/MainHeaderDesktop"
import MainHeaderMobile from "@/components/layout/MainHeaderMobile"
import NavigationMenuDesktop from "@/components/layout/NavigationMenuDesktop"
import NavigationMenuMobile from "@/components/layout/NavigationMenuMobile"

export default function SiteHeader() {
  return (
    <header className="w-full">
      {/* TopBar */}
      <div className="hidden md:block">
        <TopBarDesktop />
      </div>
      <div className="block md:hidden">
        <TopBarMobile />
      </div>

      {/* MainHeader */}
      <div className="hidden md:block">
        <MainHeaderDesktop />
      </div>
      <div className="block md:hidden">
        <MainHeaderMobile />
      </div>

      {/* NavigationMenu */}
      <div className="hidden md:block">
        <NavigationMenuDesktop />
      </div>
      <div className="block md:hidden">
        <NavigationMenuMobile />
      </div>
    </header>
  )
}
