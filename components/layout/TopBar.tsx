"use client"

import Link from "next/link"
import { MapPin, Mail, Phone, Facebook, Instagram, Linkedin, Youtube } from "lucide-react"

export default function TopBar() {
  return (
    <div className="bg-[#6A3C96] text-white text-sm py-2">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /><span>Merkez Ofis</span></div>
          <div className="flex items-center gap-1"><Mail className="h-4 w-4" /><a href="mailto:info@lenacars.com">info@lenacars.com</a></div>
          <div className="flex items-center gap-1"><Phone className="h-4 w-4" /><a href="tel:+908505327929">+90 850 532 7929</a></div>
        </div>
        <p className="hidden md:block text-center">Yüzlerce Araç Tek Ekranda Seç Beğen Güvenle Kirala</p>
        <div className="flex items-center gap-3">
          <Link href="https://facebook.com"><Facebook className="h-4 w-4" /></Link>
          <Link href="https://instagram.com"><Instagram className="h-4 w-4" /></Link>
          <Link href="https://linkedin.com"><Linkedin className="h-4 w-4" /></Link>
          <Link href="https://youtube.com"><Youtube className="h-4 w-4" /></Link>
        </div>
      </div>
    </div>
  )
}
