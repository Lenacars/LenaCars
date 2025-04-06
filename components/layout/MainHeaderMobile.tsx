"use client"

import Image from "next/image"
import Link from "next/link"
import { LayoutGrid, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import NavigationMenuComponent from "./NavigationMenu"

export default function MainHeaderMobile() {
  return (
    <div className="flex md:hidden justify-between items-center w-full py-3 px-4">
      {/* Sol - Menü butonu ve Logo */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
        <Link href="/">
          <Image src="/lenacars-logo.svg" alt="LenaCars" width={120} height={30} />
        </Link>
      </div>

      {/* Sağ - Garaj ve Giriş */}
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" className="border-[#6A3C96] text-[#6A3C96]">
          <LayoutGrid className="w-4 h-4" />
        </Button>
        <Button className="bg-[#6A3C96] text-white px-3 py-1 rounded-md text-sm">
          Lena Cars
        </Button>
      </div>
    </div>
  )
}
