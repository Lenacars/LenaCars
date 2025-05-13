import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

// ✅ FONT REGISTER — server tarafında route.ts'te register ediliyor (readFileSync ile)
Font.register({
  family: "DejaVu",
  fonts: [
    {
      src: "/fonts/DejaVuSans.ttf", // Local kullanım (PDF buffer'dan)
      fontStyle: "normal",
      fontWeight: "normal",
    },
  ],
});

// Görsel URL’leri
const logoUrl =
  "https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/866644b2-4e89-4dec-84a8-e607311ece2e.png";
const footerUrl =
  "https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/2bf3ea48-ca84-4f34-a109-0a6ef8c7f914.png";

// PDF stilleri
const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 100,
    fontSize: 10,
    fontFamily: "DejaVu", // 👈 Türkçe karakter desteği olan font
  },
  logo: {
    width: 120,
    position: "absolute",
    top: 20,
    left: 30,
  },
  headerText: {
    position: "absolute",
    top: 30,
    right: 40,
    fontSize: 10,
    fontWeight: "bold",
  },
  title: {
    marginTop: 80,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 20,
  },
  paragraph: {
    marginBottom: 10,
    lineHeight: 1.5,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "#000",
    fontWeight: "bold",
    paddingVertical: 4,
    marginTop: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
    paddingVertical: 4,
  },
  cell: {
    flex: 1,
    paddingRight: 4,
  },
  footerImage: {
    width: "40%",
    position: "absolute",
    bottom: 20,
    left: "30%",
  },
  bold: {
    fontWeight: "bold",
  },
  conditions: {
    marginTop: 20,
    lineHeight: 1.4,
  },
  signature: {
    marginTop: 20,
  },
});

interface Vehicle {
  id: string;
  isim: string;
  fiyat: number | null;
  kategori?: string;
  vites?: string;
  yakit_turu?: string;
  yil?: string;
  km?: number | null;
  sure?: string;
  model_yili?: string;
}

export const TeklifPdf = ({
  vehicles,
  customerName,
}: {
  vehicles: Vehicle[];
  customerName: string;
}) => {
  try {
    const today = new Date().toLocaleDateString("tr-TR");
    const total = vehicles.reduce((acc, v) => acc + (v.fiyat || 0), 0);

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Image src={logoUrl} style={styles.logo} />
          <Text style={styles.headerText}>Teklif Tarihi: {today}</Text>

          <Text style={styles.title}>Araç Kiralama Teklif Formu</Text>

          <Text style={styles.paragraph}>
            Değerli Müşteri Adayımız {customerName},
          </Text>
          <Text style={styles.paragraph}>
            “Birlikte kazanırsak, gerçekten kazanırız” anlayışıyla hareket eden LenaCars olarak,
            araç kiralama teklifimizi paylaşıyoruz.
          </Text>
          <Text style={styles.paragraph}>
            Başarı yolculuğunuzda her adımınızı kolaylaştırmak için buradayız.
            Mutlu müşteri ailemizde sizi de görmekten memnuniyet duyarız.
          </Text>

          <View style={styles.tableHeader}>
            <Text style={[styles.cell, { flex: 2 }]}>Araç Marka - Model</Text>
            <Text style={styles.cell}>Model Yılı</Text>
            <Text style={styles.cell}>Süre</Text>
            <Text style={styles.cell}>Km Limiti</Text>
            <Text style={styles.cell}>Fiyat</Text>
          </View>

          {vehicles.map((v) => (
            <View style={styles.tableRow} key={v.id}>
              <Text style={[styles.cell, { flex: 2 }]}>{v.isim}</Text>
              <Text style={styles.cell}>{v.model_yili || "-"}</Text>
              <Text style={styles.cell}>{v.sure || "-"}</Text>
              <Text style={styles.cell}>
                {typeof v.km === "number" ? `${v.km.toLocaleString("tr-TR")} km` : "-"}
              </Text>
              <Text style={styles.cell}>
                {typeof v.fiyat === "number"
                  ? `${v.fiyat.toLocaleString("tr-TR")} ₺`
                  : "Fiyat Yok"}
              </Text>
            </View>
          ))}

          <Text style={{ textAlign: "right", marginTop: 10, fontWeight: "bold" }}>
            Ara Toplam: {total.toLocaleString("tr-TR")} ₺
          </Text>
          <Text style={{ textAlign: "right", fontWeight: "bold" }}>
            Toplam: {total.toLocaleString("tr-TR")} ₺
          </Text>

          <View style={styles.conditions}>
            <Text style={styles.bold}>Genel Kiralama Koşulları:</Text>
            <Text>- Teklifimiz 15 gün geçerlidir.</Text>
            <Text>
              - Teklif edilen kiralama fiyatlarımıza; Rent A Car Kaskosu, İhtiyari Mali Mesuliyet
              Sigortası, Zorunlu Trafik Sigortası, periyodik servis bakımları ve mülkiyetle ilgili tüm
              vergiler dahildir.
            </Text>
            <Text>
              - Belirtilen km aşım durumunda her km için 8,50 TL ile 10,50 TL + KDV arası ücret alınır.
            </Text>
            <Text>
              - Araç lastikleri her 60.000 km’de bir değiştirilir. Aracın km’si de lastiğin yapısı gibi
              olduğu km esas alınacaktır.
            </Text>
            <Text>- Araçlarımız kira süresi boyunca sabit fiyat garantilidir.</Text>
            <Text>
              - Araç opsiyonlama işlemi yapılabilmesi adına gerekli evraklarınızla sipariş
              oluşturulmalıdır.
            </Text>
          </View>

          <View style={styles.signature}>
            <Text>Saygılarımızla,</Text>
            <Text>LenaCars</Text>
          </View>

          <Image src={footerUrl} style={styles.footerImage} />
        </Page>
      </Document>
    );
  } catch (err) {
    console.error("🔴 PDF render hatası:", err);
    throw err;
  }
};
