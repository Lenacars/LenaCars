import { NextResponse } from "next/server";
import { renderToBuffer, Font } from "@react-pdf/renderer";
import { createClient } from "@supabase/supabase-js";
import { TeklifPdf } from "@/components/TeklifPdf";
import path from "path";
import fs from "fs";

// ✅ FONT KAYDI (Vercel için readFileSync + path ile)
const fontPath = path.join(process.cwd(), "public", "fonts", "DejaVuSans.ttf");
const fontBuffer = fs.readFileSync(fontPath);

Font.register({
  family: "DejaVu",
  src: fontBuffer,
});

// ✅ Supabase bağlantısı
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { vehicleIds, userId } = body;

    if (!vehicleIds || !Array.isArray(vehicleIds) || vehicleIds.length === 0) {
      return NextResponse.json({ error: "Araç ID'leri eksik." }, { status: 400 });
    }

    const { data: vehicles, error: vehicleError } = await supabase
      .from("Araclar")
      .select("id, isim, fiyat, km, sure, model_yili")
      .in("id", vehicleIds);

    if (vehicleError || !vehicles) {
      return NextResponse.json({ error: "Araçlar alınamadı." }, { status: 500 });
    }

    const { data: user, error: userError } = await supabase
      .from("kullanicilar")
      .select("ad, soyad, firma")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "Kullanıcı alınamadı." }, { status: 500 });
    }

    // ✅ PDF oluştur
    const pdfBuffer = await renderToBuffer(
      TeklifPdf({
        vehicles,
        customerName: `${user.ad} ${user.soyad}`,
      })
    );

    // ✅ Dosya ismi
    const date = new Date().toISOString().split("T")[0];
    const random = Math.floor(Math.random() * 10000);
    const filename = `teklifler/${user.ad}-${date}-${random}.pdf`;

    // ✅ Upload
    const { error: uploadError } = await supabase.storage
      .from("pdf-teklif")
      .upload(filename, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: "PDF yüklenemedi." }, { status: 500 });
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pdf-teklif/${filename}`;

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
