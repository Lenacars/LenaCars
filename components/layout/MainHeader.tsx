"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, LayoutGrid, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet"
import NavigationMenuComponent from "./NavigationMenu"

export default function MainHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="w-full bg-white py-4 border-b">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/lenacars-logo.svg"
            alt="LenaCars"
            width={160}
            height={50}
            priority
          />
        </Link>

        {/* Arama + Butonlar */}
        <div className="hidden md:flex items-center space-x-4 w-1/2 justify-end">
          {/* Arama kutusu ve buton */}
          <div className="flex items-center rounded-md overflow-hidden border border-[#6A3C96] w-full max-w-md">
            <Input
              type="search"
              placeholder="Araç Ara"
              className="rounded-none border-none focus:outline-none focus:ring-0 w-full"
            />
            <Button className="bg-[#e67e22] text-white rounded-none px-4">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Garaj ve Giriş Butonları */}
          <Link href="/garaj">
            <Button variant="outline" className="flex items-center">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Garaj
            </Button>
          </Link>
          <Link href="/giris">
            <Button className="bg-[#6A3C96] text-white">
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
