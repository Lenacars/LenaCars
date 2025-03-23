"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

// Örnek medya verileri
const mediaItems = [
  { id: 1, name: "Araç 1", type: "image", url: "/placeholder.svg?height=200&width=300", date: "2023-03-15" },
  { id: 2, name: "Araç 2", type: "image", url: "/placeholder.svg?height=200&width=300", date: "2023-03-14" },
  { id: 3, name: "Araç 3", type: "image", url: "/placeholder.svg?height=200&width=300", date: "2023-03-13" },
  { id: 4, name: "Araç 4", type: "image", url: "/placeholder.svg?height=200&width=300", date: "2023-03-12" },
  { id: 5, name: "Araç 5", type: "image", url: "/placeholder.svg?height=200&width=300", date: "2023-03-11" },
  { id: 6, name: "Araç 6", type: "image", url: "/placeholder.svg?height=200&width=300", date: "2023-03-10" },
]

export default function MediaPage() {
  const [selectedMedia, setSelectedMedia] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMedia = mediaItems.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    // Simüle edilmiş yükleme
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Medya yüklendi",
      description: "Dosya başarıyla yüklendi.",
    })

    setIsUploading(false)
  }

  const handleDelete = async (id: number) => {
    // Simüle edilmiş silme
    await new Promise((resolve) => setTimeout(resolve, 500))

    toast({
      title: "Medya silindi",
      description: "Dosya başarıyla silindi.",
    })

    setSelectedMedia(null)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Medya Yönetimi</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#5d3b8b] hover:bg-[#4a2e70]">Yeni Medya Yükle</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Medya Yükle</DialogTitle>
              <DialogDescription>Yüklemek istediğiniz dosyayı seçin.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpload}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="file">Dosya</Label>
                  <Input id="file" type="file" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Dosya Adı</Label>
                  <Input id="name" placeholder="Örn: Araç Görseli" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? "Yükleniyor..." : "Yükle"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Input
              placeholder="Medya ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
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
              className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="grid" className="mb-6">
        <TabsList>
          <TabsTrigger value="grid">Grid Görünümü</TabsTrigger>
          <TabsTrigger value="list">Liste Görünümü</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                className={`relative rounded-md overflow-hidden border cursor-pointer transition-all ${selectedMedia === item.id ? "ring-2 ring-[#5d3b8b]" : ""}`}
                onClick={() => setSelectedMedia(item.id === selectedMedia ? null : item.id)}
              >
                <div className="relative h-40">
                  <Image src={item.url || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                </div>
                <div className="p-2 bg-white">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>

                {selectedMedia === item.id && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="bg-white">
                        Düzenle
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(item.id)}
                      >
                        Sil
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <div className="border rounded-md">
            <div className="grid grid-cols-12 gap-4 p-4 font-medium bg-gray-100">
              <div className="col-span-1">ID</div>
              <div className="col-span-2">Görsel</div>
              <div className="col-span-4">Ad</div>
              <div className="col-span-3">Tarih</div>
              <div className="col-span-2 text-right">İşlemler</div>
            </div>

            {filteredMedia.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 p-4 border-t items-center">
                <div className="col-span-1">{item.id}</div>
                <div className="col-span-2">
                  <div className="relative h-16 w-24">
                    <Image
                      src={item.url || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                </div>
                <div className="col-span-4">{item.name}</div>
                <div className="col-span-3">{item.date}</div>
                <div className="col-span-2 text-right">
                  <div className="flex justify-end space-x-2">
                    <Button size="sm" variant="outline">
                      Düzenle
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(item.id)}
                    >
                      Sil
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

