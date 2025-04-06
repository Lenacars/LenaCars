// components/layout/TopBar.tsx

"use client"

import Link from "next/link"
import { MapPin, Mail, Phone, Facebook, Instagram, Linkedin, Youtube } from "lucide-react"

export default function TopBar() {
  return (
    <div className="w-full bg-[#6A3C96] text-white text-sm py-2">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
        
        {/* Sol Bilgiler */}
        <div className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-4 text-center md:text-left">
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

        {/* Ortadaki metin */}
        <p className="text-center md:text-left">Yüzlerce Araç Tek Ekranda Seç Beğen Güvenle Kirala</p>

        {/* Sağ İkonlar */}
        <div className="flex space-x-3">
          <Link href="https://facebook.com" aria-label="Facebook"><Facebook className="h-4 w-4" /></Link>
          <Link href="https://instagram.com" aria-label="Instagram"><Instagram className="h-4 w-4" /></Link>
          <Link href="https://linkedin.com" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></Link>
          <Link href="https://youtube.com" aria-label="YouTube"><Youtube className="h-4 w-4" /></Link>
        </div>
      </div>
    </div>
  )
}
