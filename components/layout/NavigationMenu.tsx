"use client"

import Link from "next/link"
import { useState } from "react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    title: "Kurumsal",
    items: [
      { label: "Hakkımızda", href: "/kurumsal/hakkimizda" },
      { label: "Liderlik Ekibimiz", href: "/kurumsal/liderlik-ekibimiz" },
      { label: "Ödüllerimiz", href: "/kurumsal/odullerimiz" },
      { label: "İnsan Kaynakları", href: "/kurumsal/insan-kaynaklari" },
    ],
  },
  {
    title: "Kiralama",
    items: [
      { label: "Kısa Süreli Kiralama", href: "/kiralama/kisa-sureli-kiralama" },
      { label: "Kiralamanın Avantajları", href: "/kiralama/kiralamanin-avantajlari" },
      { label: "Kurumsal Üyelik Programı", href: "/kiralama/kurumsal-uyelik-programi" },
      { label: "LenaCars Avantajları", href: "/kiralama/lenacars-avantajlari" },
      { label: "Tasarrufunu Hesapla", href: "/kiralama/tasarrufunu-hesapla" },
    ],
  },
  {
    title: "İkinci El",
    items: [
      { label: "Satılık Araçlarımız", href: "/ikinci-el/satilik-araclarimiz" },
      { label: "Karlı Araç Satış Hizmeti", href: "/ikinci-el/karli-arac-satis-hizmeti" },
      { label: "Taşıt Kredisi", href: "/ikinci-el/tasit-kredisi" },
    ],
  },
  {
    title: "LenaCars Bilgilendiriyor",
    items: [
      { label: "Blog", href: "/bilgilendiriyor/blog" },
      { label: "Vlog", href: "/bilgilendiriyor/vlog" },
    ],
  },
]

export default function NavigationMenuComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full border-t md:border-none">
      {/* Masaüstü Menüsü */}
      <div className="hidden md:flex justify-center">
        <NavigationMenu>
          <NavigationMenuList className="space-x-6">
            {menuItems.map((menu) => (
              <NavigationMenuItem key={menu.title}>
                {menu.items ? (
                  <>
                    <NavigationMenuTrigger>{menu.title}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[300px] gap-3 p-4">
                        {menu.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className="block p-2 rounded hover:bg-accent text-sm font-medium"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <Link href={menu.title}>
                    <NavigationMenuLink className="px-4 py-2">
                      {menu.title}
                    </NavigationMenuLink>
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <Link href="/elektrikli-araclar" passHref>
                <NavigationMenuLink className="px-4 py-2">Elektrikli Araçlar</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/basin-kosesi" passHref>
                <NavigationMenuLink className="px-4 py-2">Basın Köşesi</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/sss" passHref>
                <NavigationMenuLink className="px-4 py-2">S.S.S.</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/nasil-calisir" passHref>
                <NavigationMenuLink className="px-4 py-2">Nasıl Çalışır</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mobil Menü */}
      <div className="md:hidden px-4 py-2 flex justify-between items-center">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[260px] sm:w-[300px] p-4">
            <nav className="flex flex-col gap-4">
              {menuItems.map((menu) => (
                <div key={menu.title}>
                  <p className="font-bold text-sm mb-1">{menu.title}</p>
                  <ul className="pl-2 space-y-1">
                    {menu.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <Link href="/elektrikli-araclar" onClick={() => setIsOpen(false)}>Elektrikli Araçlar</Link>
              <Link href="/basin-kosesi" onClick={() => setIsOpen(false)}>Basın Köşesi</Link>
              <Link href="/sss" onClick={() => setIsOpen(false)}>S.S.S.</Link>
              <Link href="/nasil-calisir" onClick={() => setIsOpen(false)}>Nasıl Çalışır</Link>
            </nav>
          </SheetContent>
        </Sheet>
        <span className="text-lg font-semibold">Menü</span>
      </div>
    </div>
  )
}
