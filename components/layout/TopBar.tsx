"use client"

import Link from "next/link"
import { MapPin, Mail, Phone, Facebook, Instagram, Linkedin, Youtube } from "lucide-react"

export default function TopBar() {
  return (
    <div className="w-full bg-[#6A3C96] text-white text-sm py-2">
      <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center">
        
        {/* Sol: İletişim ikonları */}
        <div className="flex items-center space-x-4">
          <a href="https://goo.gl/maps/xyz" target="_blank" rel="noopener noreferrer">
            <MapPin className="w-4 h-4" />
          </a>
          <a href="mailto:info@lenacars.com">
            <Mail className="w-4 h-4" />
          </a>
          <a href="tel:+908505327929">
            <Phone className="w-4 h-4" />
          </a>
        </div>

        {/* Orta: Slogan */}
        <div className="hidden md:block text-center flex-1 text-white font-medium text-sm">
          Yüzlerce Araç Tek Ekranda Seç Beğen Güvenle Kirala
        </div>

        {/* Sağ: Sosyal Medya */}
        <div className="flex items-center space-x-3">
          <Link href="https://facebook.com" aria-label="Facebook"><Facebook className="w-4 h-4" /></Link>
          <Link href="https://instagram.com" aria-label="Instagram"><Instagram className="w-4 h-4" /></Link>
          <Link href="https://linkedin.com" aria-label="LinkedIn"><Linkedin className="w-4 h-4" /></Link>
          <Link href="https://youtube.com" aria-label="YouTube"><Youtube className="w-4 h-4" /></Link>
        </div>
      </div>
    </div>
  )
}
