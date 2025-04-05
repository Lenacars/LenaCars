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
          <div className="flex items-center space-x-4">
            <MapPin className="h-4 w-4" />
            <Mail className="h-4 w-4" />
            <Phone className="h-4 w-4" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm">Yüzlerce Araç Tek Ekranda Seç Beğen Güvenle Kirala</p>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="https://facebook.com"><Facebook className="h-4 w-4" /></Link>
            <Link href="https://instagram.com"><Instagram className="h-4 w-4" /></Link>
            <Link href="https://linkedin.com"><Linkedin className="h-4 w-4" /></Link>
            <Link href="https://youtube.com"><Youtube className="h-4 w-4" /></Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto py-4 px-4">
        <div className="flex justify-between items-center">
          <Link href="/"><Image src="/lenacars-logo.svg" alt="LenaCars Logo" width={160} height={50} priority /></Link>
          <div className="hidden md:flex items-center space-x-2 w-1/3">
            <Input type="search" placeholder="Araç Ara" className="rounded-l-md rounded-r-none" />
            <Button className="bg-[#e67e22] hover:bg-[#d35400] rounded-l-none rounded-r-md">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/garaj"><Button variant="outline"><LayoutGrid className="h-4 w-4 mr-2" />Garaj</Button></Link>
            <Link href="/giris"><Button className="bg-[#5d3b8b] hover:bg-[#4a2e70]">Giriş Yap / Üye Ol</Button></Link>
          </div>
        </div>

        {/* Navigation Menu */}
        <NavigationMenu>
          <NavigationMenuList>
            {/* Kurumsal */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Kurumsal</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[400px]">
                  <li><Link href="/kurumsal/hakkimizda">Hakkımızda</Link></li>
                  <li><Link href="/kurumsal/liderlik-ekibimiz">Liderlik Ekibimiz</Link></li>
                  <li><Link href="/kurumsal/odullerimiz">Ödüllerimiz</Link></li>
                  <li><Link href="/kurumsal/insan-kaynaklari">İnsan Kaynakları</Link></li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Kiralama */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Kiralama</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[400px]">
                  <li><Link href="/kiralama/kisa-sureli-kiralama">Kısa Süreli Kiralama</Link></li>
                  <li><Link href="/kiralama/kiralamanin-avantajlari">Kiralamanın Avantajları</Link></li>
                  <li><Link href="/kiralama/kurumsal-uyelik-programi">Kurumsal Üyelik Programı</Link></li>
                  <li><Link href="/kiralama/lenacars-avantajlari">LenaCars Avantajları</Link></li>
                  <li><Link href="/kiralama/tasarrufunu-hesapla">Tasarrufunu Hesapla</Link></li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* İkinci El */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>İkinci El</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[400px]">
                  <li><Link href="/ikinci-el/satilik-araclarimiz">Satılık Araçlarımız</Link></li>
                  <li><Link href="/ikinci-el/karli-arac-satis-hizmeti">Karlı Araç Satış Hizmeti</Link></li>
                  <li><Link href="/ikinci-el/tasit-kredisi">Taşıt Kredisi</Link></li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem><Link href="/elektrikli-araclar"><NavigationMenuLink>Elektrikli Araçlar</NavigationMenuLink></Link></NavigationMenuItem>
            <NavigationMenuItem><Link href="/basin-kosesi"><NavigationMenuLink>Basın Köşesi</NavigationMenuLink></Link></NavigationMenuItem>

            {/* LenaCars Bilgilendiriyor */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>LenaCars Bilgilendiriyor</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[400px]">
                  <li><Link href="/bilgilendiriyor/blog">Blog</Link></li>
                  <li><Link href="/bilgilendiriyor/vlog">Vlog</Link></li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem><Link href="/sss"><NavigationMenuLink>S.S.S</NavigationMenuLink></Link></NavigationMenuItem>
            <NavigationMenuItem><Link href="/nasil-calisir"><NavigationMenuLink>Nasıl Çalışır</NavigationMenuLink></Link></NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Menu (Aynı yapı mobilde Sheet içinde kullanılabilir) */}
      </div>
    </header>
  )
}
