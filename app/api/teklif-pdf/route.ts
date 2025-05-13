import { NextResponse } from "next/server";
import { renderToBuffer, Font } from "@react-pdf/renderer";
import { createClient } from "@supabase/supabase-js";
import { TeklifPdf } from "@/components/TeklifPdf";
import fs from "fs";
import path from "path";

// ✅ FONTU REGISTER ET
Font.register({
  family: "DejaVu",
  src: fs.readFileSync(path.resolve(process.cwd(), "public/fonts/DejaVuSans.ttf")),
});

// ✅ SUPABASE CLIENT
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

    // 🚗 Araçları çek
    const { data: vehicles, error } = await supabase
      .from("Araclar")
      .select("id, isim, fiyat, km, sure, model_yili")
      .in("id", vehicleIds);

    if (error || !vehicles) {
      return NextResponse.json({ error: "Araçlar alınamadı." }, { status: 500 });
    }

    // 👤 Kullanıcıyı çek
    const { data: user, error: userError } = await supabase
      .from("kullanicilar")
      .select("ad, soyad, firma")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 500 });
    }

    // ✅ PDF OLUŞTUR (Function Call Şeklinde!)
    const pdfBuffer = await renderToBuffer(
      TeklifPdf({
        vehicles,
        customerName: `${user.ad} ${user.soyad}`,
      })
    );

    // 📁 Dosya adı
    const fileName = `teklifler/${user.ad}-${Date.now()}.pdf`;

    // ⬆️ Upload et
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

    // 💾 Teklif tablosuna yaz
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
