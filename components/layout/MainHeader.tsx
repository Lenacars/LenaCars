"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, LayoutGrid, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import NavigationMenuComponent from "./NavigationMenu"

export default function MainHeader() {
  return (
    <div className="w-full bg-white py-4 border-b">
      <div className="container mx-auto flex flex-wrap justify-between items-center px-4 gap-y-4">

        {/* Logo + Mobil Menü */}
        <div className="flex items-center space-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px]">
              <NavigationMenuComponent />
            </SheetContent>
          </Sheet>

          <Link href="/">
            <Image
              src="/lenacars-logo.svg"
              alt="LenaCars Logo"
              width={160}
              height={50}
              priority
            />
          </Link>
        </div>

        {/* Arama */}
        <div className="flex-grow max-w-xl w-full hidden md:flex items-center overflow-hidden rounded-md border border-[#6A3C96]">
          <Input
            type="search"
            placeholder="Araç Ara"
            className="border-none focus:outline-none focus:ring-0"
          />
          <Button className="bg-[#e67e22] text-white rounded-none px-4">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Butonlar */}
        <div className="flex items-center space-x-2 ml-auto">
          <Link href="/garaj">
            <Button variant="outline" className="flex items-center border-[#6A3C96] text-[#6A3C96]">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Garaj
            </Button>
          </Link>
          <Link href="/giris">
            <Button className="bg-[#6A3C96] hover:bg-[#5c3185] text-white">
              Giriş Yap / Üye Ol
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
