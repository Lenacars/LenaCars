import { NextResponse } from "next/server";
import { renderToBuffer, Font } from "@react-pdf/renderer";
import { createClient } from "@supabase/supabase-js";
import { TeklifPdf } from "@/components/TeklifPdf";
import fs from "fs";
import path from "path";

// ✅ Font Register: Public'teki .ttf dosyasını oku
const fontPath = path.join(process.cwd(), "public/fonts/DejaVuSans.ttf");
Font.register({
  family: "DejaVu",
  src: fs.readFileSync(fontPath),
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { vehicleIds, userId } = await req.json();

    const { data: vehicles } = await supabase
      .from("Araclar")
      .select("id, isim, fiyat, km, sure, model_yili")
      .in("id", vehicleIds);

    const { data: user } = await supabase
      .from("kullanicilar")
      .select("ad, soyad, firma")
      .eq("id", userId)
      .single();

    const pdfBuffer = await renderToBuffer(
      <TeklifPdf vehicles={vehicles} customerName={`${user.ad} ${user.soyad}`} />
    );

    const fileName = `teklifler/${user.ad}-${Date.now()}.pdf`;

    await supabase.storage
      .from("pdf-teklif")
      .upload(fileName, pdfBuffer, { contentType: "application/pdf", upsert: true });

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pdf-teklif/${fileName}`;

    await supabase.from("teklif_dosyalar").insert({
      kullanici_id: userId,
      pdf_url: publicUrl,
      ad: user.ad,
      soyad: user.soyad,
      firma: user.firma,
    });

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error("🔴 PDF Hatası:", err);
    return NextResponse.json({ error: "PDF oluşturulamadı." }, { status: 500 });
  }
}
