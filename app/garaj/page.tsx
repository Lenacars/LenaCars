"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase-browser";

interface GarageVehicle {
  id: string;
  name: string;
  image: string;
  category: string;
  price: number;
  period?: string;
}

export default function GaragePage() {
  const [vehicles, setVehicles] = useState<GarageVehicle[]>([]);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    console.log("🟢 GaragePage YÜKLENDİ");
    fetchGarageVehicles();
  }, []);

  const fetchGarageVehicles = async () => {
    console.log("🔵 fetchGarageVehicles başladı.");

    let combinedVehicles: GarageVehicle[] = [];

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("❌ Session alma hatası:", sessionError);
    }

    const userId = sessionData.session?.user?.id;
    console.log("🟢 Kullanıcı ID:", userId || "Misafir");

    if (userId) {
      localStorage.removeItem("guest_garaj");

      const { data, error } = await supabase
        .from("garaj")
        .select(`
          id,
          Araclar:arac_id (
            id,
            isim,
            cover_image,
            category,
            fiyat
          )
        `)
        .eq("user_id", userId);

      if (error) {
        console.error("🔴 Supabase garaj verileri alınamadı:", error);
      } else {
        const supabaseVehicles = data
          .filter((item: any) => item.Araclar)
          .map((item: any) => ({
            id: item.Araclar.id,
            name: item.Araclar.isim,
            image: item.Araclar.cover_image
              ? `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${item.Araclar.cover_image.replace(/^\/+/, "")}`
              : "/placeholder.svg",
            category: item.Araclar.category || "-",
            price: Number(item.Araclar.fiyat) || 0,
            period: "Aylık",
          }));

        combinedVehicles = [...combinedVehicles, ...supabaseVehicles];
      }
    } else {
      const guestGarageIds = JSON.parse(localStorage.getItem("guest_garaj") || "[]") as string[];
      console.log("👤 Misafir garaj ID'leri:", guestGarageIds);

      if (guestGarageIds.length > 0) {
        const { data, error } = await supabase
          .from("Araclar")
          .select("id, isim, cover_image, category, fiyat")
          .in("id", guestGarageIds);

        if (error) {
          console.error("🔴 LocalStorage araçları alınamadı:", error);
        } else {
          const guestVehicles = data.map((item: any) => ({
            id: item.id,
            name: item.isim,
            image: item.cover_image
              ? `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${item.cover_image.replace(/^\/+/, "")}`
              : "/placeholder.svg",
            category: item.category || "-",
            price: Number(item.fiyat) || 0,
            period: "Aylık",
          }));

          combinedVehicles = [...combinedVehicles, ...guestVehicles];
        }
      }
    }

    console.log("✅ Garajdaki tüm araçlar:", combinedVehicles);
    setVehicles(combinedVehicles);
  };

  const removeVehicle = async (vehicleId: string) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (userId) {
      await supabase
        .from("garaj")
        .delete()
        .eq("user_id", userId)
        .eq("arac_id", vehicleId);
    } else {
      const current = JSON.parse(localStorage.getItem("guest_garaj") || "[]") as string[];
      const updated = current.filter((id) => id !== vehicleId);
      localStorage.setItem("guest_garaj", JSON.stringify(updated));
    }

    console.log(`🗑️ Araç kaldırıldı: ${vehicleId}`);
    setVehicles(vehicles.filter((v) => v.id !== vehicleId));
    toast({ title: "Araç kaldırıldı." });
  };

  const calculateTotal = () => {
    return vehicles.reduce((total, vehicle) => total + vehicle.price, 0);
  };

  const handleGeneratePdf = async () => {
    console.log("🟣 handleGeneratePdf tetiklendi");

    if (vehicles.length === 0) {
      console.warn("⚠️ Garaj boş, PDF oluşturulamaz.");
      toast({
        title: "Hata",
        description: "Garajda araç bulunamadı.",
        variant: "destructive",
      });
      return;
    }

    const vehicleIds = vehicles.map((v) => v.id);
    console.log("📦 Seçilen araç ID'leri:", vehicleIds);

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    console.log("👤 userId:", userId);

    if (!userId) {
      console.warn("👤 Misafir kullanıcı PDF oluşturmak istedi, yönlendiriliyor...");
      window.location.href = "https://lena-cars.vercel.app/giris";
      return;
    }

    setIsGeneratingPdf(true);

    try {
      console.log("📨 API'ye istek atılıyor...");
      const response = await fetch("/api/teklif-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vehicleIds, userId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ PDF API hatası:", errorText);
        toast({
          title: "PDF Hatası",
          description: `PDF oluşturulamadı: ${errorText}`,
          variant: "destructive",
        });
        return;
      }

      const result = await response.json();
      console.log("📄 PDF API dönüşü:", result);

      if (result.url) {
        window.open(result.url, "_blank");
        toast({
          title: "Başarılı",
          description: "PDF başarıyla oluşturuldu ve açıldı.",
        });
      } else {
        console.error("❌ PDF URL alınamadı.");
        toast({
          title: "PDF Hatası",
          description: "URL alınamadı.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("🔴 PDF oluşturma hatası:", error);
      toast({
        title: "Hata",
        description: "PDF oluşturulamadı.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Garajım</h1>
      {vehicles.length === 0 ? (
        <Card className="mb-8">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <h2 className="text-xl font-semibold mb-2">Garajınız Boş</h2>
            <Link href="/arac-filomuz">
              <Button className="bg-[#5d3b8b] hover:bg-[#4a2e70]">
                Araç Filomuz
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Seçtiğiniz Araçlar</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Görsel</TableHead>
                  <TableHead>Araç</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Fiyat</TableHead>
                  <TableHead>İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <Image
                        src={vehicle.image}
                        alt={vehicle.name}
                        width={120}
                        height={80}
                        className="rounded-md object-contain"
                      />
                    </TableCell>
                    <TableCell>{vehicle.name}</TableCell>
                    <TableCell>{vehicle.category}</TableCell>
                    <TableCell>{vehicle.price.toLocaleString()} ₺</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeVehicle(vehicle.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              <p className="text-lg font-semibold">
                Toplam: {calculateTotal().toLocaleString()} ₺
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleGeneratePdf} disabled={isGeneratingPdf}>
                <FileText className="w-4 h-4 mr-2" />
                {isGeneratingPdf ? "PDF Hazırlanıyor..." : "PDF Oluştur"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
