"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Facebook, Instagram, Linkedin, Youtube, MapPin, Mail, Phone } from "lucide-react"
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
              <Image
                src="/placeholder.svg?height=50&width=150"
                alt="LenaCars Logo"
                width={150}
                height={50}
                className="mr-2"
              />
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M3 3h18v18H3z" />
                  <path d="M3 9h18" />
                  <path d="M15 3v6" />
                </svg>
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

        {/* Navigation Menu */}
        <div className="hidden md:flex mt-4 border-t border-b py-2">
          <NavigationMenu className="mx-auto">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Kurumsal</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/hakkimizda"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">Hakkımızda</div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            LenaCars kurumsal araç kiralama çözümleri hakkında bilgi alın.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <Link
                        href="/vizyon-misyon"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Vizyon & Misyon</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Vizyonumuz ve misyonumuz hakkında bilgi alın.
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/ekibimiz"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Ekibimiz</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Uzman ekibimizle tanışın.
                        </p>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
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
              <NavigationMenuItem>
                <Link href="/elektrikli-araclar" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
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
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
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
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
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
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
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
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <Link href="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                  <Image
                    src="/placeholder.svg?height=50&width=150"
                    alt="LenaCars Logo"
                    width={150}
                    height={50}
                    className="mr-2"
                  />
                </Link>
                <div className="flex items-center space-x-2 w-full">
                  <Input type="search" placeholder="Araç Ara" className="rounded-l-md rounded-r-none" />
                  <Button variant="default" className="bg-[#e67e22] hover:bg-[#d35400] rounded-l-none rounded-r-md">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <Link href="/kurumsal" className="py-2 border-b" onClick={() => setIsMenuOpen(false)}>
                  Kurumsal
                </Link>
                <Link href="/kiralama" className="py-2 border-b" onClick={() => setIsMenuOpen(false)}>
                  Kiralama
                </Link>
                <Link href="/ikinci-el" className="py-2 border-b" onClick={() => setIsMenuOpen(false)}>
                  İkinci El
                </Link>
                <Link href="/elektrikli-araclar" className="py-2 border-b" onClick={() => setIsMenuOpen(false)}>
                  Elektrikli Araçlar
                </Link>
                <Link href="/basin-kosesi" className="py-2 border-b" onClick={() => setIsMenuOpen(false)}>
                  Basın Köşesi
                </Link>
                <Link href="/bilgilendiriyor" className="py-2 border-b" onClick={() => setIsMenuOpen(false)}>
                  LenaCars Bilgilendiriyor
                </Link>
                <Link href="/sss" className="py-2 border-b" onClick={() => setIsMenuOpen(false)}>
                  S.S.S.
                </Link>
                <Link href="/nasil-calisir" className="py-2 border-b" onClick={() => setIsMenuOpen(false)}>
                  Nasıl Çalışır
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
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

