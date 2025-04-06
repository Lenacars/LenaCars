"use client"

import Link from "next/link"
import Image from "next/image"
import { LayoutGrid, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function MainHeader() {
  return (
    <div className="w-full border-b">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-4 gap-4">
        
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image src="/lenacars-logo.svg" alt="LenaCars Logo" width={160} height={40} priority />
        </Link>

        {/* Arama */}
        <div className="flex w-full md:w-1/2 items-center border border-[#6A3C96] rounded-md overflow-hidden">
          <Input
            type="search"
            placeholder="Araç Ara"
            className="w-full border-none rounded-none focus:ring-0"
          />
          <Button className="bg-[#e67e22] text-white rounded-none px-4">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Butonlar */}
        <div className="flex gap-2">
          <Link href="/garaj">
            <Button variant="outline" className="flex items-center gap-2 border-[#6A3C96] text-[#6A3C96]">
              <LayoutGrid className="h-4 w-4" />
              Garaj
            </Button>
          </Link>
          <Link href="/giris">
            <Button className="bg-[#6A3C96] text-white hover:bg-[#6A3C96]">
              Giriş Yap / Üye Ol
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
