import TopBarDesktop from "@/components/layout/TopBarDesktop"
import TopBarMobile from "@/components/layout/TopBarMobile"
import MainHeaderDesktop from "@/components/layout/MainHeaderDesktop"
import MainHeaderMobile from "@/components/layout/MainHeaderMobile"
import NavigationMenuDesktop from "@/components/layout/NavigationMenuDesktop"
import NavigationMenuMobile from "@/components/layout/NavigationMenuMobile"

export default function SiteHeader() {
  return (
    <header className="w-full">
      <div className="hidden md:block">
        <TopBarDesktop />
        <MainHeaderDesktop />
        <NavigationMenuDesktop />
      </div>
      <div className="block md:hidden">
        <TopBarMobile />
        <MainHeaderMobile />
        <NavigationMenuMobile />
      </div>
    </header>
  )
}
