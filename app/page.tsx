import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import VehicleCard from "@/components/vehicle-card";
import HowItWorks from "@/components/how-it-works";
import HeroSlider from "@/components/hero-slider";
import { getAllVehicles } from "@/lib/api";

export default async function Home() {
  const rawVehicles = await getAllVehicles();

  const vehicles = rawVehicles.map((vehicle: any) => {
    const aktifVaryasyonlar = vehicle.variations?.filter((v: any) => v.status === "Aktif") || [];

    const enDusukFiyat = aktifVaryasyonlar.length > 0
      ? Math.min(...aktifVaryasyonlar.map((v: any) => v.fiyat))
      : vehicle.fiyat ?? 0;

    return {
      id: vehicle.id,
      name: vehicle.isim || "Araç İsmi Yok",
      image: vehicle.cover_image?.startsWith("http")
        ? vehicle.cover_image
        : vehicle.cover_image
          ? `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${vehicle.cover_image.replace(/^\/+/, "")}`
          : "/placeholder.svg",
      price: enDusukFiyat,
      rating: 4.5,
      features: [],
      variations: aktifVaryasyonlar, // 👈 Bu satır eksikse fiyat hesaplanmaz!
    };
  });

  return (
    <>
      <HeroSlider />

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-12">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Filtre alanları buraya */}
            </div>
            <div className="mt-4 flex justify-center">
              <Button className="bg-[#e67e22] hover:bg-[#d35400]">Filtrele</Button>
            </div>
          </CardContent>
        </Card>

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
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>

        <HowItWorks />
      </div>
    </>
  );
}
