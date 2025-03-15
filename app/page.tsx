import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import VehicleCard from "@/components/vehicle-card"
import HowItWorks from "@/components/how-it-works"

export default function Home() {
  // Sample vehicle data
  const vehicles = [
    {
      id: 1,
      name: "Renault Clio",
      image: "/placeholder.svg?height=200&width=300",
      category: "Ekonomik",
      price: 2500,
      features: ["Dizel", "Manuel", "5 Kapı", "Klima"],
      rating: 4.5,
    },
    {
      id: 2,
      name: "Toyota Corolla",
      image: "/placeholder.svg?height=200&width=300",
      category: "Orta Sınıf",
      price: 3500,
      features: ["Benzin", "Otomatik", "4 Kapı", "Klima"],
      rating: 4.7,
    },
    {
      id: 3,
      name: "Volkswagen Passat",
      image: "/placeholder.svg?height=200&width=300",
      category: "Üst Sınıf",
      price: 4500,
      features: ["Dizel", "Otomatik", "4 Kapı", "Klima"],
      rating: 4.8,
    },
    {
      id: 4,
      name: "Ford Focus",
      image: "/placeholder.svg?height=200&width=300",
      category: "Orta Sınıf",
      price: 3200,
      features: ["Dizel", "Manuel", "5 Kapı", "Klima"],
      rating: 4.6,
    },
    {
      id: 5,
      name: "Mercedes C180",
      image: "/placeholder.svg?height=200&width=300",
      category: "Premium",
      price: 6000,
      features: ["Benzin", "Otomatik", "4 Kapı", "Klima"],
      rating: 4.9,
    },
    {
      id: 6,
      name: "BMW 320i",
      image: "/placeholder.svg?height=200&width=300",
      category: "Premium",
      price: 6500,
      features: ["Benzin", "Otomatik", "4 Kapı", "Klima"],
      rating: 4.8,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-12">
        <Image src="/placeholder.svg?height=400&width=1200" alt="LenaCars Hero Banner" fill className="object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">ARACINIZ BİZDEN, İŞİNİZİ BÜYÜTMEK SİZDEN!</h1>
          <p className="text-xl text-center mb-8 max-w-2xl">Kurumsal araç kiralama çözümleri ile işinizi büyütün</p>
          <Button size="lg" className="bg-[#5d3b8b] hover:bg-[#4a2e70]">
            Hemen Araç Kirala
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <Card className="mb-12">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Araç Sınıfı</label>
              <select className="w-full p-2 border rounded-md">
                <option value="">Tümü</option>
                <option value="ekonomik">Ekonomik</option>
                <option value="orta">Orta Sınıf</option>
                <option value="premium">Premium</option>
                <option value="suv">SUV</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Marka</label>
              <select className="w-full p-2 border rounded-md">
                <option value="">Tümü</option>
                <option value="renault">Renault</option>
                <option value="toyota">Toyota</option>
                <option value="volkswagen">Volkswagen</option>
                <option value="ford">Ford</option>
                <option value="mercedes">Mercedes</option>
                <option value="bmw">BMW</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Vites</label>
              <select className="w-full p-2 border rounded-md">
                <option value="">Tümü</option>
                <option value="manuel">Manuel</option>
                <option value="otomatik">Otomatik</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Yakıt</label>
              <select className="w-full p-2 border rounded-md">
                <option value="">Tümü</option>
                <option value="benzin">Benzin</option>
                <option value="dizel">Dizel</option>
                <option value="elektrik">Elektrik</option>
                <option value="hibrit">Hibrit</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <Button className="bg-[#e67e22] hover:bg-[#d35400]">Filtrele</Button>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Listing */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Araç Filomuz</h2>
          <div className="flex items-center">
            <span className="mr-2 text-sm">133 sonuçtan 1-21 arası gösteriliyor</span>
            <select className="p-2 border rounded-md text-sm">
              <option value="asc">Fiyata göre sırala: Düşükten yükseğe</option>
              <option value="desc">Fiyata göre sırala: Yüksekten düşüğe</option>
              <option value="name_asc">İsme göre sırala: A-Z</option>
              <option value="name_desc">İsme göre sırala: Z-A</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Advantages Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Dijital Araç Kiralama Süreci Neden Kolaydır?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#5d3b8b] text-white flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Geniş Araç Filosu</h3>
                <p className="text-sm text-gray-600">Yüzlerce araca tek ekranda tek tuşla ulaşabilirsiniz.</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#5d3b8b] text-white flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Hızlı ve Kolay</h3>
                <p className="text-sm text-gray-600">
                  Tek ekranda tüm kurumsal araç kiralama adımlarını tamamlayabilirsiniz.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#5d3b8b] text-white flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Uygun Fiyatlar</h3>
                <p className="text-sm text-gray-600">Anlık kampanyaları ve en uygun fiyatları bulabilirsiniz.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#5d3b8b] text-white rounded-lg p-8 mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Kurumsal Araç Kiralama Çözümleri</h2>
            <p className="text-lg">İşinizi büyütmek için hemen araç kiralayın!</p>
          </div>
          <Button size="lg" className="bg-white text-[#5d3b8b] hover:bg-gray-100">
            Bize Ulaşın
          </Button>
        </div>
      </div>
    </div>
  )
}

