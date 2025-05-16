import { NextResponse } from "next/server";
import { renderToBuffer, Font } from "@react-pdf/renderer";
import { createClient } from "@supabase/supabase-js";
import { TeklifPdf } from "@/components/TeklifPdf";
import fs from "fs";
import path from "path";

let areFontsRegistered = false;

function registerFontsOnce() {
  if (areFontsRegistered) return;

  try {
    const fontsToRegister = [
      { name: "OpenSans-Regular.ttf", weight: "normal" as const },
      { name: "OpenSans-Bold.ttf", weight: "bold" as const },
    ];

    const registeredFontSources: { src: Buffer; fontWeight: "normal" | "bold" }[] = [];

    for (const font of fontsToRegister) {
      const fontPath = path.join(process.cwd(), "lib", "fonts", font.name);
      console.log("🔠 Font yolu kontrol ediliyor:", fontPath);

      if (!fs.existsSync(fontPath)) {
        console.error("🚫 Font bulunamadı:", font.name);
        if (font.weight === "normal") throw new Error(`Font bulunamadı: ${font.name}`);
        continue;
      }

      const fontData = fs.readFileSync(fontPath);
      if (fontData.length === 0) {
        console.error("🚫 Font dosyası boş:", font.name);
        if (font.weight === "normal") throw new Error(`Font boş: ${font.name}`);
        continue;
      }

      registeredFontSources.push({ src: fontData, fontWeight: font.weight });
    }

    if (registeredFontSources.length === 0) {
      throw new Error("Geçerli font bulunamadı.");
    }

    Font.register({
      family: "OpenSans",
      fonts: registeredFontSources,
    });

    areFontsRegistered = true;
    console.log("✅ Fontlar başarıyla yüklendi.");
  } catch (err: any) {
    console.error("❌ Font yükleme hatası:", err.message);
    throw err;
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  console.log("📩 [POST] Teklif PDF API çağrıldı");

  try {
    registerFontsOnce();

    const body = await req.json();
    console.log("📦 Request body:", body);

    const { vehicleIds, userId } = body;

    if (!vehicleIds?.length) {
      console.error("🚫 Araç ID'leri boş!");
      return NextResponse.json({ error: "Araç ID'leri belirtilmedi." }, { status: 400 });
    }

    console.log("🔍 Araçlar çekiliyor...");

    const { data: vehiclesData, error: vehiclesError } = await supabase
      .from("Araclar")
      .select("id, isim, fiyat")
      .in("id", vehicleIds);

    if (vehiclesError || !vehiclesData?.length) {
      console.error("❌ Araçlar alınamadı:", vehiclesError?.message);
      return NextResponse.json(
        { error: "Araç bilgileri alınamadı.", details: vehiclesError?.message },
        { status: 500 }
      );
    }

    console.log("✅ Araç verisi geldi:", vehiclesData);

    const vehicles = vehiclesData.map((v) => ({
      id: String(v.id),
      isim: v.isim || "N/A",
      fiyat: typeof v.fiyat === "number" ? v.fiyat : null,
      vites: undefined,
      yakit_turu: undefined,
      km: null,
    }));

    let userProfile = {
      ad: "Misafir",
      soyad: "Kullanıcı",
      firma: "",
    };

    if (userId) {
      console.log("🔐 Giriş yapmış kullanıcı ID:", userId);
      const { data: profileData, error: userError } = await supabase
        .from("kullanicilar")
        .select("ad, soyad, firma")
        .eq("id", userId)
        .single();

      if (!userError && profileData) {
        console.log("✅ Kullanıcı profili alındı:", profileData);
        userProfile = {
          ad: profileData.ad,
          soyad: profileData.soyad,
          firma: profileData.firma,
        };
      } else {
        console.error("🚫 Kullanıcı profili alınamadı:", userError?.message);
      }
    } else {
      console.log("👤 Misafir kullanıcı PDF oluşturuyor.");
    }

    console.log("🧾 PDF hazırlanıyor...");
    const pdfBuffer = await renderToBuffer(TeklifPdf({ vehicles }));

    const teklifTarihi = new Date().toISOString().slice(0, 10);
    const teklifNo = Math.floor(1000 + Math.random() * 9000);
    const musteriIsmi = `${userProfile.ad}_${userProfile.soyad}`
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9\-]/g, "");
    const fileName = `teklifler/${musteriIsmi}-${teklifTarihi}-Teklif-${teklifNo}.pdf`;

    console.log("📤 PDF Supabase Storage'a yükleniyor:", fileName);

    const { error: uploadError } = await supabase.storage
      .from("pdf-teklif")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("❌ PDF yükleme hatası:", uploadError.message);
      return NextResponse.json({ error: "PDF yüklenemedi.", details: uploadError.message }, { status: 500 });
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pdf-teklif/${fileName}`;
    console.log("✅ PDF başarıyla yüklendi:", publicUrl);

    if (userId) {
      console.log("📥 Supabase teklif_dosyalar tablosuna kayıt yapılıyor...");
      const { error: insertError } = await supabase.from("teklif_dosyalar").insert({
        kullanici_id: userId,
        pdf_url: publicUrl,
        ad: userProfile.ad,
        soyad: userProfile.soyad,
        firma: userProfile.firma,
      });

      if (insertError) {
        console.error("❌ Veritabanı kaydı hatası:", insertError.message);
        return NextResponse.json({ error: "Veritabanı kaydı başarısız.", details: insertError.message }, { status: 500 });
      }

      console.log("✅ Veritabanı kaydı tamamlandı.");
    }

    return NextResponse.json({ url: publicUrl });
  } catch (err: any) {
    console.error("❌ Genel hata:", err.message);
    return NextResponse.json({ error: "PDF oluşturulamadı.", details: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    registerFontsOnce();
    return NextResponse.json({ message: "Font kaydı başarılı." });
  } catch (error: any) {
    return NextResponse.json({ message: "Font kaydı hatalı.", error: error.message }, { status: 500 });
  }
}
