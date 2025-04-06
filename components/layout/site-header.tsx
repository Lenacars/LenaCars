import TopBarDesktop from "@/components/layout/TopBarDesktop"
import TopBarMobile from "@/components/layout/TopBarMobile"
import MainHeader from "@/components/layout/MainHeader"
import NavigationMenu from "@/components/layout/NavigationMenu"
import NavigationMenuMobile from "@/components/layout/NavigationMenuMobile"

export default function SiteHeader() {
  return (
    <header className="w-full">
      <TopBar />
      <MainHeader />
      {/* Navigation Menüler */}
      <div className="hidden md:block">
        <NavigationMenu />
      </div>
      <div className="md:hidden flex justify-end px-4 py-2">
        <NavigationMenuMobile />
      </div>
    </header>
  )
}
