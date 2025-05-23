// app/araclar/[id]/page.tsx (veya benzeri dosya yolunuz)
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation"; // Bu sayfada kullanılmıyor gibi, kaldırılabilir.
import { supabase } from "@/lib/supabase-browser";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import {
  ChevronLeft, ChevronRight, Star, Tag, Users, Gauge, Fuel, Settings2, CalendarDays, Package, ShieldCheck, MessageCircle, Send,
  Heart, // Garaja ekle için (opsiyonel, CarFront da olabilir)
  CarFront, // Garaja ekle için
  Loader2,
  CheckCircle2
} from "lucide-react";

// Interface'leriniz olduğu gibi kalabilir
interface Variation {
  kilometre: string;
  sure: string;
  fiyat: number;
  status: string;
}

interface Comment {
  id: string;
  user_id: string;
  yorum: string;
  puan: number;
  created_at: string;
  kullanici?: { ad: string; soyad:string };
}

interface Vehicle {
  id: string;
  isim: string;
  aciklama: string;
  kisa_aciklama: string;
  stok_kodu: string;
  segment: string;
  yakit_turu: string;
  vites: string;
  durum: string;
  brand: string;
  category: string;
  bodyType: string;
  fiyat: number;
  cover_image: string;
  gallery_images: string[];
}

// Sayfa Props
interface Props {
  params: { id: string };
}

