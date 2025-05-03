import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import VehicleCard from "@/components/vehicle-card"
import HowItWorks from "@/components/how-it-works"
import HeroSlider from "@/components/hero-slider"
import { getAllVehicles } from "@/lib/api"

export default async function Home() {
  const vehicles = await getAllVehicles()

  return (
    <>
      {/* Ana Slider Bölümü */}
      <HeroSlider />

      <div className="container mx-auto px-4 py-8">
        {/* Filtreleme Bölümü */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Marka, segment, yakıt türü vs. filtre alanları buraya gelebilir */}
            </div>
            <div className="mt-4 flex justify-center">
              <Button className="bg-[#e67e22] hover:bg-[#d35400]">Filtrele</Button>
            </div>
          </CardContent>
        </Card>

        {/* Araç Listesi Bölümü */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Araç Filomuz</h2>
            <div className="flex items-center">
              <span className="mr-2 text-sm">{vehicles.length} sonuç bulundu</span>
              <select className="p-2 border rounded-md text-sm">
                <option>Fiyata göre sırala: Düşükten yükseğe</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle: any) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={{
                  id: vehicle.id,
                  name: vehicle.isim || "Araç İsmi Yok",
                  image: vehicle.cover_image?.startsWith("http")
                    ? vehicle.cover_image
                    : vehicle.cover_image
                      ? `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${vehicle.cover_image.replace(/^\/+/, "")}`
                      : "/placeholder.svg",
                  price: vehicle.fiyat ?? 0,
                  rating: 4.5,
                  features: [],
                }}
              />
            ))}
          </div>
        </div>

        {/* Bilgilendirici Bölüm */}
        <HowItWorks />

        {/* Avantajlar, kampanyalar, çağrı alanları gibi bölümler buraya eklenebilir */}
      </div>
    </>
  )
}
