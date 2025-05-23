// app/araclar/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import {
  Star, Fuel, Settings2, CalendarDays, Package, ShieldCheck, MessageCircle, Send,
  CarFront, Loader2, CheckCircle2, CreditCard, HelpCircle, FileText, Users
} from "lucide-react";

// Interface'leriniz olduğu gibi kalabilir
interface Variation { /* ... */ }
interface Comment { /* ... */ }
interface Vehicle { /* ... */ } // Detaylı Vehicle interface'iniz
interface Props { params: { id: string }; }

// SpecIcon helper component'i olduğu gibi kalabilir
const SpecIcon = ({ iconName }: { iconName?: string }) => { /* ... (önceki koddaki gibi) ... */
  switch (iconName?.toLowerCase()) {
    case "yakıt": case "yakit_turu": return <Fuel size={16} className="text-gray-600" />;
    case "vites": return <Settings2 size={16} className="text-gray-600" />;
    case "kapasite": case "kisi_kapasitesi": return <Users size={16} className="text-gray-600" />;
    case "segment": return <Package size={16} className="text-gray-600" />;
    case "marka": return <ShieldCheck size={16} className="text-gray-600" />;
    case "kasa tipi": case "bodytype": return <CarFront size={16} className="text-gray-600" />;
    case "durum": return <CalendarDays size={16} className="text-gray-600" />;
    default: return <HelpCircle size={16} className="text-gray-500" />;
  }
};


export default function Page({ params }: Props) {
  // TÜM STATE'LERİNİZ BURADA
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [session, setSession] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedKm, setSelectedKm] = useState<string>("");
  const [selectedSure, setSelectedSure] = useState<string>("");
  const [newComment, setNewComment] = useState<string>("");
  const [newRating, setNewRating] = useState<number>(5);
  const [isVehicleAddingToGarage, setIsVehicleAddingToGarage] = useState<boolean>(false);
  const [isVehicleAddedToGarage, setIsVehicleAddedToGarage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // TÜM FONKSİYONLARINIZ BURADA (fetchData, handleAddComment, checkIfInGarage, handleVehicleToggleGarage, handleRentNow)
  // Bu fonksiyonların İÇLERİNİ ŞİMDİLİK BOŞ BIRAKALIM veya sadece console.log ekleyelim.
  // AMAÇ: Fonksiyon tanımlama biçimlerinde bir syntax hatası olup olmadığını görmek.

  const checkIfInGarage = async (userId: string, vehicleId: string) => {
    console.log("checkIfInGarage çağrıldı", userId, vehicleId);
    // Gerçek Supabase çağrısı yerine geçici değer
    // const { data: existing } = await supabase.from("garaj").select("id").eq("user_id", userId).eq("arac_id", vehicleId).maybeSingle();
    // setIsVehicleAddedToGarage(!!existing);
  };
  
  const fetchData = async () => {
    setIsLoading(true);
    console.log("fetchData çağrıldı, ID:", params.id);
    try {
      if (!params.id) { setIsLoading(false); return; }
      // Geçici olarak sadece temel bir araç objesi set edelim
      const mockVehicle: Vehicle = {
        id: params.id,
        isim: "Test Aracı - Minimal Build",
        brand: "TestMarka",
        cover_image: "placeholder.svg", // veya geçerli bir test resmi anahtarı
        aciklama: "Test açıklaması",
        kisa_aciklama: "Kısa test.",
        stok_kodu: "TEST001",
        segment: "C",
        yakit_turu: "Benzin",
        vites: "Otomatik",
        durum: "Yeni",
        category: "Binek",
        bodyType: "Sedan",
        fiyat: 1000,
        gallery_images: [],
        kisi_kapasitesi: "5"
      };
      setVehicle(mockVehicle);
      setSelectedImage(`https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${mockVehicle.cover_image.replace(/^\/+/, "")}`);
      
      // Diğer state'leri boş dizilerle veya varsayılanlarla başlatalım
      setVariations([]);
      setComments([]);
      const { data: sessionDataVal } = await supabase.auth.getSession();
      setSession(sessionDataVal.session);
      if (sessionDataVal.session?.user?.id && mockVehicle) {
          await checkIfInGarage(sessionDataVal.session.user.id, mockVehicle.id);
      }

    } catch (error) {
      console.error("Minimal fetchData error:", error);
      setVehicle(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const handleAddComment = async () => { console.log("handleAddComment çağrıldı"); };
  const handleVehicleToggleGarage = async () => { console.log("handleVehicleToggleGarage çağrıldı"); };
  const handleRentNow = () => { console.log("handleRentNow çağrıldı"); };

  // TÜM HESAPLANAN DEĞİŞKENLER (ŞİMDİLİK BASİT TUTALIM VEYA YORUM SATIRI YAPALIM)
  const activeVariations = variations.filter(v => v.status === "Aktif"); // Bu kalabilir
  // Diğer karmaşık olanları (availableKms, displayPrice, gallery, keySpecs, allSpecs vb.) 
  // ŞİMDİLİK YORUM SATIRI yapalım veya çok basit hallerini bırakalım:
  const displayPrice = vehicle?.fiyat ?? 0;
  const gallery: string[] = vehicle?.cover_image ? [vehicle.cover_image] : [];
  const vehicleDisplayName = vehicle?.isim || "Araç Adı Yok";


  // ERKEN RETURN'LER
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-xl"><Loader2 className="mr-2 h-6 w-6 animate-spin text-[#6A3C96]" /> Yükleniyor... (Minimal Debug)</div>;
  }
  
  if (!vehicle) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-xl p-6 text-center">Araç bulunamadı (Minimal Debug).</div>;
  }

  // ----- ANA RETURN BAŞLANGICI (Loglardaki hata bu satırdan sonraki ilk div'deydi) -----
  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-2">Minimal Debug Sayfası</h1>
      <p>Araç Adı: {vehicle.isim}</p>
      {selectedImage && (
        <div style={{width: '200px', height: '150px', position: 'relative', border: '1px solid black'}}>
            <Image src={selectedImage} alt="test" layout="fill" objectFit="contain" />
        </div>
      )}
      <p className="mt-4">Eğer bu sayfayı görüyorsanız, sorun JSX yapısında değil, <br/>öncesindeki JavaScript tanımlamalarındadır (fonksiyonlar, hesaplanan değişkenler vb).</p>
      <p>Şimdi adım adım önceki kod parçalarını (özellikle hesaplanan değişkenler ve fonksiyon içleri) geri ekleyerek hatayı bulacağız.</p>
    </div>
  );
}
