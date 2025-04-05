"use client"

import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { useState } from "react"

interface VehicleCardProps {
  vehicle: {
    id: string
    name: string
    image?: string
    slug?: string
    category?: string
    rating?: number
    features?: string[]
    price?: number
  }
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const {
    id,
    name,
    image,
    category,
    rating = 4.5,
    features = [],
    price = 0,
  } = vehicle

  return (
    <div
      className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Görsel */}
      <div className="relative h-48 bg-gray-100">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform duration-300"
          style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
        />
      </div>

      {/* İçerik */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold">{name}</h3>
          <div className="flex items-center text-sm">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
            {rating}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 text-xs text-muted-foreground">
          {features.map((feature, i) => (
            <span key={i} className="px-2 py-1 bg-gray-100 rounded">
              {feature}
            </span>
          ))}
        </div>

        <div className="text-xl font-bold text-[#5d3b8b] mb-4">
          {price.toLocaleString()} ₺ <span className="text-sm font-normal text-gray-500">/ aylık</span>
        </div>

        <div className="flex justify-between gap-2">
          <Link
            href={`/vehicles/${id}`}
            className="text-sm px-4 py-2 bg-[#5d3b8b] text-white rounded hover:bg-[#4a2e70]"
          >
            Detaylar
          </Link>
          <button className="text-sm px-4 py-2 border rounded">Garaja Ekle</button>
        </div>
      </div>
    </div>
  )
}
