"use client"

<<<<<<< HEAD
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function SiteHeader() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="bg-white py-4 px-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo ve Slogan */}
        <Link href="/" className="flex-shrink-0 flex items-center">
          <div className="relative">
            <Image
              src="/LENACARS.svg"
              alt="LenaCars Logo"
              width={150}
              height={50}
              className="h-10 w-auto"
              onError={(e) => {
                // SVG yüklenemezse PNG'ye geç
                const target = e.target as HTMLImageElement
                if (!target.src.includes(".png")) {
                  target.src = "/LENACARS.png"
                }
              }}
            />
            <p className="text-xs text-gray-600 mt-1">Otomobilde Güvenli Rotanız</p>
          </div>
        </Link>

        {/* Arama Kutusu - Ortalanmış */}
        <div className="flex-grow mx-4 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Araç Ara"
              className="w-full py-2 px-4 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#6A3C96] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="absolute right-0 top-0 h-full px-4 bg-[#E67E22] text-white rounded-r-md hover:bg-[#D35400] transition-colors"
              aria-label="Ara"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Garaj ve Giriş Butonları */}
        <div className="flex items-center space-x-3">
          <Link
            href="/garaj"
            className="border border-[#6A3C96] text-[#6A3C96] px-4 py-2 rounded-md flex items-center hover:bg-gray-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Garaj
          </Link>
          <Link
            href="/giris"
            className="bg-[#6A3C96] text-white px-4 py-2 rounded-md hover:bg-[#5a3080] transition-colors"
          >
            Giriş Yap / Üye Ol
          </Link>
        </div>
      </div>
    </div>
=======
import TopBar from "@/components/layout/TopBar"
import MainHeader from "@/components/layout/MainHeader"
import NavigationMenuDesktop from "@/components/layout/NavigationMenuDesktop"
import NavigationMenuMobile from "@/components/layout/NavigationMenuMobile"

export default function SiteHeader() {
  return (
    <header className="w-full">
      <TopBar />
      <MainHeader />
      <NavigationMenuDesktop />
      <NavigationMenuMobile />
    </header>
>>>>>>> cf3e86d5f4b21ff1e9fdd83fbd12e6f9796de7d3
  )
}
