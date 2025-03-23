"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

export default function AddVehiclePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    features: "",
    description: "",
    engine: "",
    transmission: "",
    fuel: "",
    year: "",
    color: "",
    image: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Burada API'ye istek yapılacak
      // Örnek: await fetch('/api/vehicles', { method: 'POST', body: JSON.stringify(formData) })

      // Simüle edilmiş başarılı yanıt
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Araç eklendi",
        description: "Araç başarıyla eklendi.",
      })

      router.push("/admin/araclar")
    } catch (error) {
      toast({
        title: "Hata",
        description: "Araç eklenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Yeni Araç Ekle</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Araç Bilgileri</CardTitle>
            <CardDescription>Araç ile ilgili temel bilgileri girin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Araç Adı</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Örn: Toyota Corolla"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("category", value)}
                  defaultValue={formData.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ekonomik">Ekonomik</SelectItem>
                    <SelectItem value="orta">Orta Sınıf</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Fiyat (₺)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Örn: 3500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Model Yılı</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="Örn: 2023"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="engine">Motor</Label>
                <Input
                  id="engine"
                  name="engine"
                  value={formData.engine}
                  onChange={handleChange}
                  placeholder="Örn: 1.6L"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transmission">Şanzıman</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("transmission", value)}
                  defaultValue={formData.transmission}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Şanzıman seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manuel">Manuel</SelectItem>
                    <SelectItem value="otomatik">Otomatik</SelectItem>
                    <SelectItem value="yarı-otomatik">Yarı Otomatik</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuel">Yakıt</Label>
                <Select onValueChange={(value) => handleSelectChange("fuel", value)} defaultValue={formData.fuel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Yakıt türü seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="benzin">Benzin</SelectItem>
                    <SelectItem value="dizel">Dizel</SelectItem>
                    <SelectItem value="elektrik">Elektrik</SelectItem>
                    <SelectItem value="hibrit">Hibrit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Renk</Label>
                <Input
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Örn: Beyaz"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Özellikler (virgülle ayırın)</Label>
              <Input
                id="features"
                name="features"
                value={formData.features}
                onChange={handleChange}
                placeholder="Örn: Klima, Bluetooth, Navigasyon"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Araç hakkında detaylı bilgi"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Görsel URL</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Örn: https://example.com/image.jpg"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/araclar")}>
              İptal
            </Button>
            <Button type="submit" className="bg-[#5d3b8b] hover:bg-[#4a2e70]" disabled={isLoading}>
              {isLoading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

