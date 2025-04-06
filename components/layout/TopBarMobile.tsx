"use client"

import Link from "next/link"
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react"

export default function TopBarMobile() {
  return (
    <div className="flex md:hidden w-full bg-[#6A3C96] text-white py-2 px-4 justify-between items-center text-sm">
      <div className="text-xs">Araç Kirala</div>
      <div className="flex items-center space-x-3">
        <Link href="https://facebook.com"><Facebook className="h-4 w-4" /></Link>
        <Link href="https://instagram.com"><Instagram className="h-4 w-4" /></Link>
        <Link href="https://linkedin.com"><Linkedin className="h-4 w-4" /></Link>
        <Link href="https://youtube.com"><Youtube className="h-4 w-4" /></Link>
      </div>
    </div>
  )
}

