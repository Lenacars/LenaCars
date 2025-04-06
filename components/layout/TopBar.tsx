"use client"

import Link from "next/link"
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react"

export default function TopBar() {
  return (
    <div className="w-full bg-[#6A3C96] text-white text-sm py-2">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-y-2 md:gap-y-0">
        {/* Sol Bilgiler */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>Merkez Ofis</span>
          </div>
          <div className="flex items-center space-x-1">
            <Mail className="h-4 w-4" />
            <a href="mailto:info@lenacars.com" className="hover:underline">info@lenacars.com</a>
          </div>
          <div className="flex items-center space-x-1">
            <Phone className="h-4 w-4" />
            <a href="tel:+908505327929" className="hover:underline">+90 850 532 7929</a>
          </div>
        </div>

        {/* Orta Metin */}
        <p className="hidden md:block text-center">Yüzlerce Araç Tek Ekranda Seç Beğen Güvenle Kirala</p>

        {/* Sosyal Medya */}
        <div className="flex items-center gap-2">
          <Link href="https://facebook.com"><Facebook className="h-4 w-4" /></Link>
          <Link href="https://instagram.com"><Instagram className="h-4 w-4" /></Link>
          <Link href="https://linkedin.com"><Linkedin className="h-4 w-4" /></Link>
          <Link href="https://youtube.com"><Youtube className="h-4 w-4" /></Link>
        </div>
      </div>
    </div>
  )
}
