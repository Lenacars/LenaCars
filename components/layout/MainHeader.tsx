"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Search, LayoutGrid, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import NavigationMenuComponent from "./NavigationMenu"

export default function MainHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="w-full bg-white py-4 border-b">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/lenacars-logo.svg" alt="LenaCars" width={150} height={40} priority />
        </Link>

        {/* Arama + Butonlar */}
        <div className="hidden md:flex items-center space-x-4 w-1/3">
          <Input type="search" placeholder="Araç Ara" className="rounded-l-md rounded-r-none" />
          <Button className="bg-[#6A3C96] hover:bg-[#7f2d7c] rounded-l-none rounded-r-md">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Sağ Butonlar */}
        <div className="hidden md:flex items-center space-x-2">
          <Link href="/garaj">
            <Button variant="outline" className="flex items-center">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Garaj
            </Button>
          </Link>
          <Link href="/giris">
            <Button className="bg-[#6A3C96] hover:bg-[#7f2d7c]">
              Giriş Yap / Üye Ol
            </Button>
          </Link>
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
              <NavigationMenuComponent />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
