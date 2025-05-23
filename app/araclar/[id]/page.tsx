// app/araclar/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import {
  Star, Fuel, Settings2, CalendarDays, Package, ShieldCheck, MessageCircle, Send,
  CarFront, Loader2, CheckCircle2, CreditCard, HelpCircle, FileText, Users, QrCode,
  Home, 
  Warehouse 
} from "lucide-react";

// Interface'ler
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
  kullanici?: { ad: string; soyad: string };
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
  kisi_kapasitesi?: string;
}

interface Props {
  params: { id: string };
}

// Yardımcı İkon Bileşeni
const SpecIcon = ({ iconName }: { iconName?: string }) => {
  switch (iconName?.toLowerCase()) {
    case "yakıt": case "yakit_turu": return <Fuel size={16} className="text-gray-600" />;
    case "vites": return <Settings2 size={16} className="text-gray-600" />;
    case "kapasite": case "kisi_kapasitesi": return <Users size={16} className="text-gray-600" />;
    case "segment": return <Package size={16} className="text-gray-600" />;
    case "marka": return <ShieldCheck size={16} className="text-gray-600" />;
    case "kasa tipi": case "bodytype": return <CarFront size={16} className="text-gray-600" />;
    case "durum": return <CalendarDays size={16} className="text-gray-600" />;
    case "stok_kodu": return <QrCode size={16} className="text-gray-600" />;
    default: return <HelpCircle size={16} className="text-gray-500" />;
  }
};

