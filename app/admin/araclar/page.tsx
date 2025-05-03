"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Search, Edit, Trash2, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"

interface Vehicle {
  id: number
  name: string
  image: string
  category: string
  price: number
  status: "active" | "inactive" | "maintenance"
  stock: number
}

export default function VehiclesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: 1,
      name: "Renault Clio",
      image: "/placeholder.svg?height=80&width=120",
      category: "Ekonomik",
      price: 2500,
      status: "active",
      stock: 8,
    },
    {
      id: 2,
      name: "Toyota Corolla",
      image: "/placeholder.svg?height=80&width=120",
      category: "Orta Sınıf",
      price: 3500,
      status: "active",
      stock: 12,
    },
    {
      id: 3,
      name: "Volkswagen Passat",
      image: "/placeholder.svg?height=80&width=120",
      category: "Üst Sınıf",
      price: 4500,
      status: "active",
      stock: 5,
    },
    {
      id: 4,
      name: "Ford Focus",
      image: "/placeholder.svg?height=80&width=120",
      category: "Orta Sınıf",
      price: 3200,
      status: "maintenance",
      stock: 3,
    },
    {
      id: 5,
      name: "Mercedes C180",
      image: "/placeholder.svg?height=80&width=120",
      category: "Premium",
      price: 6000,
      status: "active",
      stock: 2,
    },
  ])

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id: number) => {
    setVehicles(vehicles.filter((vehicle) => vehicle.id !== id))
    toast({
      title: "Araç silindi",
      description: "Araç başarıyla silindi.",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Aktif</Badge>
      case "inactive":
        return <Badge variant="outline">Pasif</Badge>
      case "maintenance":
        return <Badge className="bg-yellow-500">Bakımda</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Araçlar</h1>
        <Link href="/admin/araclar/ekle">
          <Button className="bg-[#5d3b8b] hover:bg-[#4a2e70]">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Araç Ekle
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Araç ara..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrele
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Kategoriler</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setSearchTerm("Ekonomik")}>Ekonomik</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchTerm("Orta Sınıf")}>Orta Sınıf</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchTerm("Üst Sınıf")}>Üst Sınıf</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchTerm("Premium")}>Premium</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Durum</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setSearchTerm("Aktif")}>Aktif</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchTerm("Pasif")}>Pasif</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchTerm("Bakımda")}>Bakımda</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSearchTerm("")}>Filtreleri Temizle</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Araç Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Görsel</TableHead>
                <TableHead>Araç</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Fiyat</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Araç bulunamadı
                  </TableCell>
                </TableRow>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <Image
                        src={vehicle.image || "/placeholder.svg"}
                        alt={vehicle.name}
                        width={120}
                        height={80}
                        className="rounded-md"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{vehicle.name}</TableCell>
                    <TableCell>{vehicle.category}</TableCell>
                    <TableCell>{vehicle.price} ₺</TableCell>
                    <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                    <TableCell>{vehicle.stock}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/araclar/duzenle/${vehicle.id}`}>
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Düzenle</span>
                          </Button>
                        </Link>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Trash2 className="h-4 w-4 text-red-500" />
                              <span className="sr-only">Sil</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Aracı Sil</DialogTitle>
                              <DialogDescription>
                                Bu aracı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline">İptal</Button>
                              <Button variant="destructive" onClick={() => handleDelete(vehicle.id)}>
                                Sil
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

