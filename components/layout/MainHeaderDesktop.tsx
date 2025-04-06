"use client"

import Image from "next/image"
import { Search, LayoutGrid } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function MainHeaderDesktop() {
  return (
    <div className="hidden md:flex justify-between items-center w-full py-4 container mx-auto">
      {/* Logo */}
      <a href="/">
        <Image src="/lenacars-logo.svg" alt="LenaCars" width={180} height={40} priority />
      </a>

      {/* Arama Kutusu */}
      <div className="flex items-center w-1/2 rounded-md overflow-hidden border border-[#6A3C96]">
        <Input
          type="search"
          placeholder="Araç Ara"
          className="rounded-none border-none focus:outline-none focus:ring-0 w-full"
        />
        <Button className="bg-[#e67e22] text-white rounded-none px-4">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Butonlar */}
      <div className="flex items-center space-x-3">
        <Button variant="outline" className="flex items-center gap-2 px-4 py-2 border-[#6A3C96] text-[#6A3C96]">
          <LayoutGrid className="w-4 h-4" />
          Garaj
        </Button>
        
        {/* Doğrudan anchor etiketi kullanın */}
        <a href="/auth" className="bg-[#6A3C96] text-white px-4 py-2 rounded-md inline-flex items-center justify-center">
          Giriş Yap / Üye Ol
        </a>
      </div>
    </div>
  )
}
