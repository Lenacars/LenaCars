"use client"

import { useState } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const email = (document.getElementById("email") as HTMLInputElement)?.value
    const password = (document.getElementById("password") as HTMLInputElement)?.value

    if (email === "admin@lenacars.com" && password === "LenaCars*2023") {
      window.location.href = "https://adminpanel-green-two.vercel.app/"
      return
    }

    setTimeout(() => {
      setLoading(false)
      alert("Giriş başarılı (normal kullanıcı)")
    }, 1000)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="text-base">Giriş Yap</TabsTrigger>
              <TabsTrigger value="register" className="text-base">Üye Ol</TabsTrigger>
            </TabsList>

            {/* Giriş Yap */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input id="email" type="email" placeholder="ornek@email.com" className="pl-10" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Şifre</Label>
                    <Link href="/sifremi-unuttum" className="text-sm text-purple-700 hover:text-purple-800">
                      Şifremi Unuttum
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label htmlFor="remember" className="text-sm font-medium">
                    Beni Hatırla
                  </label>
                </div>

                <Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800" disabled={loading}>
                  {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                </Button>
              </form>
            </TabsContent>

            {/* Üye Ol */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Ad</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input id="firstName" placeholder="Adınız" className="pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Soyad</Label>
                    <Input id="lastName" placeholder="Soyadınız" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registerEmail">E-posta</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input id="registerEmail" type="email" placeholder="ornek@email.com" className="pl-10" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" type="tel" placeholder="05XX XXX XX XX" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registerPassword">Şifre</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="registerPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" required />
                  <label htmlFor="terms" className="text-sm font-medium">
                    <span>
                      <a href="/kullanim-kosullari" className="text-purple-700 hover:text-purple-800">
                        Kullanım Koşulları
                      </a>{" "}
                      ve{" "}
                      <a href="/gizlilik-politikasi" className="text-purple-700 hover:text-purple-800">
                        Gizlilik Politikası
                      </a>
                      'nı kabul ediyorum
                    </span>
                  </label>
                </div>

                <Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800" disabled={loading}>
                  {loading ? "Kayıt Yapılıyor..." : "Üye Ol"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} LenaCars - Otomobilde Güvenli Rotanız
          </p>
        </div>
      </div>
    </div>
  )
}
