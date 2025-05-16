"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase-browser";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const email = (document.getElementById("email") as HTMLInputElement)?.value;
    const password = (document.getElementById("password") as HTMLInputElement)?.value;

    if (email === "admin@lenacars.com" && password === "LenaCars*2023") {
      window.location.href = "https://adminpanel-green-two.vercel.app/";
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage("E-posta veya şifre hatalı.");
    } else {
      setMessage("");
      window.location.href = "/";
    }

    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const ad = (document.getElementById("firstName") as HTMLInputElement)?.value;
    const soyad = (document.getElementById("lastName") as HTMLInputElement)?.value;
    const email = (document.getElementById("email") as HTMLInputElement)?.value;
    const phone = (document.getElementById("phone") as HTMLInputElement)?.value;
    const firma = (document.getElementById("company") as HTMLInputElement)?.value || null;
    const password = (document.getElementById("password") as HTMLInputElement)?.value;
    const confirmPassword = (document.getElementById("confirmPassword") as HTMLInputElement)?.value;

    if (password !== confirmPassword) {
      setMessage("Şifreler uyuşmuyor.");
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
      return;
    }

    const userId = data?.user?.id;
    if (userId) {
      const { error: insertError } = await supabase.from("kullanicilar").insert({
        id: userId,
        ad,
        soyad,
        email,
        telefon: phone,
        firma: firma,
      });

      if (insertError) {
        setMessage("Veritabanına kayıt sırasında hata oluştu: " + insertError.message);
        setIsLoading(false);
        return;
      }
    }

    setMessage("Kayıt başarılı. Lütfen e-posta adresinizi kontrol edin.");
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-md">

          {redirect === "teklif" && (
            <div className="bg-yellow-100 text-yellow-800 text-sm font-medium p-3 rounded mb-4 border border-yellow-300">
              Teklif oluşturmak için lütfen giriş yapın.
            </div>
          )}

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Giriş Yap</TabsTrigger>
              <TabsTrigger value="register">Üye Ol</TabsTrigger>
            </TabsList>

            {/* Giriş */}
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
                        <Input id="email" type="email" required />
                      </div>
                      <div className="space-y-2 relative">
                        <Label htmlFor="password">Şifre</Label>
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-[38px] text-sm text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "🙈" : "👁️"}
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="remember" />
                          <label htmlFor="remember">Beni Hatırla</label>
                        </div>
                        <Link href="/sifremi-unuttum" className="text-[#5d3b8b] hover:underline">
                          Şifremi Unuttum
                        </Link>
                      </div>
                      {message && <p className="text-red-500 text-sm">{message}</p>}
                      <Button
                        type="submit"
                        className="w-full bg-[#5d3b8b] hover:bg-[#4a2e70]"
                        disabled={isLoading}
                      >
                        {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Üye Ol */}
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Üye Ol</CardTitle>
                  <CardDescription>
                    LenaCars'a üye olarak araç kiralama avantajlarından yararlanın.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
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
                      <Input id="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input id="phone" type="tel" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Şirket Adı (Opsiyonel)</Label>
                      <Input id="company" />
                    </div>
                    <div className="space-y-2 relative">
                      <Label htmlFor="password">Şifre</Label>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-[38px] text-sm text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                    <div className="space-y-2 relative">
                      <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-[38px] text-sm text-gray-500"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" required />
                      <label htmlFor="terms" className="text-sm">
                        <Link href="/kullanim-kosullari" className="text-[#5d3b8b] hover:underline">
                          Kullanım Koşulları
                        </Link>{" "}
                        ve{" "}
                        <Link href="/gizlilik-politikasi" className="text-[#5d3b8b] hover:underline">
                          Gizlilik Politikası
                        </Link>
                        'nı kabul ediyorum
                      </label>
                    </div>
                    {message && <p className="text-red-500 text-sm">{message}</p>}
                    <Button
                      type="submit"
                      className="w-full bg-[#5d3b8b] hover:bg-[#4a2e70]"
                      disabled={isLoading}
                    >
                      {isLoading ? "Kaydediliyor..." : "Üye Ol"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
