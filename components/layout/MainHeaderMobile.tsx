"use client"

import Image from "next/image"
import { Search, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function MainHeaderMobile() {
  // Doğrudan yönlendirme fonksiyonu
  const goToAuth = () => {
    window.location.href = '/auth'
  }

  return (
    <div className="flex flex-col w-full py-3 px-4">
      {/* Üst Kısım: Logo ve Menü */}
      <div className="flex justify-between items-center w-full mb-3">
        <a href="/">
          <Image src="/lenacars-logo.svg" alt="LenaCars" width={140} height={30} priority />
        </a>
        
        <div className="flex items-center space-x-2">
          {/* JavaScript ile yönlendirme */}
          <button 
            type="button"
            onClick={goToAuth} 
            className="bg-[#6A3C96] hover:bg-[#5A2C86] text-white px-3 py-1 text-sm rounded-md inline-flex items-center justify-center no-underline font-medium"
          >
            Giriş Yap / Üye Ol
          </button>
          
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