export default function Page({ params }: Props) {
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

  const checkIfInGarage = async (userId: string, vehicleId: string) => {
    try {
      const { data: existing, error } = await supabase.from("garaj").select("id").eq("user_id", userId).eq("arac_id", vehicleId).maybeSingle();
      if (error) { console.error("Garaj durumu kontrol hatası:", error); return; }
      setIsVehicleAddedToGarage(!!existing);
    } catch (checkError) { console.error("checkIfInGarage genel hata:", checkError); }
  };
  
  const fetchData = async () => {
    setIsLoading(true);
    setVehicle(null); setVariations([]); setComments([]); setSelectedImage(null);
    setSelectedKm(""); setSelectedSure(""); setIsVehicleAddedToGarage(false); 

    try {
      if (!params.id) {
        toast({ title: "Hata", description: "Araç ID'si bulunamadı.", variant: "destructive" });
        setIsLoading(false); return;
      }
      const { data: aracData, error: aracError } = await supabase.from("Araclar").select("*").eq("id", params.id).maybeSingle();
      if (aracError) throw aracError;

      if (aracData) {
        const arac = aracData as Vehicle;
        setVehicle(arac);
        const { data: varData, error: varError } = await supabase.from("variations").select("*").eq("arac_id", params.id);
        if (varError) throw varError;
        setVariations(varData || []);
        const { data: yorumlarData, error: yorumError } = await supabase.from("yorumlar").select("*, kullanici:kullanicilar(ad,soyad)").eq("arac_id", params.id).order("created_at", { ascending: false });
        if (yorumError) throw yorumError;
        setComments(yorumlarData || []); // Yorumlar state'e atanıyor
        const { data: sessionDataVal, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setSession(sessionDataVal.session);
        const aktif = (varData || []).filter(v => v.status === "Aktif");
        if (aktif.length > 0) {
          const enUcuz = aktif.reduce((prev, curr) => (curr.fiyat < prev.fiyat ? curr : prev), aktif[0]);
          if (enUcuz) { setSelectedKm(enUcuz.kilometre); setSelectedSure(enUcuz.sure); }
        }
        const initialImage = arac.cover_image ? `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${arac.cover_image.replace(/^\/+/, "")}` : "/placeholder.svg";
        setSelectedImage(initialImage);
        
        if (sessionDataVal.session?.user?.id && arac) {
          await checkIfInGarage(sessionDataVal.session.user.id, arac.id);
        } else if (arac) {
          const storedGarage = JSON.parse(localStorage.getItem("guest_garaj") || "[]") as string[];
          if (storedGarage.includes(arac.id)) setIsVehicleAddedToGarage(true);
        }
      } else {
        setVehicle(null); toast({title: "Araç Bulunamadı", variant: "destructive"});
      }
    } catch (error) {
        const specificError = error as Error;
        console.error("FetchData Hata:", specificError); setVehicle(null);
        toast({title: "Veri Yükleme Hatası", description: `Detaylar: ${specificError.message}`, variant: "destructive"});
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const handleAddComment = async () => {
    if (!session?.user) {
      toast({ title: "Giriş Yapmalısınız", description: "Yorum yapabilmek için giriş yapınız." }); return;
    }
    if (!newComment.trim()) {
      toast({ title: "Uyarı", description: "Yorum alanı boş bırakılamaz.", variant: "destructive" }); return;
    }
    const { error } = await supabase.from("yorumlar").insert([{ user_id: session.user.id, arac_id: params.id, yorum: newComment, puan: newRating }]);
    if (!error) {
      toast({ title: "Yorum Eklendi" });
      setNewComment(""); setNewRating(5);
      await fetchData(); // Yorum listesini ve diğer verileri tazelemek için
    } else {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    }
  };

  const handleVehicleToggleGarage = async () => {
    if (!vehicle) return;
    setIsVehicleAddingToGarage(true);
    const userId = session?.user?.id;
    try {
      if (userId) {
        if (isVehicleAddedToGarage) {
          const { error: deleteError } = await supabase.from("garaj").delete().match({ user_id: userId, arac_id: vehicle.id });
          if (deleteError) throw deleteError;
          toast({ title: "Garajdan Çıkarıldı", description: `${vehicle.isim} garajınızdan çıkarıldı.` });
          setIsVehicleAddedToGarage(false);
        } else {
          const {error: insertError} = await supabase.from("garaj").insert([{ user_id: userId, arac_id: vehicle.id }]);
          if (insertError) throw insertError;
          toast({ title: "Garaja Eklendi", description: `${vehicle.isim} başarıyla garajınıza eklendi.` });
          setIsVehicleAddedToGarage(true);
        }
      } else { 
        let stored: string[] = JSON.parse(localStorage.getItem("guest_garaj") || "[]");
        if (isVehicleAddedToGarage) {
          stored = stored.filter(id => id !== vehicle.id);
          toast({ title: "Garajdan Çıkarıldı", description: `${vehicle.isim} garajınızdan çıkarıldı.` });
          setIsVehicleAddedToGarage(false);
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
  
  if (isLoading) { 
    return <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-xl"><Loader2 className="mr-2 h-6 w-6 animate-spin text-[#6A3C96]" /> Yükleniyor...</div>;
  }
  if (!vehicle) { 
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-xl p-6 text-center">
            <p className="text-red-500 font-semibold mb-2">Araç Bilgisi Bulunamadı!</p>
            <p className="text-gray-600 text-base">Aradığınız araç mevcut değil veya bir sorun oluştu.</p>
            <Link href="/araclar" className="mt-6 px-6 py-2 bg-[#6A3C96] text-white rounded-md hover:bg-[#58307d] transition-colors">
                Tüm Araçlara Göz At
            </Link>
        </div>
    );
  }

  const activeVariations = variations.filter(v => v.status === "Aktif");
  const availableKms = [...new Set(activeVariations.map(v => v.kilometre))].sort((a, b) => parseInt(a) - parseInt(b));
  const availableSures = [...new Set(activeVariations.map(v => v.sure))].sort((a,b) => parseInt(a.split(" ")[0]) - parseInt(b.split(" ")[0]));
  const matchedVariation = activeVariations.find(v => v.kilometre === selectedKm && v.sure === selectedSure);
  const lowestPriceFromVariations = activeVariations.length > 0 ? Math.min(...activeVariations.map(v => v.fiyat)) : null;
  const displayPrice = matchedVariation?.fiyat ?? lowestPriceFromVariations ?? vehicle.fiyat ?? null;
  const gallery = [vehicle.cover_image, ...(vehicle.gallery_images || [])].filter(imgKey => typeof imgKey === 'string' && imgKey.trim() !== '') as string[];
  const localYear = vehicle.isim.includes(" - ") ? vehicle.isim.split(" - ").pop()?.trim() : undefined;
  const vehicleDisplayName = localYear ? vehicle.isim.substring(0, vehicle.isim.lastIndexOf(` - ${localYear}`)) : vehicle.isim;

  const keySpecs = [
    { label: "Vites", value: vehicle.vites, iconName: "vites" },
    { label: "Yakıt", value: vehicle.yakit_turu, iconName: "yakit_turu" },
    { label: "Kapasite", value: vehicle.kisi_kapasitesi || "N/A", iconName: "kisi_kapasitesi" },
    { label: "Segment", value: vehicle.segment, iconName: "segment" },
    { label: "Stok Kodu", value: vehicle.stok_kodu, iconName: "stok_kodu"},
  ].filter(spec => spec.value && spec.value !== "N/A");

  const allSpecs = [ 
    { label: "Marka", value: vehicle.brand, iconName: "marka" },
    { label: "Segment", value: vehicle.segment, iconName: "segment" },
    { label: "Yakıt Türü", value: vehicle.yakit_turu, iconName: "yakit_turu" },
    { label: "Vites", value: vehicle.vites, iconName: "vites" },
    { label: "Kasa Tipi", value: vehicle.bodyType, iconName: "bodyType" },
    { label: "Kişi Kapasitesi", value: vehicle.kisi_kapasitesi, iconName: "kisi_kapasitesi"},
    // Stok Kodu "allSpecs" listesinden çıkarıldı, sadece keySpecs'te olacak
    { label: "Durum", value: vehicle.durum, iconName: "durum" },
  ].filter(spec => spec.value);


  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#6A3C96] transition-colors">Ana Sayfa</Link>
          <span className="mx-2">/</span>
          <Link href="/araclar" className="hover:text-[#6A3C96] transition-colors">Kiralık Araçlar</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">{vehicle.brand || ""} {vehicleDisplayName?.replace(vehicle.brand || "", "").trim()}</span>
        </nav>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
            <div className="lg:col-span-3">
                <div className="relative w-full aspect-[16/10] bg-gray-100 group overflow-hidden">
                {selectedImage ? (
                    <Image 
                        src={selectedImage} 
                        alt={vehicle.isim || "Araç Kapak Fotoğrafı"} 
                        layout="fill" 
                        objectFit="contain"
                        className="p-1 transition-transform duration-500 ease-in-out group-hover:scale-105" 
                        priority 
                    />
                ) : ( <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">Görsel Yok</div> )}
                </div>
                {gallery && gallery.length > 1 && (
                <div className="flex overflow-x-auto space-x-2 p-3 bg-gray-50 border-t border-gray-200">
                    {gallery.map((imgKey, i) => (
                    <button 
                        key={imgKey || i} 
                        onClick={() => imgKey && setSelectedImage(`https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${imgKey.replace(/^\/+/, "")}`)}
                        className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none ${selectedImage?.includes(imgKey?.replace(/^\/+/, "") || '###_NO_MATCH_###') ? 'border-[#6A3C96] ring-2 ring-[#6A3C96]/50' : 'border-gray-300 hover:border-[#6A3C96]'}`}
                    >
                        {imgKey && <Image 
                        src={`https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${imgKey.replace(/^\/+/, "")}`} 
                        alt={`Araç küçük görsel ${i + 1}`} 
                        width={80} height={80} className="object-cover w-full h-full" />}
                    </button>
                    ))}
                </div>
                )}
            </div>

            <div className="lg:col-span-2 p-6 sm:p-8 flex flex-col bg-white">
                <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 leading-tight">
                    {vehicleDisplayName}
                    {localYear && <span className="text-xl text-gray-500 font-medium ml-2">{`- ${localYear}`}</span>}
                </h1>
                {vehicle.kisa_aciklama && <p className="text-base text-gray-600 mt-2 mb-4 leading-relaxed">{vehicle.kisa_aciklama}</p>}

                {keySpecs.length > 0 && (
                    <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-700 my-4 py-3 border-t border-b border-gray-200">
                        {keySpecs.map(spec => (
                            <div key={spec.label} className="flex items-center" title={spec.label}>
                                <SpecIcon iconName={spec.iconName} />
                                <span className="ml-1 font-medium">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                )}

                {activeVariations.length > 0 && ( 
                  <>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-5">
                        <div>
                            <label htmlFor="kmSelect" className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">KM Limiti</label>
                            <select id="kmSelect" className="w-full text-sm border-gray-300 rounded-md shadow-sm px-3 py-2.5 focus:border-[#6A3C96] focus:ring-1 focus:ring-[#6A3C96]" value={selectedKm} onChange={e => setSelectedKm(e.target.value)}>
                            <option value="" disabled>Seçin</option>
                            {availableKms.map((km, i) => <option key={i} value={km}>{km} km</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="sureSelect" className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Süre</label>
                            <select id="sureSelect" className="w-full text-sm border-gray-300 rounded-md shadow-sm px-3 py-2.5 focus:border-[#6A3C96] focus:ring-1 focus:ring-[#6A3C96]" value={selectedSure} onChange={e => setSelectedSure(e.target.value)}>
                            <option value="" disabled>Seçin</option>
                            {availableSures.map((sure, i) => <option key={i} value={sure}>{sure}</option>)}
                            </select>
                        </div>
                    </div>
                  </>
                )}
                
                <div className="my-4 p-5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow text-center">
                    <div className="text-gray-700 text-sm font-medium mb-2">Aylık Kiralama Bedeli:</div>
                    <div className="flex justify-center items-baseline">
                        <span className="text-[#6A3C96] text-4xl lg:text-5xl font-extrabold">
                            {displayPrice ? `${displayPrice.toLocaleString('tr-TR')} ₺` : (activeVariations.length > 0 ? "Seçim Yapınız" : "Fiyat Bilgisi Yok")}
                        </span>
                        <span className="text-sm font-medium text-gray-500 ml-1.5"> + KDV / Ay</span>
                    </div>
                </div>
                
                <div className="mt-auto space-y-3 pt-4"> 
                    <button 
                        onClick={handleVehicleToggleGarage}
                        disabled={isVehicleAddingToGarage}
                        className={`w-full flex items-center justify-center px-6 py-2.5 border rounded-lg shadow-sm text-sm font-semibold transition-all duration-150 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-1 text-white bg-[#6A3C96] hover:bg-[#58307d] border-transparent focus:ring-[#6A3C96] ${
                            isVehicleAddedToGarage 
                                ? "!bg-green-500 !text-white !border-green-600 hover:!bg-green-600 cursor-default" 
                                : isVehicleAddingToGarage 
                                    ? "!bg-gray-300 !text-gray-500 !border-gray-400 cursor-wait" 
                                    : "" 
                        }`}
                    >
                        {isVehicleAddedToGarage ? ( <CheckCircle2 size={18} className="mr-2"/> ) 
                        : isVehicleAddingToGarage ? ( <Loader2 size={18} className="mr-2 animate-spin"/> ) 
                        : ( <CarFront size={18} className="mr-2"/> )}
                        {isVehicleAddedToGarage ? "Garajda" : isVehicleAddingToGarage ? "Ekleniyor..." : "Garaja Ekle"}
                    </button>
                    <Link
                        href="/garaj" 
                        className="w-full flex items-center justify-center px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[#6A3C96] hover:bg-[#58307d] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#6A3C96] transition-all duration-150 ease-in-out"
                    >
                        <Warehouse size={18} className="mr-2.5"/> 
                        Garaja Git 
                    </Link>
                    <Link
                        href="/araclar" 
                        className="w-full flex items-center justify-center px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[#6A3C96] hover:bg-[#58307d] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#6A3C96] transition-all duration-150 ease-in-out"
                    >
                        <Home size={18} className="mr-2.5"/> 
                        Tüm Araçları Gör
                    </Link>
                </div>
            </div>
            </div>
        </div>

      {/* DETAYLI BİLGİ BÖLÜMLERİ (Teknik Özellikler, Açıklama, Yorumlar) */}
      <div className="mt-8 sm:mt-10 bg-white shadow-xl rounded-lg p-6 sm:p-8">
        <section id="teknik-ozellikler" className="mb-10">
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-200 flex items-center">
                <Settings2 size={22} className="mr-3 text-[#6A3C96]" /> Teknik Özellikler
            </h2>
            {allSpecs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm">
                {allSpecs.map(spec => (
                    <div key={spec.label} className="flex items-start py-1">
                    <span className="mr-2.5 pt-0.5 shrink-0"><SpecIcon iconName={spec.iconName} /></span>
                    <div>
                        <span className="block font-medium text-gray-500">{spec.label}</span>
                        <span className="text-gray-800 font-semibold">{spec.value}</span>
                    </div>
                    </div>
                ))}
                </div>
            ) : <p className="text-gray-600">Bu araç için detaylı teknik özellik girilmemiş.</p>}
        </section>

        {vehicle.aciklama && (
            <section id="aciklama" className="mb-10 pt-6 border-t border-gray-200">
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-200 flex items-center">
                <FileText size={22} className="mr-3 text-[#6A3C96]" /> Araç Açıklaması
            </h2>
            <div className="text-gray-700 prose prose-sm sm:prose-base max-w-none leading-relaxed" dangerouslySetInnerHTML={{ __html: vehicle.aciklama }} />
            </section>
        )}

        {/* YORUMLAR BÖLÜMÜ JSX'İ GERİ EKLENDİ */}
        <section id="degerlendirmeler" className="pt-6 border-t border-gray-200">
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200 flex items-center">
                <MessageCircle size={22} className="mr-3 text-[#6A3C96]" /> Değerlendirmeler ({comments.length})
            </h2>
            {comments.length === 0 && <p className="text-gray-600 mb-6 text-center py-4 bg-gray-50 rounded-md">Bu araç için henüz değerlendirme yapılmamış. İlk yorumu siz yapın!</p>}
            <div className="space-y-6">
                {comments.map((c) => (
                <article key={c.id} className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-1.5">
                        <span className="font-semibold text-gray-800 text-base">{c.kullanici?.ad || "Kullanıcı"} {c.kullanici?.soyad || ""}</span>
                        <div className="flex items-center text-sm text-yellow-400 mt-1 sm:mt-0">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={18} className={i < c.puan ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-300"}/>
                            ))}
                            <span className="ml-2 text-gray-600 font-medium">({c.puan}.0)</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2.5">{new Date(c.created_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{c.yorum}</p>
                </article>
                ))}
            </div>

            {/* Yorum Formu */}
            {session ? (
            <div className="mt-10 pt-6 border-t border-gray-300">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Değerlendirmenizi Ekleyin</h3>
                <textarea 
                    className="w-full border-gray-300 rounded-lg shadow-sm p-3 mb-3 focus:border-[#6A3C96] focus:ring-1 focus:ring-[#6A3C96] text-sm transition-colors" 
                    rows={4} 
                    placeholder="Araç hakkındaki düşüncelerinizi paylaşın..." 
                    value={newComment} 
                    onChange={e => setNewComment(e.target.value)} 
                />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-3">
                    <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700 mr-3">Puanınız:</span>
                        <div className="flex space-x-1">
                            {[5, 4, 3, 2, 1].map((r) => (
                                <button 
                                    key={r} 
                                    onClick={() => setNewRating(r)} 
                                    title={`${r} Yıldız`}
                                    className={`p-2 rounded-full transition-all duration-150 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 ${newRating === r ? 'bg-[#6A3C96] text-yellow-400 shadow-md focus:ring-[#58307d]' : 'bg-gray-200 text-gray-500 hover:bg-gray-300 focus:ring-gray-400'}`}
                                >
                                    <Star size={20} className={newRating === r ? "fill-yellow-400" : "fill-transparent stroke-current"}/>
                                </button>
                            ))}
                        </div>
                    </div>
                    <button 
                        onClick={handleAddComment} 
                        disabled={!newComment.trim() || newComment.length < 10}
                        className="bg-[#6A3C96] hover:bg-[#58307d] text-white px-6 py-2.5 rounded-lg font-semibold transition-colors text-sm flex items-center justify-center sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <Send size={16} className="inline mr-2" />
                        Yorumu Gönder
                    </button>
                </div>
            </div>
            ) : (
                <p className="mt-10 pt-6 border-t border-gray-300 text-sm text-gray-600 text-center">
                    Yorum yapabilmek için lütfen <Link href="/giris" className="text-[#6A3C96] hover:underline font-semibold">giriş yapın</Link> veya <Link href="/kayit" className="text-[#6A3C96] hover:underline font-semibold">kayıt olun</Link>.
                </p>
            )}
        </section>
      </div>

      {/* MOBİL İÇİN SABİT CTA BARI */}
      <div className="md:hidden sticky bottom-0 left-0 right-0 bg-white p-3 border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] z-50">
        <div className="flex items-center justify-between gap-3">
            <div className="flex-shrink-0 text-left">
                <div className="flex items-baseline">
                    <span className="text-[#6A3C96] text-lg font-bold leading-tight">
                        {typeof displayPrice === "number" ? `${displayPrice.toLocaleString('tr-TR')} ₺` : "Fiyat Seçin"}
                    </span>
                    <span className="text-xs text-gray-500 font-normal ml-1"> + KDV / Ay</span>
                </div>
            </div>
            <button 
                onClick={handleVehicleToggleGarage}
                disabled={isVehicleAddingToGarage}
                className={`w-auto flex-grow flex items-center justify-center px-4 py-2.5 border rounded-md shadow-sm text-sm font-semibold transition-colors text-white bg-[#6A3C96] hover:bg-[#58307d] border-transparent focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#6A3C96] ${
                    isVehicleAddedToGarage 
                        ? "!bg-green-500 hover:!bg-green-600 cursor-default" 
                        : isVehicleAddingToGarage 
                            ? "!bg-gray-300 !text-gray-500 !border-gray-400 cursor-wait" 
                            : ""
                }`}
            >
                {isVehicleAddedToGarage ? ( <CheckCircle2 size={18} className="mr-1.5"/> ) 
                : isVehicleAddingToGarage ? ( <Loader2 size={18} className="mr-1.5 animate-spin"/> ) 
                : ( <CarFront size={18} className="mr-1.5"/> )}
                {isVehicleAddedToGarage ? "Garajda" : isVehicleAddingToGarage ? "Ekleniyor..." : "Garaja Ekle"}
            </button>
        </div>
      </div>
    </div>
  </div>
  );
}
