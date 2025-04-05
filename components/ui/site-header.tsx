"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, LayoutGrid, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const mobileMenuItems = [
    {
      title: "Kurumsal",
      items: [
        { href: "/kurumsal/hakkimizda", label: "Hakkımızda" },
        { href: "/kurumsal/liderlik-ekibimiz", label: "Liderlik Ekibimiz" },
        { href: "/kurumsal/odullerimiz", label: "Ödüllerimiz" },
        { href: "/kurumsal/insan-kaynaklari", label: "İnsan Kaynakları" },
      ],
    },
    {
      title: "Kiralama",
      items: [
        { href: "/kiralama/kisa-sureli-kiralama", label: "Kısa Süreli Kiralama" },
        { href: "/kiralama/kiralamanin-avantajlari", label: "Kiralamanın Avantajları" },
        { href: "/kiralama/kurumsal-uyelik-programi", label: "Kurumsal Üyelik Programı" },
        { href: "/kiralama/lenacars-avantajlari", label: "LenaCars Avantajları" },
        { href: "/kiralama/tasarrufunu-hesapla", label: "Tasarrufunu Hesapla" },
      ],
    },
    {
      title: "İkinci El",
      items: [
        { href: "/ikinci-el/satilik-araclarimiz", label: "Satılık Araçlarımız" },
        { href: "/ikinci-el/karli-arac-satis-hizmeti", label: "Karlı Araç Satış Hizmeti" },
        { href: "/ikinci-el/tasit-kredisi", label: "Taşıt Kredisi" },
      ],
    },
    {
      title: "LenaCars Bilgilendiriyor",
      items: [
        { href: "/bilgilendiriyor/blog", label: "Blog" },
        { href: "/bilgilendiriyor/vlog", label: "Vlog" },
      ],
    },
  ]

  return (
    <header className="w-full border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <Image src="/lenacars-logo.svg" alt="LenaCars" width={150} height={40} priority />
        </Link>

        <div className="hidden md:flex space-x-8">
          <NavigationMenu>
            <NavigationMenuList>
              {/* Kurumsal */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Kurumsal</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4">
                    {mobileMenuItems[0].items.map(item => (
                      <li key={item.href}>
                        <Link href={item.href} className="block p-2 rounded hover:bg-accent text-sm font-medium">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Kiralama */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Kiralama</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4">
                    {mobileMenuItems[1].items.map(item => (
                      <li key={item.href}>
                        <Link href={item.href} className="block p-2 rounded hover:bg-accent text-sm font-medium">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* İkinci El */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>İkinci El</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4">
                    {mobileMenuItems[2].items.map(item => (
                      <li key={item.href}>
                        <Link href={item.href} className="block p-2 rounded hover:bg-accent text-sm font-medium">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Elektrikli Araçlar */}
              <NavigationMenuItem>
                <Link href="/elektrikli-araclar" legacyBehavior passHref>
                  <NavigationMenuLink className={cn("px-4 py-2 text-sm font-medium hover:text-accent-foreground")}>
                    Elektrikli Araçlar
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {/* Basın Köşesi */}
              <NavigationMenuItem>
                <Link href="/basin-kosesi" legacyBehavior passHref>
                  <NavigationMenuLink className={cn("px-4 py-2 text-sm font-medium hover:text-accent-foreground")}>
                    Basın Köşesi
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {/* LenaCars Bilgilendiriyor */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>LenaCars Bilgilendiriyor</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4">
                    {mobileMenuItems[3].items.map(item => (
                      <li key={item.href}>
                        <Link href={item.href} className="block p-2 rounded hover:bg-accent text-sm font-medium">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* SSS */}
              <NavigationMenuItem>
                <Link href="/sss" legacyBehavior passHref>
                  <NavigationMenuLink className={cn("px-4 py-2 text-sm font-medium hover:text-accent-foreground")}>
                    S.S.S.
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {/* Nasıl Çalışır */}
              <NavigationMenuItem>
                <Link href="/nasil-calisir" legacyBehavior passHref>
                  <NavigationMenuLink className={cn("px-4 py-2 text-sm font-medium hover:text-accent-foreground")}>
                    Nasıl Çalışır
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobil Menü */}
        <div className="md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-6">
                {mobileMenuItems.map((menu) => (
                  <div key={menu.title}>
                    <p className="font-semibold text-sm">{menu.title}</p>
                    <ul className="pl-2">
                      {menu.items.map((item) => (
                        <li key={item.href}>
                          <Link href={item.href} onClick={() => setIsMenuOpen(false)} className="text-sm block py-1">
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <Link href="/elektrikli-araclar" onClick={() => setIsMenuOpen(false)}>Elektrikli Araçlar</Link>
                <Link href="/basin-kosesi" onClick={() => setIsMenuOpen(false)}>Basın Köşesi</Link>
                <Link href="/sss" onClick={() => setIsMenuOpen(false)}>S.S.S.</Link>
                <Link href="/nasil-calisir" onClick={() => setIsMenuOpen(false)}>Nasıl Çalışır</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
