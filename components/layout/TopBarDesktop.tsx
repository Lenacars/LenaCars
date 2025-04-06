"use client"

import Link from "next/link"
import { MapPin, Mail, Phone, Facebook, Instagram, Linkedin, Youtube } from "lucide-react"

export default function TopBarDesktop() {
  return (
    <div className="hidden md:flex w-full bg-[#6A3C96] text-white py-2 text-sm">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center space-x-4">
          <MapPin className="h-4 w-4" />
          <Mail className="h-4 w-4" />
          <Phone className="h-4 w-4" />
        </div>

        <p className="text-sm text-center w-full">Yüzlerce Araç Tek Ekranda Seç Beğen Güvenle Kirala</p>

        <div className="flex items-center space-x-3">
          <Link href="https://facebook.com"><Facebook className="h-4 w-4" /></Link>
          <Link href="https://instagram.com"><Instagram className="h-4 w-4" /></Link>
          <Link href="https://linkedin.com"><Linkedin className="h-4 w-4" /></Link>
          <Link href="https://youtube.com"><Youtube className="h-4 w-4" /></Link>
        </div>
      </div>
    </div>
  )
}

