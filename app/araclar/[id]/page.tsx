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
  // İhtiyaç duyacağımız ikonlar bunlar ve daha fazlası olabilir.
} from "lucide-react";

// Interface'ler (önceki gibi)
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

// Yardımcı İkon Bileşeni (önceki gibi)
const SpecIcon = ({ iconName }: { iconName?: string }) => {
  switch (iconName?.toLowerCase()) {
    case "yakıt": case "yakit_turu": return <Fuel size={16} className="text-gray-600" />; // Boyut ve renk ayarlandı
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
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [comments, setComments] = useState<Comment[]>([]); // Yorumlar için state
  const [session, setSession] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedKm, setSelectedKm] = useState<string>("");
  const [selectedSure, setSelectedSure] = useState<string>("");
  const [newComment, setNewComment] = useState<string>("");     // Yorumlar için state
  const [newRating, setNewRating] = useState<number>(5);      // Yorumlar için state
  const [isVehicleAddingToGarage, setIsVehicleAddingToGarage] = useState<boolean>(false);
  const [isVehicleAddedToGarage, setIsVehicleAddedToGarage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkIfInGarage = async (userId: string, vehicleId: string) => {
    try {
      const { data: existing, error } = await supabase
        .from("garaj")
        .select("id")
        .eq("user_id", userId)
        .eq("arac_id", vehicleId)
        .maybeSingle();
      if (error) {
        console.error("Garaj durumu kontrol hatası:", error); return;
      }
      setIsVehicleAddedToGarage(!!existing);
    } catch (checkError) {
        console.error("checkIfInGarage içinde genel hata:", checkError);
    }
  };
  
  const fetchData = async () => {
    setIsLoading(true);
    setVehicle(null); setVariations([]); setComments([]); setSelectedImage(null);
    setSelectedKm(""); setSelectedSure(""); setIsVehicleAddedToGarage(false);

    try {
      if (!params.id) {
        console.error("Araç ID bulunamadı.");
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
        setComments(yorumlarData || []); // Yorumları state'e ata

        const { data: sessionDataVal, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setSession(sessionDataVal.session);

        const aktif = (varData || []).filter(v => v.status === "Aktif");
        if (aktif.length > 0) {
          const enUcuz = aktif.reduce((prev, curr) => (curr.fiyat < prev.fiyat ? curr : prev), aktif[0]);
          if (enUcuz) {
            setSelectedKm(enUcuz.kilometre);
            setSelectedSure(enUcuz.sure);
          }
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
        setVehicle(null);
        toast({title: "Araç Bulunamadı", variant: "destructive"});
      }
    } catch (error) {
        const specificError = error as Error;
        console.error("FetchData Hata:", specificError);
        setVehicle(null);
        toast({title: "Veri Yükleme Hatası", description: `Detaylar: ${specificError.message}`, variant: "destructive"});
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  // handleAddComment, handleVehicleToggleGarage, handleRentNow fonksiyonları
  // Bir önceki tam kodunuzdaki gibi buraya eklenecek.
  // Onları da ekleyelim:

  const handleAddComment = async () => {
    if (!session?.user) { // session.user üzerinden kontrol
      toast({ title: "Giriş Yapmalısınız", description: "Yorum yapabilmek için giriş yapınız." }); return;
    }
    if (!newComment.trim()) {
      toast({ title: "Uyarı", description: "Yorum alanı boş bırakılamaz.", variant: "destructive" }); return;
    }
    const { error } = await supabase.from("yorumlar").insert([{ user_id: session.user.id, arac_id: params.id, yorum: newComment, puan: newRating }]);
    if (!error) {
      toast({ title: "Yorum Eklendi" });
      setNewComment(""); setNewRating(5);
      await fetchData(); // Yorumları ve diğer verileri tazeleyebiliriz.
    } else {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    }
  };

  const handleVehicleToggleGarage = async () => {
    if (!vehicle) return;
    setIsVehicleAddingToGarage(true);
    const userId = session?.user?.id; // session state'inden alalım
    try {
      if (userId) {
        if (isVehicleAddedToGarage) {
          toast({ title: "Zaten Garajda" }); 
        } else {
          const {error} = await supabase.from("garaj").insert([{ user_id: userId, arac_id: vehicle.id }]);
          if (error) throw error;
          toast({ title: "Garaja Eklendi", description: `${vehicle.isim} garajınıza eklendi.` });
          setIsVehicleAddedToGarage(true);
        }
      } else { // Misafir kullanıcı
        let stored: string[] = JSON.parse(localStorage.getItem("guest_garaj") || "[]");
        if (isVehicleAddedToGarage) {
           toast({ title: "Zaten Garajda" });
        } else {
          if (!stored.includes(vehicle.id)) stored.push(vehicle.id);
          toast({ title: "Garaja Eklendi", description: `${vehicle.isim} garajınıza eklendi.` });
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
  
  const handleRentNow = () => {
    toast({ title: "Hemen Kirala", description: "Kiralama işlem adımları burada başlayacak."});
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

  // vehicle null değilse bu değişkenler burada güvenle tanımlanabilir.
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
  ].filter(spec => spec.value && spec.value !== "N/A");

  // ----- JSX BAŞLANGICI (Ana return) -----
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#6A3C96] transition-colors">Ana Sayfa</Link>
          <span className="mx-2">/</span>
          <Link href="/araclar" className="hover:text-[#6A3C96] transition-colors">Kiralık Araçlar</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">{vehicle.brand || ""} {vehicleDisplayName?.replace(vehicle.brand || "", "").trim()}</span>
        </nav>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0"> {/* Sütunlar arası boşluk yok */}
            
            {/* Sol Sütun: Görseller */}
            <div className="lg:col-span-3">
                <div className="relative w-full aspect-[16/10] bg-gray-100 group overflow-hidden">
                {selectedImage ? (
                    <Image 
                        src={selectedImage} 
                        alt={vehicle.isim || "Araç Kapak Fotoğrafı"} 
                        layout="fill" 
                        objectFit="contain" // contain daha iyi olabilir, resmin tamamı görünür
                        className="p-1 transition-transform duration-500 ease-in-out group-hover:scale-105" 
                        priority 
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">Görsel Yok</div>
                )}
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
                        width={80} 
                        height={80} 
                        className="object-cover w-full h-full" 
                        />}
                    </button>
                    ))}
                </div>
                )}
            </div>

            {/* Sağ Sütun: Bilgiler ve Eylemler */}
            <div className="lg:col-span-2 p-6 sm:p-8 flex flex-col bg-white">
                <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 leading-tight">
                    {vehicleDisplayName}
                    {localYear && <span className="text-xl text-gray-500 font-medium ml-2">{`- ${localYear}`}</span>}
                </h1>
                {vehicle.kisa_aciklama && <p className="text-base text-gray-600 mt-2 mb-4 leading-relaxed">{vehicle.kisa_aciklama}</p>}

                {keySpecs.length > 0 && (
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-700 my-4 py-3 border-t border-b border-gray-200">
                        {keySpecs.map(spec => (
                            <div key={spec.label} className="flex items-center" title={spec.label}>
                                <SpecIcon iconName={spec.iconName} />
                                <span className="ml-1.5 font-medium">{spec.value}</span>
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
                
                <div className="my-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow">
                    <div className="text-gray-700 text-sm font-medium mb-1">Aylık Kiralama Bedeli:</div>
                    <div className="text-[#6A3C96] text-3xl lg:text-4xl font-extrabold">
                        {displayPrice ? `${displayPrice.toLocaleString('tr-TR')} ₺` : (activeVariations.length > 0 ? "Seçim Yapınız" : "Fiyat Bilgisi Yok")}
                    </div>
                    <div className="text-xs font-medium text-gray-500 ml-0.5 mt-0.5">+ KDV / Ay</div>
                </div>
                
                <div className="mt-auto space-y-3 pt-4"> {/* Butonları en alta iter */}
                    <button 
                        onClick={handleRentNow}
                        className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-[#6A3C96] hover:bg-[#58307d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A3C96] transition-all duration-150 ease-in-out transform hover:scale-[1.02]"
                    >
                        <CreditCard size={20} className="mr-2.5"/>
                        Hemen Kirala
                    </button>
                    <button 
                        onClick={handleVehicleToggleGarage}
                        disabled={isVehicleAddingToGarage || isVehicleAddedToGarage}
                        className={`w-full flex items-center justify-center px-6 py-3 border rounded-lg shadow-sm text-base font-medium transition-all duration-150 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A3C96] ${
                            isVehicleAddedToGarage 
                                ? "bg-green-500 text-white border-green-500 cursor-not-allowed hover:bg-green-600" 
                                : isVehicleAddingToGarage 
                                    ? "bg-gray-200 text-gray-500 border-gray-300 cursor-wait" 
                                    : "bg-white text-[#6A3C96] border-gray-300 hover:bg-[#6A3C96]/10 hover:border-[#6A3C96]"
                        }`}
                    >
                        {isVehicleAddedToGarage ? ( <CheckCircle2 size={20} className="mr-2"/> ) 
                        : isVehicleAddingToGarage ? ( <Loader2 size={20} className="mr-2 animate-spin"/> ) 
                        : ( <CarFront size={20} className="mr-2"/> )}
                        {isVehicleAddedToGarage ? "Garajda" : isVehicleAddingToGarage ? "Ekleniyor..." : "Garaja Ekle"}
                    </button>
                </div>
            </div>
            </div>
        </div>

        {/* ŞİMDİLİK DİĞER BÖLÜMLER (Teknik Özellikler, Açıklama, Yorumlar) VE MOBİL STICKY BAR BU ADIMDA YOK */}
        {/* ÖNCE BU KADARININ SORUNSUZ ÇALIŞTIĞINDAN EMİN OLALIM */}
        <div className="mt-8 p-6 bg-white shadow-lg rounded-lg">
            <p className="text-center text-gray-600">
                Detaylı teknik özellikler, araç açıklaması ve kullanıcı yorumları bir sonraki adımda eklenecektir.
            </p>
        </div>

      </div>
    </div>
  );
}
