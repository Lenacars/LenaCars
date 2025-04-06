import TopBar from "@/components/layout/TopBar"
import MainHeader from "@/components/layout/MainHeader"
import NavigationMenu from "@/components/layout/NavigationMenu"

export default function SiteHeader() {
  return (
    <header className="w-full">
      <TopBar />
      <MainHeader />
      <div className="hidden md:block">
        <NavigationMenu />
      </div>
    </header>
  )
}
