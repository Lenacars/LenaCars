"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Facebook, Instagram, Linkedin, Youtube, MapPin, Mail, Phone, Menu, LayoutGrid } from 'lucide-react'
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

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="w-full bg-[#5d3b8b] text-white py-2">
        <div className="container mx-auto flex justify-between items-center px-4">

          {/* Sağdaki menü ya da iconlar */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="h-4 w-4" />
            </div>
            <div className="flex items-center space-x-1">
              <Phone className="h-4 w-4" />
            </div>
          </div>

          <div className="hidden md:block">
            <p className="text-sm">Yüzlerce Araç Tek Ekranda Seç Beğen Güvenle Kirala</p>
          </div>

          <div className="flex items-center space-x-2">
            <Link href="https://facebook.com" aria-label="Facebook">
              <Facebook className="h-4 w-4" />
            </Link>
            <Link href="https://instagram.com" aria-label="Instagram">
              <Instagram className="h-4 w-4" />
            </Link>
            <Link href="https://linkedin.com" aria-label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </Link>
            <Link href="https://youtube.com" aria-label="YouTube">
              <Youtube className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto py-4 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src="/lenacars-logo.svg" alt="LenaCars Logo" width={160} height={50} className="mr-2" priority />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-2 w-1/3">
            <Input type="search" placeholder="Araç Ara" className="rounded-l-md rounded-r-none" />
            <Button variant="default" className="bg-[#e67e22] hover:bg-[#d35400] rounded-l-none rounded-r-md">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Link href="/garaj">
              <Button variant="outline" className="flex items-center">
                <LayoutGrid className="h-4 w-4 mr-2" />
                Garaj
              </Button>
            </Link>
            <Link href="/giris">
              <Button variant="default" className="bg-[#5d3b8b] hover:bg-[#4a2e70]">
                Giriş Yap / Üye Ol
              </Button>
            </Link>
          </div>
        </div>

<NavigationMenuContent>
  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] lg:w-[600px]">
    <li>
      <Link
        href="/kurumsal/hakkimizda"
        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
      >
        <div className="text-sm font-medium leading-none">Hakkımızda</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          LenaCars'ın vizyonunu ve geçmişini keşfedin.
        </p>
      </Link>
    </li>
    <li>
      <Link
        href="/kurumsal/liderlik-ekibimiz"
        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
      >
        <div className="text-sm font-medium leading-none">Liderlik Ekibimiz</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          Deneyimli kadromuzla tanışın.
        </p>
      </Link>
    </li>
    <li>
      <Link
        href="/kurumsal/odullerimiz"
        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
      >
        <div className="text-sm font-medium leading-none">Ödüllerimiz</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          Kazandığımız ödülleri ve başarılarımızı inceleyin.
        </p>
      </Link>
    </li>
    <li>
      <Link
        href="/kurumsal/insan-kaynaklari"
        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
      >
        <div className="text-sm font-medium leading-none">İnsan Kaynakları</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          Kariyer fırsatlarımızı ve insan kaynakları vizyonumuzu keşfedin.
        </p>
      </Link>
    </li>
  </ul>
</NavigationMenuContent>
              {/* Kiralama */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Kiralama</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <li>
                      <Link
                        href="/uzun-donem-kiralama"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Uzun Dönem Kiralama</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Kurumsal uzun dönem araç kiralama çözümleri.
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/kisa-donem-kiralama"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Kısa Dönem Kiralama</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          İş ve özel seyahatleriniz için kısa dönem araç kiralama.
                        </p>
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
                      <Link
                        href="/ikinci-el-araclar"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">İkinci El Araçlar</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Bakımlı ikinci el araç seçenekleri.
                        </p>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Elektrikli Araçlar */}
              <NavigationMenuItem>
                <Link href="/elektrikli-araclar" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                    )}
                  >
                    Elektrikli Araçlar
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/basin-kosesi" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                    )}
                  >
                    Basın Köşesi
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/bilgilendiriyor" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                    )}
                  >
                    LenaCars Bilgilendiriyor
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/sss" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                    )}
                  >
                    S.S.S.
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/nasil-calisir" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                    )}
                  >
                    Nasıl Çalışır
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden mt-4 flex justify-between items-center">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
              
                <div className="flex items-center space-x-2 w-full">
                  <Input type="search" placeholder="Araç Ara" className="rounded-l-md rounded-r-none" />
                  <Button variant="default" className="bg-[#e67e22] hover:bg-[#d35400] rounded-l-none rounded-r-md">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                {/* Menü Linkleri */}
                {[
                  { href: "/kurumsal", label: "Kurumsal" },
                  { href: "/kiralama", label: "Kiralama" },
                  { href: "/ikinci-el", label: "İkinci El" },
                  { href: "/elektrikli-araclar", label: "Elektrikli Araçlar" },
                  { href: "/basin-kosesi", label: "Basın Köşesi" },
                  { href: "/bilgilendiriyor", label: "LenaCars Bilgilendiriyor" },
                  { href: "/sss", label: "S.S.S." },
                  { href: "/nasil-calisir", label: "Nasıl Çalışır" },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} className="py-2 border-b" onClick={() => setIsMenuOpen(false)}>
                    {label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Arama Alanı - Mobil */}
          <div className="flex items-center space-x-2">
            <div className="flex md:hidden items-center space-x-2 w-full">
              <Input type="search" placeholder="Araç Ara" className="w-32 rounded-l-md rounded-r-none" />
              <Button variant="default" className="bg-[#e67e22] hover:bg-[#d35400] rounded-l-none rounded-r-md">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
