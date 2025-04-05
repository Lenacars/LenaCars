import Image from "next/image"
import Link from "next/link"
import { Star, Check, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getVehicleById } from "@/lib/api"

interface VehiclePageProps {
  params: {
    id: string
  }
}

export default async function VehiclePage({ params }: VehiclePageProps) {
  const vehicle = await getVehicleById(params.id)

  if (!vehicle) {
    return <div className="p-6 text-red-500 text-center">Araç bulunamadı veya veri eksik.</div>
  }

  const {
    name,
    image,
    category = "Genel",
    rating = 0,
    description,
    features = [],
    specifications = {},
    reviews = [],
    brand = {},
    price = 0,
  } = vehicle

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol kısım */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Link href="/" className="text-sm text-gray-500 hover:underline">Ana Sayfa</Link>
              <span className="mx-2 text-gray-500">/</span>
              <Link href="/arac-filomuz" className="text-sm text-gray-500 hover:underline">Araç Filomuz</Link>
              <span className="mx-2 text-gray-500">/</span>
              <span className="text-sm">{name}</span>
            </div>
            <h1 className="text-3xl font-bold">{name}</h1>
            <div className="flex items-center mt-2">
              <div className="flex items-center mr-4">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-sm">{rating} (32 değerlendirme)</span>
              </div>
              <Badge className="bg-[#5d3b8b]">{category}</Badge>
            </div>
          </div>

          <div className="relative h-[400px] mb-6 rounded-lg overflow-hidden">
            <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
          </div>

          <Tabs defaultValue="overview" className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
              <TabsTrigger value="specifications">Teknik Özellikler</TabsTrigger>
              <TabsTrigger value="reviews">Değerlendirmeler</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Araç Hakkında</h2>
                  <p className="mb-6">{description || "Açıklama mevcut değil."}</p>

                  <h3 className="text-lg font-semibold mb-3">Özellikler</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                    <Info className="h-6 w-6 text-blue-500 mr-3" />
                    <p className="text-sm">Uzun dönem kiralama için özel fiyatlar için lütfen bizimle iletişime geçin.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Teknik Özellikler</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between p-3 border-b">
                        <span className="font-medium">
                          {{
                            engine: "Motor",
                            power: "Güç",
                            transmission: "Şanzıman",
                            fuel: "Yakıt",
                            consumption: "Yakıt Tüketimi",
                            trunk: "Bagaj Hacmi",
                            seats: "Koltuk Sayısı",
                            doors: "Kapı Sayısı",
                            color: "Renk",
                            year: "Model Yılı",
                          }[key] || key}
                        </span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Değerlendirmeler</h2>
                    <Button>Değerlendirme Yap</Button>
                  </div>

                  <div className="space-y-6">
                    {(reviews || []).map((review: any) => (
                      <div key={review.id} className="border-b pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-medium block">{review.user}</span>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Image
                  src={brand.logo || "/placeholder.svg"}
                  alt={brand.name || "Marka"}
                  width={100}
                  height={50}
                  className="mr-4"
                />
                <h2 className="text-xl font-semibold">{brand.name}</h2>
              </div>
              <p>{brand.description}</p>
            </CardContent>
          </Card>
        </div>

        {/* Sağ sabit kutu */}
        <div>
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#5d3b8b] mb-2">
                {price.toLocaleString()} ₺ <span className="text-sm font-normal text-gray-500">/ aylık</span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>Depozito</span>
                  <span className="font-medium">5.000 ₺</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>Minimum Kiralama</span>
                  <span className="font-medium">1 Ay</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>Teslimat</span>
                  <span className="font-medium">Ücretsiz</span>
                </div>
              </div>

              <Button className="w-full mb-3 bg-[#5d3b8b] hover:bg-[#4a2e70]">Garaja Ekle</Button>
              <Button variant="outline" className="w-full mb-6">Teklif İste</Button>

              <div className="text-center text-sm text-gray-500">
                <p>Daha fazla bilgi için</p>
                <p className="font-medium">+90 850 532 7929</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
