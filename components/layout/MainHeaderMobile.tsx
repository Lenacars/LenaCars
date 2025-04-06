"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function MainHeaderMobile() {
  return (
    <div className="flex flex-col w-full py-3 px-4">
      {/* Üst Kısım: Logo ve Menü */}
      <div className="flex justify-between items-center w-full mb-3">
        <Link href="/">
          <Image src="/lenacars-logo.svg" alt="LenaCars" width={140} height={30} priority />
        </Link>
        
        <div className="flex items-center space-x-2">
          <Link href="/auth">
            <Button className="bg-[#6A3C96] text-white px-3 py-1 text-sm rounded-md">
              Giriş Yap / Üye Ol
            </Button>
          </Link>
          
          <Button variant="ghost" size="icon" className="text-[#6A3C96]">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      {/* Alt Kısım: Arama */}
      <div className="flex items-center w-full rounded-md overflow-hidden border border-[#6A3C96]">
        <Input
          type="search"
          placeholder="Araç Ara"
          className="rounded-none border-none focus:outline-none focus:ring-0 w-full text-sm h-9"
        />
        <Button className="bg-[#e67e22] text-white rounded-none px-3 h-9">
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