export default function Page({ params }: Props) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [session, setSession] = useState<any>(null); // Supabase session tipi kullanılabilir
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedKm, setSelectedKm] = useState("");
  const [selectedSure, setSelectedSure] = useState("");
  
  // Yorumlar için state'ler
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);

  // Araç garaja ekleme için state'ler (VehicleCard'daki gibi)
  const [isVehicleAddingToGarage, setIsVehicleAddingToGarage] = useState(false);
  const [isVehicleAddedToGarage, setIsVehicleAddedToGarage] = useState(false);

  const fetchData = async () => {
    // ... (mevcut fetchData fonksiyonunuz büyük ölçüde aynı kalabilir) ...
    // Sadece setVehicle(arac as Vehicle) gibi tip zorlamaları gerekebilir Supabase'den gelen veri için
    const { data: aracData } = await supabase
      .from("Araclar")
      .select("*")
      .eq("id", params.id)
      .maybeSingle();

    if (aracData) { // aracData null değilse devam et
        const arac = aracData as Vehicle; // Tip ataması
        setVehicle(arac);

        const { data: varData } = await supabase
            .from("variations")
            .select("*")
            .eq("arac_id", params.id);
        setVariations(varData || []);

        const { data: yorumlar } = await supabase
            .from("yorumlar")
            .select("*, kullanici:kullanicilar(ad,soyad)")
            .eq("arac_id", params.id)
            .order("created_at", { ascending: false });
        setComments(yorumlar || []);

        const { data: sessionData } = await supabase.auth.getSession();
        setSession(sessionData.session);

        const aktif = (varData || []).filter(v => v.status === "Aktif");
        if (aktif.length > 0) {
            const enUcuz = aktif.reduce((prev, curr) => (curr.fiyat < prev.fiyat ? curr : prev), aktif[0]);
            if (enUcuz) {
                setSelectedKm(enUcuz.kilometre);
                setSelectedSure(enUcuz.sure);
            }
        }
        
        const initialImage = arac.cover_image
            ? `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${arac.cover_image.replace(/^\/+/, "")}`
            : "/placeholder.svg";
        setSelectedImage(initialImage);

        // Garaja eklenme durumunu kontrol et (opsiyonel, sayfa yüklendiğinde)
        if (sessionData.session?.user?.id) {
            checkIfInGarage(sessionData.session.user.id, arac.id);
        } else {
            const storedGarage = JSON.parse(localStorage.getItem("guest_garaj") || "[]");
            if (storedGarage.includes(arac.id)) {
                setIsVehicleAddedToGarage(true);
            }
        }

    } else {
        setVehicle(null); // Araç bulunamadı durumu
    }
  };


  useEffect(() => {
    fetchData();
  }, [params.id]);

  // Yorum ekleme fonksiyonu (mevcut)
  const handleAddComment = async () => {
    // ... (mevcut handleAddComment fonksiyonunuz) ...
    // Giriş kontrolü ve Supabase insert işlemi
    const { data: sessionData } = await supabase.auth.getSession(); // sessionData'yı burada tekrar almak daha güvenli
    const userId = sessionData.session?.user?.id;
    if (!userId) {
      toast({ title: "Giriş Yapmalısınız", description: "Yorum yapabilmek için giriş yapınız." });
      return;
    }

    const { error } = await supabase.from("yorumlar").insert([
      {
        user_id: userId,
        arac_id: params.id,
        yorum: newComment,
        puan: newRating,
      },
    ]);

    if (!error) {
      toast({ title: "Yorum Eklendi" });
      setNewComment("");
      setNewRating(5);
      fetchData(); // Yorum listesini güncelle
    } else {
      toast({ title: "Hata", description: error.message });
    }
  };

  // Garaja eklenme durumunu kontrol eden fonksiyon
  const checkIfInGarage = async (userId: string, vehicleId: string) => {
    const { data: existing } = await supabase
        .from("garaj")
        .select("id")
        .eq("user_id", userId)
        .eq("arac_id", vehicleId)
        .maybeSingle();
    if (existing) {
        setIsVehicleAddedToGarage(true);
    }
  };


  // Aracı garaja ekleme/çıkarma fonksiyonu (VehicleCard'daki gibi)
  const handleVehicleToggleGarage = async () => {
    if (!vehicle) return;

    setIsVehicleAddingToGarage(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    try {
        if (userId) {
            if (isVehicleAddedToGarage) { // Zaten ekliyse çıkar
                // await supabase.from("garaj").delete().match({ user_id: userId, arac_id: vehicle.id });
                // toast({ title: "Garajdan Çıkarıldı", description: `${vehicle.isim} garajınızdan çıkarıldı.` });
                // setIsVehicleAddedToGarage(false);
                // Şimdilik sadece ekleme var, çıkarma için üstteki yorumu açabilirsiniz.
                toast({ title: "Zaten Garajda", description: "Bu araç zaten garajınızda." });

            } else { // Ekle
                await supabase.from("garaj").insert([{ user_id: userId, arac_id: vehicle.id }]);
                toast({ title: "Garaja Eklendi", description: `${vehicle.isim} başarıyla garajınıza eklendi.` });
                setIsVehicleAddedToGarage(true);
            }
        } else { // Misafir kullanıcı için localStorage
            let stored: string[] = JSON.parse(localStorage.getItem("guest_garaj") || "[]");
            if (isVehicleAddedToGarage) {
                // stored = stored.filter(id => id !== vehicle.id);
                // toast({ title: "Garajdan Çıkarıldı", description: `${vehicle.isim} garajınızdan çıkarıldı.` });
                // setIsVehicleAddedToGarage(false);
                toast({ title: "Zaten Garajda", description: "Bu araç zaten garajınızda." });
            } else {
                if (!stored.includes(vehicle.id)) stored.push(vehicle.id);
                toast({ title: "Garaja Eklendi", description: `${vehicle.isim} başarıyla garajınıza eklendi.` });
                setIsVehicleAddedToGarage(true);
            }
            localStorage.setItem("guest_garaj", JSON.stringify(stored));
        }
    } catch (error) {
        const specificError = error as Error;
        toast({ title: "Hata", description: `Bir sorun oluştu: ${specificError.message}`, variant: "destructive" });
    } finally {
        setIsVehicleAddingToGarage(false);
    }
};


  // Fiyat ve varyasyon mantığı (mevcut)
  const activeVariations = variations.filter(v => v.status === "Aktif");
  const availableKms = [...new Set(activeVariations.map(v => v.kilometre))].sort((a, b) => parseInt(a) - parseInt(b));
  const availableSures = [...new Set(activeVariations.map(v => v.sure))].sort((a,b) => parseInt(a.split(" ")[0]) - parseInt(b.split(" ")[0]));
  
  const matchedVariation = activeVariations.find(v => v.kilometre === selectedKm && v.sure === selectedSure);
  
  const lowestPriceFromVariations = activeVariations.length > 0 
    ? activeVariations.reduce((min, v) => v.fiyat < min ? v.fiyat : min, activeVariations[0].fiyat)
    : null;

  const displayPrice = matchedVariation?.fiyat ?? lowestPriceFromVariations ?? vehicle?.fiyat ?? null;

  if (!vehicle) return <div className="flex items-center justify-center min-h-screen text-xl">Yükleniyor...</div>;

  const gallery = [vehicle.cover_image, ...(vehicle.gallery_images || [])].filter(Boolean) as string[];

  // Teknik özellikler listesi (örnek, kendi Vehicle interface'inize göre genişletin)
  const specs = [
    { label: "Marka", value: vehicle.brand, icon: <ShieldCheck size={18} className="text-[#6A3C96]" /> },
    { label: "Segment", value: vehicle.segment, icon: <Package size={18} className="text-[#6A3C96]" /> },
    { label: "Yakıt Türü", value: vehicle.yakit_turu, icon: <Fuel size={18} className="text-[#6A3C96]" /> },
    { label: "Vites", value: vehicle.vites, icon: <Settings2 size={18} className="text-[#6A3C96]" /> },
    { label: "Kasa Tipi", value: vehicle.bodyType, icon: <CarFront size={18} className="text-[#6A3C96]" /> },
    { label: "Durum", value: vehicle.durum, icon: <CalendarDays size={18} className="text-[#6A3C96]" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 lg:gap-8">
        {/* Sol Sütun (Görseller) - md:col-span-3 */}
        <div className="md:col-span-3">
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border bg-gray-100 shadow-sm mb-3">
            {selectedImage ? (
              <Image src={selectedImage} alt={vehicle.isim || "Araç Kapak Fotoğrafı"} fill className="object-contain p-2 sm:p-4" priority />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">Görsel Yok</div>
            )}
          </div>
          {gallery && gallery.length > 1 && (
            <div className="flex overflow-x-auto space-x-2 pb-2">
              {gallery.map((imgKey, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedImage(`https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${imgKey.replace(/^\/+/, "")}`)}
                  className={`shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden border-2 transition-all ${selectedImage?.includes(imgKey.replace(/^\/+/, "")) ? 'border-[#6A3C96] ring-2 ring-[#6A3C96]' : 'border-gray-200 hover:border-gray-400'}`}
                >
                  <Image 
                    src={`https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${imgKey.replace(/^\/+/, "")}`} 
                    alt={`Araç görseli ${i + 1}`} 
                    width={96} 
                    height={96} 
                    className="object-cover w-full h-full" 
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sağ Sütun (Bilgiler ve Eylemler) - md:col-span-2 */}
        <div className="md:col-span-2 flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">{vehicle.isim}</h1>
          <p className="text-sm text-gray-500 mb-3">{vehicle.kisa_aciklama || "Kısa açıklama bulunmuyor."}</p>
          
          <div className="text-[#6A3C96] text-2xl sm:text-3xl font-bold mb-4">
            {displayPrice ? `${displayPrice.toLocaleString('tr-TR')} ₺` : "Fiyat için seçim yapın"}
            <span className="text-xs font-normal text-gray-500 ml-1">/ Ay + KDV</span> {/* Fiyat formatı */}
          </div>

          {activeVariations.length > 0 && (
            <>
              <div className="mb-4">
                <label htmlFor="kmSelect" className="block text-sm font-medium text-gray-700 mb-1">Kilometre Limiti</label>
                <select id="kmSelect" className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:border-[#6A3C96] focus:ring focus:ring-[#6A3C96]/50" value={selectedKm} onChange={e => setSelectedKm(e.target.value)}>
                  <option value="" disabled>Seçiniz...</option>
                  {availableKms.map((km, i) => <option key={i} value={km}>{km} km</option>)}
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="sureSelect" className="block text-sm font-medium text-gray-700 mb-1">Süre</label>
                <select id="sureSelect" className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:border-[#6A3C96] focus:ring focus:ring-[#6A3C96]/50" value={selectedSure} onChange={e => setSelectedSure(e.target.value)}>
                  <option value="" disabled>Seçiniz...</option>
                  {availableSures.map((sure, i) => <option key={i} value={sure}>{sure}</option>)}
                </select>
              </div>
            </>
          )}
          
          {/* Ana Eylem Butonu (Masaüstü için) */}
          <div className="hidden md:block mt-auto"> {/* mt-auto sağ sütunda en alta iter */}
            <button 
                onClick={handleVehicleToggleGarage}
                disabled={isVehicleAddingToGarage}
                className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white transition-colors ${
                    isVehicleAddedToGarage 
                        ? "bg-green-500 hover:bg-green-600 cursor-default" 
                        : isVehicleAddingToGarage 
                            ? "bg-gray-400 cursor-wait" 
                            : "bg-[#6A3C96] hover:bg-[#58307d]"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A3C96]`}
            >
                {isVehicleAddedToGarage ? (
                    <CheckCircle2 size={20} className="mr-2"/>
                ) : isVehicleAddingToGarage ? (
                    <Loader2 size={20} className="mr-2 animate-spin"/>
                ) : (
                    <CarFront size={20} className="mr-2"/>
                )}
                {isVehicleAddedToGarage ? "Garajda" : isVehicleAddingToGarage ? "Ekleniyor..." : "Garaja Ekle"}
            </button>
          </div>
        </div>
      </div>

      {/* Teknik Özellikler */}
      <div className="mt-8 sm:mt-12 py-6 border-t border-b border-gray-200">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Teknik Özellikler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm">
          {specs.map(spec => (
            spec.value ? (
              <div key={spec.label} className="flex items-start">
                <span className="mr-2 pt-0.5">{spec.icon}</span>
                <div>
                  <span className="font-medium text-gray-600">{spec.label}:</span>
                  <span className="ml-1 text-gray-800">{spec.value}</span>
                </div>
              </div>
            ) : null
          ))}
        </div>
      </div>

      {/* Açıklama */}
      {vehicle.aciklama && (
        <div className="mt-8 sm:mt-12">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 border-b pb-2">Araç Açıklaması</h2>
          <div className="text-gray-700 prose prose-sm sm:prose-base max-w-none" dangerouslySetInnerHTML={{ __html: vehicle.aciklama }} />
        </div>
      )}

      {/* Yorumlar */}
      <div className="mt-8 sm:mt-12">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Değerlendirmeler ({comments.length})</h2>
        {comments.length === 0 && <p className="text-gray-600">Bu araç için henüz değerlendirme yapılmamış. İlk yorumu siz yapın!</p>}
        <div className="space-y-4">
            {comments.map((c) => (
            <div key={c.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-gray-800">{c.kullanici?.ad || "Kullanıcı"} {c.kullanici?.soyad || ""}</span>
                <div className="flex items-center text-sm text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className={i < c.puan ? "fill-current" : "stroke-current text-gray-300"}/>
                    ))}
                    <span className="ml-1 text-gray-600">({c.puan})</span>
                </div>
                </div>
                <p className="text-xs text-gray-500 mb-2">{new Date(c.created_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-gray-700 text-sm">{c.yorum}</p>
            </div>
            ))}
        </div>

        {/* Yorum Formu */}
        {session ? (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Değerlendirmenizi Ekleyin</h3>
            <textarea 
                className="w-full border-gray-300 rounded-md shadow-sm p-2 mb-2 focus:border-[#6A3C96] focus:ring focus:ring-[#6A3C96]/50" 
                rows={4} 
                placeholder="Yorumunuzu buraya yazın..." 
                value={newComment} 
                onChange={e => setNewComment(e.target.value)} 
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center">
                    <span className="text-sm text-gray-700 mr-2">Puanınız:</span>
                    <select 
                        className="border-gray-300 rounded-md shadow-sm p-2 focus:border-[#6A3C96] focus:ring focus:ring-[#6A3C96]/50" 
                        value={newRating} 
                        onChange={e => setNewRating(Number(e.target.value))}
                    >
                    {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>{r} Yıldız</option>
                    ))}
                    </select>
                </div>
                <button 
                    onClick={handleAddComment} 
                    className="bg-[#6A3C96] hover:bg-[#58307d] text-white px-5 py-2.5 rounded-md font-medium transition-colors text-sm"
                >
                    <Send size={16} className="inline mr-1.5" />
                    Yorumu Gönder
                </button>
            </div>
          </div>
        ) : (
            <p className="mt-6 text-sm text-gray-600">Yorum yapabilmek için lütfen <Link href="/giris" className="text-[#6A3C96] hover:underline font-medium">giriş yapın</Link>.</p>
        )}
      </div>

      {/* MOBİL İÇİN SABİT CTA BARI */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white p-3 border-t border-gray-200 shadow-top-md z-50">
        <div className="flex items-center justify-between gap-3">
            <div className="flex-shrink-0">
                <div className="text-[#6A3C96] text-lg font-bold">
                    {displayPrice ? `${displayPrice.toLocaleString('tr-TR')} ₺` : "Fiyat Seçin"}
                </div>
                <div className="text-xs text-gray-500 -mt-1">/ Ay + KDV</div>
            </div>
            <button 
                onClick={handleVehicleToggleGarage}
                disabled={isVehicleAddingToGarage}
                className={`w-auto flex-grow flex items-center justify-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
                    isVehicleAddedToGarage 
                        ? "bg-green-500 hover:bg-green-600 cursor-default" 
                        : isVehicleAddingToGarage 
                            ? "bg-gray-400 cursor-wait" 
                            : "bg-[#6A3C96] hover:bg-[#58307d]"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A3C96]`}
            >
                 {isVehicleAddedToGarage ? (
                    <CheckCircle2 size={18} className="mr-1.5"/>
                ) : isVehicleAddingToGarage ? (
                    <Loader2 size={18} className="mr-1.5 animate-spin"/>
                ) : (
                    <CarFront size={18} className="mr-1.5"/>
                )}
                {isVehicleAddedToGarage ? "Garajda" : isVehicleAddingToGarage ? "Ekleniyor..." : "Garaja Ekle"}
            </button>
        </div>
      </div>
    </div>
  );
}
