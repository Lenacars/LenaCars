"use client"

import Link from "next/link"
import { MapPin, Mail, Phone, Facebook, Instagram, Linkedin, Youtube } from "lucide-react"

export default function TopBar() {
  return (
    <div className="w-full bg-[#6A3C96] text-white py-2 text-sm">
      <div className="container mx-auto px-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        
        {/* İletişim Bilgileri */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
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

        {/* Ortadaki Slogan */}
        <p className="text-center hidden md:block">
          Yüzlerce Araç Tek Ekranda Seç Beğen Güvenle Kirala
        </p>
        <p className="text-center block md:hidden text-xs">
          Seç Beğen Güvenle Kirala
        </p>

        {/* Sosyal Medya İkonları */}
        <div className="flex justify-center md:justify-end space-x-3">
          <Link href="https://facebook.com" aria-label="Facebook"><Facebook className="h-4 w-4" /></Link>
          <Link href="https://instagram.com" aria-label="Instagram"><Instagram className="h-4 w-4" /></Link>
          <Link href="https://linkedin.com" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></Link>
          <Link href="https://youtube.com" aria-label="YouTube"><Youtube className="h-4 w-4" /></Link>
        </div>
      </div>
    </div>
  )
}
