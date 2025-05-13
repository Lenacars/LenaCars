import { NextResponse } from "next/server";
import { renderToBuffer, Font } from "@react-pdf/renderer";
import { createClient } from "@supabase/supabase-js";
import { TeklifPdf } from "@/components/TeklifPdf";
import fs from 'fs'; // ✅ fs modülünü import et
import path from 'path'; // ✅ path modülünü import et

// ✅ Font dosyasının yolunu doğru şekilde oluştur ve readFileSync ile buffer olarak oku
// Projenizin kök dizininde 'public/fonts/DejaVuSans.ttf' dosyasının bulunduğunu varsayıyoruz.
const fontPath = path.join(process.cwd(), 'public', 'fonts', 'DejaVuSans.ttf');
const fontBuffer = fs.readFileSync(fontPath);

Font.register({
  family: "DejaVu",
  src: fontBuffer, // ✅ Okunan buffer'ı kullan
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { vehicleIds, userId } = body;

    if (!vehicleIds || vehicleIds.length === 0) {
      return NextResponse.json({ error: "Araç ID'leri eksik." }, { status: 400 });
    }

    // 🚗 Araç verilerini al
    const { data: vehicles, error } = await supabase
      .from("Araclar")
      .select("id, isim, fiyat, km, sure, model_yili")
      .in("id", vehicleIds);

    if (error || !vehicles) {
      return NextResponse.json({ error: "Araçlar alınamadı." }, { status: 500 });
    }

    // 👤 Kullanıcı verilerini al
    const { data: user, error: userError } = await supabase
      .from("kullanicilar")
      .select("ad, soyad, firma")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 500 });
    }

    // 📄 PDF oluştur
    const pdfBuffer = await renderToBuffer(
      TeklifPdf({
        vehicles,
        customerName: `${user.ad} ${user.soyad}`,
      })
    );

    // 📁 Dosya adı oluştur
    const date = new Date().toISOString().slice(0, 10);
    const fileName = `teklifler/${user.ad}-${date}-${Math.floor(Math.random() * 10000)}.pdf`;

    // ⬆️ Storage'a yükle
    const { error: uploadError } = await supabase.storage
      .from("pdf-teklif")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: "PDF yüklenemedi." }, { status: 500 });
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pdf-teklif/${fileName}`;

    // 📥 Veritabanına kayıt
    await supabase.from("teklif_dosyalar").insert({
      kullanici_id: userId,
      pdf_url: publicUrl,
      ad: user.ad,
      soyad: user.soyad,
      firma: user.firma,
    });

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error("🔴 PDF oluşturma hatası:", err);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "PDF API çalışıyor!" });
}
