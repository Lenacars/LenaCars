import { NextResponse } from "next/server";
import { PDFDownloadLink, Page, Text, Document, StyleSheet } from '@react-pdf/renderer';
import { supabase } from "@/lib/supabase";
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const styles = StyleSheet.create({
  page: {
    padding: 30
  },
  title: {
    fontSize: 18,
    marginBottom: 10
  },
  item: {
    fontSize: 14,
    marginBottom: 5
  }
});

function TeklifPdf({ vehicles }: { vehicles: any[] }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Teklif Detayı</Text>
        {vehicles.map((v, index) => (
          <Text style={styles.item} key={index}>
            {v.isim} - {v.fiyat.toLocaleString()} ₺
          </Text>
        ))}
      </Page>
    </Document>
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { vehicleIds, userId } = body;

    if (!vehicleIds || vehicleIds.length === 0) {
      return NextResponse.json(
        { error: "Araç ID'leri belirtilmedi." },
        { status: 400 }
      );
    }

    // Supabase'den araç bilgilerini al
    const { data, error } = await supabase
      .from("Araclar")
      .select("id, isim, fiyat")
      .in("id", vehicleIds);

    if (error || !data) {
      return NextResponse.json(
        { error: "Araç bilgileri alınamadı." },
        { status: 500 }
      );
    }

    // PDF dosyasını oluştur
    const pdfPath = join(process.cwd(), 'public', `teklif-${Date.now()}.pdf`);
    const ReactPDF = require('@react-pdf/renderer');
    await ReactPDF.renderToFile(<TeklifPdf vehicles={data} />, pdfPath);

    const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lena-cars.vercel.app'}/${pdfPath.split('public/')[1]}`;

    return NextResponse.json({ url });
  } catch (err) {
    console.error("PDF oluşturma hatası:", err);
    return NextResponse.json(
      { error: "PDF oluşturulamadı." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Teklif PDF API çalışıyor!" });
}
