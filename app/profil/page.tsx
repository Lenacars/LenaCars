"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, LogOut, Trash2, UploadCloud, Info, CreditCard, UserCircle, Star, FileText, FileUp, KeyRound } from "lucide-react"; // İkonlar eklendi
import Link from "next/link";
import clsx from "clsx";

// Sekme ikonlarını ve anahtarlarını tanımla
const tabs = [
  { key: "account", label: "Hesap Bilgileri", icon: <UserCircle className="w-4 h-4 mr-2" /> },
  { key: "favorites", label: "Favorilerim", icon: <Star className="w-4 h-4 mr-2" /> },
  { key: "offers", label: "Tekliflerim", icon: <FileText className="w-4 h-4 mr-2" /> },
  { key: "documents", label: "Evraklarım", icon: <FileUp className="w-4 h-4 mr-2" /> },
  { key: "payment", label: "Ödeme Yap", icon: <CreditCard className="w-4 h-4 mr-2" /> },
  { key: "password", label: "Şifre Değiştir", icon: <KeyRound className="w-4 h-4 mr-2" /> },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("account");
  const [userData, setUserData] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(""); // Genel mesajlar için
  const [passwordMessage, setPasswordMessage] = useState(""); // Şifre değiştirme mesajları için
  const [paymentMessage, setPaymentMessage] = useState(""); // Ödeme mesajları için
  const [amount, setAmount] = useState("");
  const [iframeSrc, setIframeSrc] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Sayfa yükleme durumu

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (sessionError || !userId) {
      console.error("Oturum hatası veya kullanıcı ID yok:", sessionError?.message);
      // Kullanıcıyı giriş sayfasına yönlendir
      window.location.href = "/giris";
      return;
    }

    try {
      const [profileRes, favsRes, pdfsRes, evraksRes] = await Promise.all([
        supabase.from("kullanicilar").select("*").eq("id", userId).single(),
        supabase.from("favoriler").select("*, araclar(id, title, slug)").eq("user_id", userId), // araclar.slug eklendi
        supabase.from("pdfteklifler").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
        supabase.from("evraklar").select("*").eq("user_id", userId).order("created_at", { ascending: false })
      ]);

      if (profileRes.error) throw profileRes.error;
      setUserData(profileRes.data);

      setFavorites(favsRes.data || []);
      setOffers(pdfsRes.data || []);
      setDocuments(evraksRes.data || []);

    } catch (error: any) {
        console.error("Profil verileri çekilirken hata:", error.message);
        // Hata durumunda kullanıcıya bilgi verilebilir
    } finally {
        setIsLoading(false);
    }
  };


  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handlePasswordChange = async () => {
    setPasswordMessage(""); // Önceki şifre mesajlarını temizle
    const { data: sessionData } = await supabase.auth.getSession();
    const email = sessionData.session?.user?.email;
    if (!email || !oldPassword || !newPassword) {
      setPasswordMessage("Lütfen tüm şifre alanlarını doldurun.");
      return;
    }
    if (newPassword.length < 6) {
        setPasswordMessage("Yeni şifre en az 6 karakter olmalıdır.");
        return;
    }

    // Mevcut şifreyi doğrulamak için Supabase'e gitmeye gerek yok,
    // updateUser zaten mevcut şifre doğruysa çalışır.
    // Ancak, eski şifreyi backend'de doğrulamak daha güvenli olabilir.
    // Bu örnekte, doğrudan updateUser kullanılıyor.

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      // Supabase'in döndüğü hata mesajlarını daha kullanıcı dostu hale getirebilirsiniz
      if (error.message.includes("New password should be different from the old password.")) {
          setPasswordMessage("Yeni şifre eski şifrenizle aynı olamaz.");
      } else if (error.message.includes("Password should be at least 6 characters.")) {
          setPasswordMessage("Şifre en az 6 karakter olmalıdır.");
      } else {
          setPasswordMessage(`Şifre güncellenemedi: ${error.message}`);
      }
    } else {
      setPasswordMessage("Şifre başarıyla güncellendi.");
      setOldPassword("");
      setNewPassword("");
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0 || !userData?.id) {
        alert("Lütfen yüklenecek bir dosya seçin.");
        return;
    }
    setMessage("Dosyalar yükleniyor...");

    let allUploadsSuccessful = true;
    for (const file of Array.from(selectedFiles)) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const fileNameWithoutExtension = file.name.substring(0, file.name.lastIndexOf('.'));
      // Dosya adını slugify et (Türkçe karakter ve boşluk sorunlarını çözmek için)
      const slugifiedFileName = fileNameWithoutExtension
        .normalize("NFD") // Türkçe karakterleri ayrıştır
        .replace(/[\u0300-\u036f]/g, "") // Aksanları kaldır
        .toLowerCase()
        .replace(/\s+/g, '-') // Boşlukları tire ile değiştir
        .replace(/[^\w-]+/g, ''); // İzin verilmeyen karakterleri kaldır

      const filePath = `evraklar/${userData.id}/${Date.now()}_${slugifiedFileName}.${fileExtension}`;

      const { error } = await supabase.storage.from("documents").upload(filePath, file);
      if (error) {
        console.error(`'${file.name}' yüklenemedi:`, error);
        alert(`'${file.name}' yüklenemedi: ${error.message}`);
        allUploadsSuccessful = false;
        continue;
      }

      const { data: publicUrlData } = supabase.storage.from("documents").getPublicUrl(filePath);
      if (!publicUrlData?.publicUrl) {
        alert(`'${file.name}' için genel URL alınamadı.`);
        allUploadsSuccessful = false;
        continue;
      }

      await supabase.from("evraklar").insert({
        user_id: userData.id,
        file_name: file.name, // Orijinal dosya adını kaydet
        file_url: publicUrlData.publicUrl,
        file_path: filePath, // Silme işlemi için path'i de kaydetmek iyi bir pratik
      });
    }

    setSelectedFiles(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if(allUploadsSuccessful) setMessage("Tüm dosyalar başarıyla yüklendi.");
    else setMessage("Bazı dosyalar yüklenirken hata oluştu.");
    fetchInitialData(); // Evrak listesini güncelle
  };

  const handleDeleteDocument = async (doc: any) => {
    if (!window.confirm(`"${doc.file_name}" adlı evrağı silmek istediğinizden emin misiniz?`)) return;

    try {
      // file_path alanı varsa onu kullan, yoksa URL'den çıkarmaya çalış
      const pathToDelete = doc.file_path || new URL(doc.file_url).pathname.split("/documents/")[1];
      if (!pathToDelete) throw new Error("Dosya yolu çıkarılamadı.");

      const { error: storageError } = await supabase.storage.from("documents").remove([pathToDelete]);
      if (storageError) throw storageError;

      const { error: dbError } = await supabase.from("evraklar").delete().eq("id", doc.id);
      if (dbError) throw dbError;

      setMessage("Evrak başarıyla silindi.");
      fetchInitialData();
    } catch (error: any) {
      console.error("Evrak silinirken hata:", error.message);
      setMessage(`Evrak silinemedi: ${error.message}`);
    }
  };

  const handlePaytrIframe = async () => {
    if (!userData || !amount || parseFloat(amount) <= 0) {
      setPaymentMessage("Lütfen geçerli bir ödeme tutarı girin.");
      setIframeSrc("");
      return;
    }

    setPaymentMessage("Ödeme arayüzü için token alınıyor...");
    setIframeSrc(""); // Önceki iframe'i temizle

    try {
      const response = await fetch("/api/paytr-token", { // Backend API endpoint'iniz
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userData.id,
          user_name: `${userData.ad} ${userData.soyad}`,
          user_email: userData.email,
          // user_address: userData.adres, // Adres varsa gönderilebilir
          // user_phone: userData.telefon, // Telefon varsa gönderilebilir
          payment_amount: parseFloat(amount) * 100, // Kuruş cinsinden
          // Diğer gerekli bilgileri backend'e gönderin
        }),
      });

      const data = await response.json();

      if (!response.ok || data.status === 'failed') {
        throw new Error(data.reason || data.message || "PayTR token alınamadı veya bir hata oluştu.");
      }

      if (data.iframe_token) {
        const iframeUrl = `https://www.paytr.com/odeme/guvenli/${data.iframe_token}`;
        setIframeSrc(iframeUrl);
        setPaymentMessage(""); // Başarılıysa mesajı temizle
      } else {
        throw new Error("Geçerli bir iframe token alınamadı.");
      }

    } catch (err: any) {
      console.error("PayTR Hatası:", err);
      setPaymentMessage(`Ödeme arayüzü yüklenemedi: ${err.message}`);
      setIframeSrc("");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Yükleniyor...</div>;
  }
  if (!userData && !isLoading) { // Yükleme bitti ama kullanıcı yoksa
    return <div className="flex justify-center items-center h-screen">Kullanıcı bilgileri yüklenemedi veya oturumunuz sonlanmış. Lütfen tekrar giriş yapın.</div>;
  }


  return (
    <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-6 md:gap-10">
      <div className="w-full md:w-72 space-y-2 md:space-y-3 flex-shrink-0">
        {userData && (
          <div className="text-center border p-4 rounded-xl shadow-md bg-gradient-to-br from-[#6A3C96] to-[#8A4CBF] text-white mb-6">
            <p className="text-xl font-semibold">{userData.ad} {userData.soyad}</p>
            <div className="text-xs opacity-80 mt-1">ID: <span className="font-mono">{userData.id.substring(0, 8)}...</span></div>
          </div>
        )}

        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={clsx(
              "w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ease-in-out flex items-center text-sm",
              activeTab === tab.key
                ? "bg-[#6A3C96] text-white shadow-lg transform scale-105"
                : "hover:bg-gray-200 text-gray-700 hover:text-[#6A3C96]"
            )}
          >
            {tab.icon} {tab.label}
          </button>
        ))}

        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full mt-8 text-red-500 flex items-center justify-center gap-2 hover:bg-red-100 hover:text-red-700 transition-colors duration-150 py-3"
        >
          <LogOut className="w-4 h-4" /> Çıkış Yap
        </Button>
      </div>

      <div className="flex-1 space-y-8 min-w-0"> {/* min-w-0 flex item'ın taşmasını engeller */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#4a2e70] mb-8 border-b-2 border-[#6A3C96] pb-4">
          {tabs.find(t => t.key === activeTab)?.label || "Profilim"}
        </h1>

        {activeTab === "account" && userData && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#5a3080]">Kullanıcı Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700">
              <p><strong>Ad Soyad:</strong> {userData.ad} {userData.soyad}</p>
              <p><strong>E-posta:</strong> {userData.email}</p>
              <p><strong>Firma:</strong> {userData.firma || <span className="italic text-gray-500">Belirtilmemiş</span>}</p>
              <p><strong>Telefon:</strong> {userData.telefon || <span className="italic text-gray-500">Belirtilmemiş</span>}</p>
            </CardContent>
          </Card>
        )}

        {activeTab === "favorites" && userData && (
          <Card className="shadow-lg">
            <CardHeader><CardTitle className="text-2xl text-[#5a3080]">Favori Araçlarım</CardTitle></CardHeader>
            <CardContent>
              {favorites.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Henüz favori aracınız bulunmuyor.</p>
              ) : (
                <ul className="space-y-3">
                  {favorites.map((fav) => (
                    <li key={fav.id} className="border-b last:border-b-0 py-3 flex justify-between items-center">
                      {fav.araclar ? (
                        <Link href={`/vehicles/${fav.araclar.slug || fav.araclar.id}`} className="text-[#6A3C96] hover:underline font-medium text-md">
                          {fav.araclar.title || "İsimsiz Araç"}
                        </Link>
                      ) : (
                        <span className="text-gray-400 italic">Favori araç bilgisi bulunamadı.</span>
                      )}
                      {/* Favoriden çıkarma butonu eklenebilir */}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "offers" && userData && (
          <Card className="shadow-lg">
            <CardHeader><CardTitle className="text-2xl text-[#5a3080]">Tekliflerim (PDF)</CardTitle></CardHeader>
            <CardContent>
              {offers.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Henüz oluşturulmuş bir PDF teklifiniz bulunmuyor.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {offers.map((offer) => {
                    const fileName = offer.pdf_url ? offer.pdf_url.split("/").pop() : "Teklif Dosyası";
                    const createdAt = offer.created_at ? new Date(offer.created_at).toLocaleDateString("tr-TR", { day: '2-digit', month: 'long', year: 'numeric' }) : "-";
                    return (
                      <div key={offer.id} className="border rounded-lg p-4 shadow-sm flex flex-col justify-between h-full bg-white hover:shadow-md transition-shadow">
                        <div className="mb-2 font-semibold text-[#5a3080] break-all line-clamp-2 text-sm" title={fileName}>{fileName}</div>
                        <div className="text-xs text-gray-500 mb-3">Oluşturma: {createdAt}</div>
                        {offer.pdf_url && (
                            <a
                            href={offer.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-3 py-2 text-xs bg-[#6A3C96] text-white rounded-md hover:bg-[#502b74] transition-colors font-medium w-full"
                            >
                            <Download className="w-3.5 h-3.5 mr-1.5" /> PDF Görüntüle/İndir
                            </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "documents" && userData && (
          <Card className="shadow-lg">
            <CardHeader><CardTitle className="text-2xl text-[#5a3080]">Evrak Yönetimi</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <Input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  onChange={(e) => setSelectedFiles(e.target.files)}
                  className="flex-grow file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#6A3C96] file:text-white hover:file:bg-[#502b74] cursor-pointer"
                />
                <Button onClick={handleFileUpload} disabled={!selectedFiles || selectedFiles.length === 0} className="bg-[#6A3C96] text-white hover:bg-[#502b74] w-full sm:w-auto disabled:opacity-50">
                  <UploadCloud className="w-4 h-4 mr-2" /> Seçilenleri Yükle
                </Button>
              </div>
               {message && <p className={clsx("text-sm p-3 rounded-md", message.includes("başarıyla") ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200")}>{message}</p>}

              <div className="flex items-start text-xs text-gray-600 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <Info className="w-5 h-5 flex-shrink-0 text-blue-500 mr-2 mt-0.5" />
                <span>Desteklenen dosya türleri: PDF, Word (doc, docx), Excel (xls, xlsx), Resim (jpg, png, webp), Arşiv (zip, rar). Lütfen dosya boyutlarına dikkat ediniz.</span>
              </div>

              {documents.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center italic">Henüz yüklenmiş evrağınız bulunmuyor.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {documents.map((doc) => {
                    const ext = doc.file_name ? doc.file_name.split(".").pop()?.toLowerCase() : "";
                    const icon = (() => {
                      if (!ext) return "📁";
                      if (["pdf"].includes(ext)) return "📄";
                      if (["doc", "docx"].includes(ext)) return "📝";
                      if (["xls", "xlsx", "csv"].includes(ext)) return "📊";
                      if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) return "🖼️";
                      if (["zip", "rar", "7z"].includes(ext)) return "🗜️";
                      return "📁";
                    })();

                    return (
                      <div key={doc.id} className="border rounded-lg p-3.5 shadow-sm flex flex-col items-center text-center bg-white hover:shadow-md transition-shadow">
                        <div className="text-5xl mb-3 opacity-70">{icon}</div>
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-[#6A3C96] font-medium break-all hover:underline text-xs mb-1 line-clamp-2 leading-tight" title={doc.file_name}>
                          {doc.file_name}
                        </a>
                        <p className="text-xs text-gray-400 mb-2">.{ext}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDocument(doc)}
                          className="text-red-500 hover:bg-red-100 hover:text-red-600 w-full mt-auto text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" /> Sil
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "payment" && userData && (
          <Card className="shadow-lg">
            <CardHeader><CardTitle className="text-2xl text-[#5a3080]">Ödeme Yap</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="amount" className="text-sm font-medium text-gray-700">Ödenecek Tutar (₺)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Örn: 500.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 w-full sm:w-1/2"
                  min="1" // Minimum ödeme tutarı
                />
              </div>
              <Button onClick={handlePaytrIframe} className="bg-[#6A3C96] text-white hover:bg-[#502b74] w-full sm:w-auto px-6 py-2.5">
                <CreditCard className="w-5 h-5 mr-2" /> Ödemeye Güvenle Devam Et
              </Button>

              {paymentMessage && <p className={clsx("text-sm p-3 rounded-md mt-2", paymentMessage.includes("başarıyla") || paymentMessage.includes("yükleniyor") ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-red-100 text-red-700 border border-red-200")}>{paymentMessage}</p>}

              {iframeSrc && (
                <div className="mt-8 border-t-2 border-dashed border-gray-200 pt-6">
                  <h4 className="text-xl font-semibold mb-4 text-gray-800">PayTR Güvenli Ödeme Ekranı</h4>
                  <iframe
                    src={iframeSrc}
                    width="100%"
                    height="650" // Yüksekliği biraz daha artırıldı
                    frameBorder="0"
                    className="rounded-lg shadow-xl border border-gray-200 bg-white"
                    title="PayTR Güvenli Ödeme Sayfası"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "password" && userData && (
          <Card className="shadow-lg">
            <CardHeader><CardTitle className="text-2xl text-[#5a3080]">Şifre Değiştir</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="oldPassword">Mevcut Şifreniz</Label>
                <Input id="oldPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="newPassword">Yeni Şifreniz</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1" />
              </div>
              {passwordMessage && <p className={clsx("text-sm p-3 rounded-md", passwordMessage.includes("başarıyla") ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200")}>{passwordMessage}</p>}
              <Button onClick={handlePasswordChange} className="bg-[#6A3C96] text-white hover:bg-[#4a2e70] px-6 py-2.5">
                Şifreyi Güncelle
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Kullanıcı verisi yüklenemezse veya aktif tab için içerik yoksa gösterilecek mesaj */}
        {!userData && !isLoading && <p className="text-center text-gray-500 py-10">İçerik yüklenirken bir sorun oluştu veya bu sekme için gösterilecek bir şey yok.</p>}

      </div>
    </div>
  );
}
