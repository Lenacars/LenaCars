"use client"

import Link from "next/link"
import Image from "next/image"
import { LayoutGrid, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function MainHeader() {
  return (
    <div className="container mx-auto py-4 px-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/lenacars-logo.svg"
            alt="LenaCars Logo"
            width={160}
            height={50}
            className="mr-2"
            priority
          />
        </Link>

        {/* Arama Alanı */}
        <div className="hidden md:flex items-center space-x-2 w-1/3">
          <Input
            type="search"
            placeholder="Araç Ara"
            className="rounded-l-md rounded-r-none"
          />
          <Button
            variant="default"
            className="bg-[#e67e22] hover:bg-[#d35400] rounded-l-none rounded-r-md"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Sağ Butonlar */}
        <div className="flex items-center space-x-2">
          <Link href="/garaj">
            <Button variant="outline" className="flex items-center">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Garaj
            </Button>
          </Link>
          <Link href="/giris">
            <Button
              variant="default"
              className="bg-[#9A3C96] hover:bg-[#7e327b] text-white"
            >
              Giriş Yap / Üye Ol
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

