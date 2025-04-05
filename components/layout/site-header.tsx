import TopBar from "@/components/layout/TopBar"
import MainHeader from "@/components/MainHeader"
import NavigationMenu from "@/components/layout/NavigationMenu"

export default function SiteHeader() {
  return (
    <header className="w-full">
      <TopBar />
      <MainHeader />
      <NavigationMenu />
    </header>
  )
}
