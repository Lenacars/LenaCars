"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Facebook, Instagram, Linkedin, Youtube, MapPin, Mail, Phone, Menu, LayoutGrid } from "lucide-react"
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
      <div className="w-full bg-[#5d3b8b] text-white py-2">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center space-x-4">
            <MapPin className="h-4 w-4" />
            <Mail className="h-4 w-4" />
            <Phone className="h-4 w-4" />
          </div>
          <p className="hidden md:block text-sm">Yüzlerce Araç Tek Ekranda Seç Beğen Güvenle Kirala</p>
          <div className="flex items-center space-x-2">
            <Link href="https://facebook.com"><Facebook className="h-4 w-4" /></Link>
            <Link href="https://instagram.com"><Instagram className="h-4 w-4" /></Link>
            <Link href="https://linkedin.com"><Linkedin className="h-4 w-4" /></Link>
            <Link href="https://youtube.com"><Youtube className="h-4 w-4" /></Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-4 px-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <Image src="/lenacars-logo.svg" alt="LenaCars Logo" width={160} height={50} priority />
          </Link>

          <div className="hidden md:flex items-center space-x-2 w-1/3">
            <Input type="search" placeholder="Araç Ara" className="rounded-l-md rounded-r-none" />
            <Button className="bg-[#e67e22] hover:bg-[#d35400] rounded-l-none rounded-r-md">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Link href="/garaj">
              <Button variant="outline"><LayoutGrid className="h-4 w-4 mr-2" /> Garaj</Button>
            </Link>
            <Link href="/giris">
              <Button className="bg-[#5d3b8b] hover:bg-[#4a2e70]">Giriş Yap / Üye Ol</Button>
            </Link>
          </div>
        </div>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Kurumsal</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4">
                  {[
                    { href: "/kurumsal/hakkimizda", label: "Hakkımızda" },
                    { href: "/kurumsal/liderlik-ekibimiz", label: "Liderlik Ekibimiz" },
                    { href: "/kurumsal/odullerimiz", label: "Ödüllerimiz" },
                    { href: "/kurumsal/insan-kaynaklari", label: "İnsan Kaynakları" },
                  ].map(({ href, label }) => (
                    <li key={href}>
                      <Link href={href} className="block rounded-md p-3 hover:bg-accent">{label}</Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Kiralama</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4">
                  <li><Link href="/uzun-donem-kiralama" className="block p-3 hover:bg-accent">Uzun Dönem</Link></li>
                  <li><Link href="/kisa-donem-kiralama" className="block p-3 hover:bg-accent">Kısa Dönem</Link></li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/ikinci-el-araclar" passHref legacyBehavior>
                <NavigationMenuLink className="px-4 py-2 hover:bg-accent">İkinci El</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/elektrikli-araclar" passHref legacyBehavior>
                <NavigationMenuLink className="px-4 py-2 hover:bg-accent">Elektrikli Araçlar</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/nasil-calisir" passHref legacyBehavior>
                <NavigationMenuLink className="px-4 py-2 hover:bg-accent">Nasıl Çalışır</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}

