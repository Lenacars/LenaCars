"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, FileText, Mail, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

interface GarageVehicle {
  id: number
  name: string
  image: string
  category: string
  price: number
  period: string
}

export default function GaragePage() {
  const [vehicles, setVehicles] = useState<GarageVehicle[]>([
    {
      id: 1,
      name: "Renault Clio",
      image: "/placeholder.svg?height=80&width=120",
      category: "Ekonomik",
      price: 2500,
      period: "Aylık",
    },
    {
      id: 2,
      name: "Toyota Corolla",
      image: "/placeholder.svg?height=80&width=120",
      category: "Orta Sınıf",
      price: 3500,
      period: "Aylık",
    },
  ])

  const [email, setEmail] = useState("")
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  const removeVehicle = (id: number) => {
    setVehicles(vehicles.filter((vehicle) => vehicle.id !== id))
    toast({
      title: "Araç garajdan kaldırıldı",
      description: "Araç başarıyla garajınızdan kaldırıldı.",
    })
  }

  const calculateTotal = () => {
    return vehicles.reduce((total, vehicle) => total + vehicle.price, 0)
  }

  const handleGeneratePdf = () => {
    setIsGeneratingPdf(true)

    // Simulate PDF generation
    setTimeout(() => {
      setIsGeneratingPdf(false)
      toast({
        title: "PDF oluşturuldu",
        description: "Garaj listesi PDF olarak oluşturuldu.",
      })
    }, 2000)
  }

  const handleSendEmail = () => {
    if (!email) {
      toast({
        title: "Hata",
        description: "Lütfen e-posta adresinizi girin.",
        variant: "destructive",
      })
      return
    }

    setIsSendingEmail(true)

    // Simulate email sending
    setTimeout(() => {
      setIsSendingEmail(false)
      setEmail("")
      toast({
        title: "E-posta gönderildi",
        description: `Garaj listesi ${email} adresine gönderildi.`,
      })
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Garajım</h1>

      {vehicles.length === 0 ? (
        <Card className="mb-8">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <div className="rounded-full bg-muted p-6 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <path d="M3 3h18v18H3z" />
                <path d="M3 9h18" />
                <path d="M15 3v6" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Garajınız Boş</h2>
            <p className="text-center text-muted-foreground mb-6">
              Garajınıza henüz araç eklemediniz. Araç eklemek için araç filomuzdan araç seçebilirsiniz.
            </p>
            <Link href="/arac-filomuz">
              <Button className="bg-[#5d3b8b] hover:bg-[#4a2e70]">Araç Filomuz</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Seçtiğiniz Araçlar</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Görsel</TableHead>
                    <TableHead>Araç</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Fiyat</TableHead>
                    <TableHead>Dönem</TableHead>
                    <TableHead className="text-right">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((vehicle) => (
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
                      <TableCell>{vehicle.period}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => removeVehicle(vehicle.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Kaldır</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                <p className="text-lg font-semibold">Toplam: {calculateTotal()} ₺</p>
                <p className="text-sm text-muted-foreground">KDV dahil</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleGeneratePdf} disabled={isGeneratingPdf}>
                  <FileText className="h-4 w-4 mr-2" />
                  {isGeneratingPdf ? "Oluşturuluyor..." : "PDF Oluştur"}
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      E-posta Gönder
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>E-posta Gönder</DialogTitle>
                      <DialogDescription>Garaj listenizi e-posta olarak gönderin.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">E-posta Adresi</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="ornek@firma.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleSendEmail} disabled={isSendingEmail}>
                        {isSendingEmail ? "Gönderiliyor..." : "Gönder"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Link href="/teklif-al">
                  <Button className="bg-[#5d3b8b] hover:bg-[#4a2e70]">Teklif Al</Button>
                </Link>
              </div>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Garaj Listesi İndir</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Seçtiğiniz araçların listesini PDF olarak indirin veya e-posta olarak gönderin.
                </p>
                <Button className="w-full" onClick={handleGeneratePdf} disabled={isGeneratingPdf}>
                  <Download className="h-4 w-4 mr-2" />
                  {isGeneratingPdf ? "İndiriliyor..." : "İndir"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Teklif İsteyin</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Seçtiğiniz araçlar için özel teklif almak ister misiniz?</p>
                <Link href="/teklif-al">
                  <Button className="w-full bg-[#5d3b8b] hover:bg-[#4a2e70]">Teklif İste</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

