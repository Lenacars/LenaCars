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

<NavigationMenuList>
  {/* Kurumsal */}
  <NavigationMenuItem>
    <NavigationMenuTrigger>Kurumsal</NavigationMenuTrigger>
    <NavigationMenuContent>
      <ul className="grid w-[400px] gap-3 p-4">
        <li>
          <Link href="/kurumsal/hakkimizda" className="block p-3 rounded-md hover:bg-accent">
            <div className="text-sm font-medium">Hakkımızda</div>
          </Link>
        </li>
        <li>
          <Link href="/kurumsal/liderlik-ekibimiz" className="block p-3 rounded-md hover:bg-accent">
            <div className="text-sm font-medium">Liderlik Ekibimiz</div>
          </Link>
        </li>
        <li>
          <Link href="/kurumsal/odullerimiz" className="block p-3 rounded-md hover:bg-accent">
            <div className="text-sm font-medium">Ödüllerimiz</div>
          </Link>
        </li>
        <li>
          <Link href="/kurumsal/insan-kaynaklari" className="block p-3 rounded-md hover:bg-accent">
            <div className="text-sm font-medium">İnsan Kaynakları</div>
          </Link>
        </li>
      </ul>
    </NavigationMenuContent>
  </NavigationMenuItem>

  {/* Kiralama */}
  <NavigationMenuItem>
    <NavigationMenuTrigger>Kiralama</NavigationMenuTrigger>
    <NavigationMenuContent>
      <ul className="grid w-[400px] gap-3 p-4">
        <li>
          <Link href="/kisa-sureli-kiralama" className="block p-3 rounded-md hover:bg-accent">
            <div className="text-sm font-medium">Kısa Süreli Kiralama</div>
          </Link>
        </li>
        <li>
          <Link href="/kiralamanin-avantajlari" className="block p-3 rounded-md hover:bg-accent">
            <div className="text-sm font-medium">Kiralamanın Avantajları</div>
          </Link>
        </li>
        <li>
          <Link href="/kurumsal-uyelik-programi" className="block p-3 rounded-md hover:bg-accent">
            <div className="text-sm font-medium">Kurumsal Üyelik Programı</div>
          </Link>
        </li>
        <li>
          <Link href="/lenacars-avantajlari" className="block p-3 rounded-md hover:bg-accent">
            <div className="text-sm font-medium">LenaCars Avantajları</div>
          </Link>
        </li>
        <li>
          <Link href="/tasarrufunu-hesapla" className="block p-3 rounded-md hover:bg-accent">
            <div className="text-sm font-medium">Tasarrufunu Hesapla</div>
          </Link>
        </li>
      </ul>
    </NavigationMenuContent>
  </NavigationMenuItem>

  {/* İkinci El */}
  <NavigationMenuItem>
    <NavigationMenuTrigger>İkinci El</NavigationMenuTrigger>
    <NavigationMenuContent>
      <ul className="grid w-[400px] gap-3 p-4">
        <li>
          <Link href="/ikinci-el/satilik-araclarimiz" className="block p-3 rounded-md hover:bg-accent">
            <div className="text-sm font-medium">Satılık Araçlarımız</div>
          </Link>
        </li>
        <li>
          <Link href="/ikinci-el/karli-arac-satis-hizmeti" className="block p-3 rounded-md hover:bg-accent">
            <div className="text-sm font-medium">Karlı Araç Satış Hizmeti</div>
          </Link>
        </li>
        <li>
          <Link href="/ikinci-el/tasit-kredisi" className="block p-3 rounded-md hover:bg-accent">
            <div className="text-sm font-medium">Taşıt Kredisi</div>
          </Link>
        </li>
      </ul>
    </NavigationMenuContent>
  </NavigationMenuItem>

  {/* Elektrikli Araçlar */}
  <NavigationMenuItem>
    <Link href="/elektrikli-araclar" legacyBehavior passHref>
      <NavigationMenuLink className={cn("inline-flex h-10 px-4 py-2 text-sm font-medium hover:text-accent-foreground")}>
        Elektrikli Araçlar
      </NavigationMenuLink>
    </Link>
  </NavigationMenuItem>

  {/* Basın Köşesi */}
  <NavigationMenuItem>
    <Link href="/basin-kosesi" legacyBehavior passHref>
      <NavigationMenuLink className={cn("inline-flex h-10 px-4 py-2 text-sm font-medium hover:text-accent-foreground")}>
        Basın Köşesi
      </NavigationMenuLink>
    </Link>
  </NavigationMenuItem>

  {/* LenaCars Bilgilendiriyor */}
  <NavigationMenuItem>
    <NavigationMenuTrigger>LenaCars Bilgilendiriyor</NavigationMenuTrigger>
    <NavigationMenuContent>
      <ul className="grid w-[300px] gap-3 p-4">
        <li>
          <Link href="/bilgilendiriyor/blog" className="block p-3 rounded-md hover:bg-accent">
            <div className="text-sm font-medium">Blog</div>
          </Link>
        </li>
        <li>
          <Link href="/bilgilendiriyor/vlog" className="block p-3 rounded-md hover:bg-accent">
            <div className="text-sm font-medium">Vlog</div>
          </Link>
        </li>
      </ul>
    </NavigationMenuContent>
  </NavigationMenuItem>

  {/* S.S.S */}
  <NavigationMenuItem>
    <Link href="/sss" legacyBehavior passHref>
      <NavigationMenuLink className={cn("inline-flex h-10 px-4 py-2 text-sm font-medium hover:text-accent-foreground")}>
        S.S.S.
      </NavigationMenuLink>
    </Link>
  </NavigationMenuItem>

  {/* Nasıl Çalışır */}
  <NavigationMenuItem>
    <Link href="/nasil-calisir" legacyBehavior passHref>
      <NavigationMenuLink className={cn("inline-flex h-10 px-4 py-2 text-sm font-medium hover:text-accent-foreground")}>
        Nasıl Çalışır
      </NavigationMenuLink>
    </Link>
  </NavigationMenuItem>
</NavigationMenuList>


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
