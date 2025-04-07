"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const email = (document.getElementById("email") as HTMLInputElement)?.value
    const password = (document.getElementById("password") as HTMLInputElement)?.value

    // Admin kontrolü
    if (email === "admin@lenacars.com" && password === "LenaCars*2025") {
      router.push("https://adminpanel-green-two.vercel.app/")
      return
    }

    // Normal kullanıcı girişi simulasyonu
    setTimeout(() => {
      setIsLoading(false)
      alert("Giriş başarılı (simülasyon)")
    }, 2000)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      alert("Kayıt başarılı (simülasyon)")
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Giriş Yap</TabsTrigger>
              <TabsTrigger value="register">Üye Ol</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Giriş Yap</CardTitle>
                  <CardDescription>LenaCars hesabınıza giriş yapın.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleLogin}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">E-posta</Label>
                        <Input id="email" type="email" placeholder="ornek@firma.com" required />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Şifre</Label>
                          <Link href="/sifremi-unuttum" className="text-sm text-[#5d3b8b] hover:underline">
                            Şifremi Unuttum
                          </Link>
                        </div>
                        <Input id="password" type="password" required />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <label
                          htmlFor="remember"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Beni Hatırla
                        </label>
                      </div>
                      <Button type="submit" className="w-full bg-[#5d3b8b] hover:bg-[#4a2e70]" disabled={isLoading}>
                        {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Üye Ol</CardTitle>
                  <CardDescription>LenaCars'a üye olarak araç kiralama avantajlarından yararlanın.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleRegister}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Ad</Label>
                          <Input id="firstName" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Soyad</Label>
                          <Input id="lastName" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-posta</Label>
                        <Input id="email" type="email" placeholder="ornek@firma.com" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon</Label>
                        <Input id="phone" type="tel" placeholder="+90" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Şirket Adı (Opsiyonel)</Label>
                        <Input id="company" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Şifre</Label>
                        <Input id="password" type="password" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                        <Input id="confirmPassword" type="password" required />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" required />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          <span>
                            <Link href="/kullanim-kosullari" className="text-[#5d3b8b] hover:underline">
                              Kullanım Koşulları
                            </Link>{" "}
                            ve{" "}
                            <Link href="/gizlilik-politikasi" className="text-[#5d3b8b] hover:underline">
                              Gizlilik Politikası
                            </Link>
                            'nı kabul ediyorum
                          </span>
                        </label>
                      </div>
                      <Button type="submit" className="w-full bg-[#5d3b8b] hover:bg-[#4a2e70]" disabled={isLoading}>
                        {isLoading ? "Kaydediliyor..." : "Üye Ol"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
