import { NextResponse } from "next/server";
import { renderToBuffer, Font } from "@react-pdf/renderer";
import { createClient } from "@supabase/supabase-js";
import { TeklifPdf } from "@/components/TeklifPdf"; // PDF için React bileşeniniz
import fs from 'fs'; // fs modülünü doğru şekilde import edin
import path from 'path'; // path modülünü doğru şekilde import edin

// Fontların sadece bir kez kaydedilmesini sağlayan bayrak ve fonksiyon
let areFontsRegistered = false;

function registerFontsOnce() {
  if (areFontsRegistered) {
    return;
  }

  try {
    console.log("Font kayıt işlemi başlıyor...");
    const fontsToRegister = [
      { name: "OpenSans-Regular.ttf", weight: "normal" as const },
      { name: "OpenSans-Bold.ttf", weight: "bold" as const },
    ];

    const registeredFontSources: { src: Buffer; fontWeight: 'normal' | 'bold' }[] = [];

    for (const font of fontsToRegister) {
      const fontPath = path.join(process.cwd(), "lib", "fonts", font.name);
      console.log(`${font.name} yüklenmeye çalışılıyor: ${fontPath}`);

      if (!fs.existsSync(fontPath)) {
        console.warn(`⚠️ FONT DOSYASI BULUNAMADI: ${font.name} yolu: ${fontPath}`);
        // Eğer kalın font bulunamazsa, en azından normal fontla devam etmeye çalışabiliriz.
        // Ancak bu, kalın metinlerin doğru görünmemesine neden olabilir.
        // Kritik olan normal fontsa, burada bir hata fırlatılabilir.
        if (font.weight === "normal") {
            throw new Error(`Kritik font dosyası bulunamadı: ${font.name}`);
        }
        continue; // Bu fontu atla
      }

      const fontData = fs.readFileSync(fontPath);
      if (fontData.length === 0) {
        console.warn(`⚠️ FONT DOSYASI BOŞ: ${font.name} yolu: ${fontPath}`);
        if (font.weight === "normal") {
            throw new Error(`Kritik font dosyası boş: ${font.name}`);
        }
        continue; // Bu fontu atla
      }

      console.log(`✅ ${font.name} yüklendi, arabellek uzunluğu: ${fontData.length}`);
      registeredFontSources.push({ src: fontData, fontWeight: font.weight });
    }

    if (registeredFontSources.length === 0) {
        console.error("🔴 Kaydedilecek geçerli font kaynağı bulunamadı.");
        throw new Error("Kaydedilecek geçerli font kaynağı bulunamadı.");
    }

    Font.register({
      family: "OpenSans",
      fonts: registeredFontSources,
    });

    areFontsRegistered = true;
    console.log("✅ OpenSans font ailesi (normal ve kalın varyantlarla) başarıyla kaydedildi.");

  } catch (fontError: any) {
    console.error("🔴🔴🔴 KRİTİK FONT KAYIT HATASI:", fontError.message, fontError.stack);
    // Font kaydı başarısız olursa, PDF oluşturma da büyük olasılıkla başarısız olacaktır.
    // Bu hatayı yukarıya fırlatarak POST isteğinin hata ile sonuçlanmasını sağlayabiliriz.
    throw fontError;
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    // Fontları her istek için değil, fonksiyon örneği için bir kez kaydetmeye çalış
    // Sunucusuz ortamda bu, fonksiyon "cold start" olduğunda çalışır.
    registerFontsOnce();

    const body = await req.json();
    const { vehicleIds, userId } = body;

    if (!vehicleIds || vehicleIds.length === 0) {
      return NextResponse.json({ error: "Araç ID'leri belirtilmedi." }, { status: 400 });
    }

    // Araç verilerini alırken 'km' alanını da seç
    const { data: vehiclesData, error: vehiclesError } = await supabase
      .from("Araclar")
      .select("id, isim, fiyat, vites, yakit_turu, km") // ✅ km alanı eklendi
      .in("id", vehicleIds);

    if (vehiclesError) {
        console.error("Supabase araçları alırken hata:", vehiclesError);
        return NextResponse.json({ error: "Araç bilgileri alınamadı (Supabase).", details: vehiclesError.message }, { status: 500 });
    }
    if (!vehiclesData || vehiclesData.length === 0) {
      return NextResponse.json({ error: "Araç bilgileri bulunamadı." }, { status: 404 }); // 404 daha uygun olabilir
    }

    // TeklifPdf bileşeninin beklediği veri yapısına dönüştür
    const vehicles = vehiclesData.map(v => ({
        id: String(v.id),
        isim: String(v.isim || "N/A"),
        fiyat: typeof v.fiyat === 'number' ? v.fiyat : null,
        km: typeof v.km === 'number' ? v.km : null, // km değerini işle
        vites: String(v.vites || "-"),
        yakit_turu: String(v.yakit_turu || "-"),
    }));


    const { data: userProfile, error: userError } = await supabase
      .from("kullanicilar")
      .select("ad, soyad, firma")
      .eq("id", userId)
      .single();

    if (userError || !userProfile) {
        console.error("Supabase kullanıcı bilgilerini alırken hata:", userError);
        return NextResponse.json({ error: "Kullanıcı bilgileri alınamadı (Supabase).", details: userError?.message }, { status: 500 });
    }

    console.log("PDF oluşturuluyor. Araçlar (ilk):", JSON.stringify(vehicles[0]));
    const pdfBuffer = await renderToBuffer(TeklifPdf({ vehicles }));
    console.log("PDF arabelleği oluşturuldu, uzunluk:", pdfBuffer.length);


    const teklifTarihi = new Date().toISOString().slice(0, 10);
    const teklifNo = Math.floor(1000 + Math.random() * 9000);
    const musteriIsmi = `${userProfile.ad || 'Bilinmeyen'}_${userProfile.soyad || 'Kullanici'}`.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9\-]/g, "");
    const fileName = `teklifler/${musteriIsmi}-${teklifTarihi}-Teklif-${teklifNo}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("pdf-teklif")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true
      });

    if (uploadError) {
      console.error("❌ PDF Storage yüklenemedi:", uploadError);
      return NextResponse.json({ error: "PDF yükleme hatası.", details: uploadError.message }, { status: 500 });
    }
    console.log("PDF başarıyla Storage'a yüklendi:", fileName);

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pdf-teklif/${fileName}`;

    const { error: insertError } = await supabase
      .from("teklif_dosyalar")
      .insert({
        kullanici_id: userId,
        pdf_url: publicUrl,
        ad: userProfile.ad,
        soyad: userProfile.soyad,
        firma: userProfile.firma,
      });

    if (insertError) {
      console.error("❌ Veritabanına kayıt hatası:", insertError);
      // PDF yüklendiği için burada 200 dönüp hatayı loglamak daha iyi olabilir,
      // ya da yüklenen PDF'i silmek gibi bir telafi mekanizması eklenebilir.
      // Şimdilik hata dönüyoruz.
      return NextResponse.json({ error: "Veritabanı kaydı hatalı.", details: insertError.message }, { status: 500 });
    }
    console.log("PDF bilgileri veritabanına başarıyla kaydedildi.");

    return NextResponse.json({ url: publicUrl });

  } catch (err: any) {
    // Font kayıt hatası da buraya düşebilir
    console.error("❌ Genel PDF API hatası:", err.message, err.stack);
    return NextResponse.json({ error: "PDF oluşturulamadı veya işlenemedi.", details: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    registerFontsOnce(); // GET isteğiyle de font kaydını test edebilirsiniz (isteğe bağlı)
    return NextResponse.json({ message: "Teklif PDF API çalışıyor! Font kaydı denendi." });
  } catch (error: any) {
    return NextResponse.json({ message: "Teklif PDF API çalışıyor ancak font kaydında hata oluştu.", error: error.message }, {status: 500});
  }
}
