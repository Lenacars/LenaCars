import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { createClient } from "@supabase/supabase-js";

// Supabase bağlantısı
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ✅ TEST amaçlı GET endpoint (tarayıcıdan çalıştırmak için)
export async function GET() {
  return NextResponse.json({ message: "Teklif PDF API çalışıyor!" });
}

export async function POST(req: Request) {
  try {
    const { vehicleIds, userId } = await req.json();
    console.log("📥 Gelen vehicleIds:", vehicleIds);
    console.log("📥 Gelen userId:", userId);

    if (!vehicleIds || vehicleIds.length === 0) {
      return NextResponse.json({ error: "Araç seçilmedi." }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: "Kullanıcı ID bulunamadı." }, { status: 400 });
    }

    // Garajdan araçları çek
    const { data, error } = await supabase
      .from("garaj")
      .select(`
        arac_id,
        Araclar:arac_id (
          isim,
          fiyat,
          category
        )
      `)
      .eq("user_id", userId)
      .in("arac_id", vehicleIds);

    if (error || !data || data.length === 0) {
      return NextResponse.json({ error: "Garaj verisi bulunamadı." }, { status: 404 });
    }

    // PDF oluştur
    const doc = new PDFDocument({ margin: 50 });
    const buffers: Uint8Array[] = [];

    doc.font("Times-Roman");
    doc.on("data", buffers.push.bind(buffers));

    const pdfPromise = new Promise<Buffer>((resolve, reject) => {
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);
    });

    doc.fontSize(20).text("Araç Teklif Listesi", { align: "center" }).moveDown();

    data.forEach((item, index) => {
      const isim = item.Araclar?.isim || "İsimsiz";
      const fiyat = item.Araclar?.fiyat ? item.Araclar.fiyat.toLocaleString("tr-TR") : "0";
      const kategori = item.Araclar?.category || "-";
      doc.fontSize(14).text(`${index + 1}. Araç: ${isim} | Kategori: ${kategori} | Fiyat: ${fiyat} ₺`).moveDown(0.5);
    });

    doc.end();
    const pdfBuffer = await pdfPromise;

    // PDF'i Supabase Storage'a yükle
    const fileName = `teklif_${userId}_${Date.now()}.pdf`;

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from("pdf-teklif")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true
      });

    if (uploadError) {
      console.error("❌ PDF yükleme hatası:", uploadError);
      return NextResponse.json({ error: "PDF yüklenemedi." }, { status: 500 });
    }

    // Public URL oluştur
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pdf-teklif/${fileName}`;

    console.log("✅ PDF başarıyla yüklendi:", publicUrl);

    return NextResponse.json({ url: publicUrl });

  } catch (err) {
    console.error("❌ API genel hata:", err);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
