"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItems = [
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
        { href: "/ikinci-el/karli-arac-satis", label: "Karlı Araç Satış Hizmeti" },
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

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-4">
            {menuItems.map((menu) => (
              <NavigationMenuItem key={menu.title}>
                <NavigationMenuTrigger>{menu.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4">
                    {menu.items.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} legacyBehavior passHref>
                          <NavigationMenuLink
                            className={cn(
                              "block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground"
                            )}
                          >
                            {item.label}
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}

            <NavigationMenuItem>
              <Link href="/elektrikli-araclar" legacyBehavior passHref>
                <NavigationMenuLink className="px-4 py-2 text-sm">Elektrikli Araçlar</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/basin-kosesi" legacyBehavior passHref>
                <NavigationMenuLink className="px-4 py-2 text-sm">Basın Köşesi</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/sss" legacyBehavior passHref>
                <NavigationMenuLink className="px-4 py-2 text-sm">S.S.S.</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/nasil-calisir" legacyBehavior passHref>
                <NavigationMenuLink className="px-4 py-2 text-sm">Nasıl Çalışır</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-6">
                {menuItems.map((menu) => (
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
