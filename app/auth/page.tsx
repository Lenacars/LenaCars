"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { supabase } from "@/lib/supabase-browser";

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const email = (document.getElementById("loginEmail") as HTMLInputElement)?.value;
    const password = (document.getElementById("loginPassword") as HTMLInputElement)?.value;

    // Admin kontrolü
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

    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleRegister fonksiyonu çağrıldı."); // LOG 1
    setLoading(true);
    setMessage("");

    const email = (document.getElementById("registerEmail") as HTMLInputElement)?.value;
    const password = (document.getElementById("registerPassword") as HTMLInputElement)?.value;
    const ad = (document.getElementById("firstName") as HTMLInputElement)?.value;
    const soyad = (document.getElementById("lastName") as HTMLInputElement)?.value;
    const telefon = (document.getElementById("phone") as HTMLInputElement)?.value;

    const musteri_kodu = "LenaCars" + Math.floor(10000 + Math.random() * 90000);
    console.log("Müşteri kodu üretildi:", musteri_kodu); // LOG 2

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error("Supabase auth kayıt hatası:", error.message); // LOG 3
      setMessage(error.message);
    } else {
      const userId = data.user?.id;
      console.log("Supabase User ID:", userId); // LOG 4

      if (userId) {
        const { error: insertError } = await supabase.from("kullanicilar").insert([
          {
            id: userId,
            email,
            ad,
            soyad,
            telefon,
            musteri_kodu,
          },
        ]);

        if (insertError) {
          console.error("Kullanıcı tablosuna kayıt hatası:", insertError.message); // LOG 5
          setMessage("Kayıt yapıldı fakat müşteri kodu kaydedilemedi. Hata: " + insertError.message);
        } else {
          console.log("Kullanıcı bilgileri başarıyla kaydedildi."); // LOG 6
          setMessage("Kayıt başarılı. Lütfen e-posta kutunuzu kontrol edin.");
        }
      } else {
        console.error("userId alınamadı."); // LOG 7
        setMessage("Kayıt yapıldı fakat kullanıcı bilgileri alınamadı.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="text-base">Giriş Yap</TabsTrigger>
              <TabsTrigger value="register" className="text-base">Üye Ol</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loginEmail">E-posta</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input id="loginEmail" type="email" placeholder="ornek@email.com" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="loginPassword">Şifre</Label>
                    <Link href="/sifremi-unuttum" className="text-sm text-purple-700 hover:text-purple-800">
                      Şifremi Unuttum
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="loginPassword"
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
                  <label htmlFor="remember" className="text-sm font-medium">Beni Hatırla</label>
                </div>

                {message && <p className="text-red-500 text-sm">{message}</p>}

                <Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800" disabled={loading}>
                  {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                </Button>
              </form>
            </TabsContent>

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
                    <a href="/kullanim-kosullari" className="text-purple-700 hover:text-purple-800">Kullanım Koşulları</a> ve{" "}
                    <a href="/gizlilik-politikasi" className="text-purple-700 hover:text-purple-800">Gizlilik Politikası</a>'nı kabul ediyorum
                  </label>
                </div>

                {message && <p className="text-red-500 text-sm">{message}</p>}

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
  );
}
