"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Star, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

interface VehicleCardProps {
  vehicle: {
    id: number
    name: string
    image: string
    category: string
    price: number
    features: string[]
    rating: number
  }
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToGarage = () => {
    toast({
      title: "Araç garaja eklendi",
      description: `${vehicle.name} başarıyla garajınıza eklendi.`,
    })
  }

  return (
    <Card
      className="overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48">
        <Image
          src={vehicle.image || "/placeholder.svg"}
          alt={vehicle.name}
          fill
          className="object-cover transition-transform duration-500"
          style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
        />
        <Badge className="absolute top-2 left-2 bg-[#5d3b8b]">{vehicle.category}</Badge>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold">{vehicle.name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm">{vehicle.rating}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {vehicle.features.map((feature, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>
        <div className="text-xl font-bold text-[#5d3b8b]">
          {vehicle.price} ₺ <span className="text-sm font-normal text-gray-500">/ aylık</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Link href={`/arac/${vehicle.id}`}>
          <Button variant="outline">Detaylar</Button>
        </Link>
        <Button onClick={handleAddToGarage} className="bg-[#5d3b8b] hover:bg-[#4a2e70]">
          <Plus className="h-4 w-4 mr-2" /> Garaja Ekle
        </Button>
      </CardFooter>
    </Card>
  )
}

