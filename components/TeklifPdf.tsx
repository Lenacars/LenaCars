import React from "react";
import { Page, Text, View, Document, StyleSheet, Image, Link } from "@react-pdf/renderer";

// Logo ve grup şirket görselleri
const logoUrl = "https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/1746433174940-Untitled%20design%20(8).png";
const grupLogolari = [
  { url: "https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/1747055207390-LENAMAMA-LOGO-SIYAH.webp", link: "https://www.lenamama.com/" },
  { url: "https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/1746433174940-Untitled%20design%20(8).png", link: "https://www.lenacars.com/" },
  { url: "https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/3b818402-4851-46a7-972a-c8390051a54d.webp", link: "https://www.artenpreneur.com/" },
  { url: "https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/6ec91451-ba68-4d54-9915-a2859faa83a2.webp", link: "https://www.kreksa.com/" },
  { url: "https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/7e6c3a76-18f1-4134-a529-cfbf6fee74fc.webp", link: "https://www.sarjagel.com/" },
];

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: "auto",
  },
  title: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 20,
  },
  greeting: {
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "#000",
    fontWeight: "bold",
    paddingVertical: 4,
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
  cellWide: {
    flex: 2,
  },
  note: {
    marginTop: 10,
    fontSize: 9,
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
  },
  grupLogolari: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
  },
  grupLogo: {
    width: 50,
    height: 50,
    marginHorizontal: 5,
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

export const TeklifPdf = ({ vehicles }: { vehicles: Vehicle[] }) => {
  const today = new Date().toLocaleDateString("tr-TR");
  const toplam = vehicles.reduce((acc, v) => acc + (v.fiyat || 0), 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={logoUrl} style={styles.logo} />
          <Text>Tarİh: {today}</Text>
        </View>

        <Text style={styles.title}>Araç Kiralama Teklif Formu</Text>

        <Text style={styles.greeting}>Değerli Müşteri Adayımız,</Text>
        <Text style={styles.greeting}>
          "Birlikte kazanırsak, gerçekten kazanırız" anlayışıyla hareket eden LenaCars olarak, araç kiralama teklifimizi paylaşıyoruz.
        </Text>
        <Text style={styles.greeting}>
          Başarı yolculuğunuzda her adımınızı kolaylaştırmak için buradayız. Mutlu müşteri ailemizde sizi de görmekten memnuniyet duyarız.
        </Text>

        {/* Tablo Başlığı */}
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, styles.cellWide]}>Araç Marka ve Model</Text>
          <Text style={styles.cell}>Model Yılı</Text>
          <Text style={styles.cell}>Süre</Text>
          <Text style={styles.cell}>Km Limiti</Text>
          <Text style={styles.cell}>Fiyat</Text>
        </View>

        {/* Araçlar */}
        {vehicles.map((v) => (
          <View style={styles.tableRow} key={v.id}>
            <Text style={[styles.cell, styles.cellWide]}>{v.isim}</Text>
            <Text style={styles.cell}>{v.model_yili || "-"}</Text>
            <Text style={styles.cell}>{v.sure || "-"}</Text>
            <Text style={styles.cell}>{typeof v.km === "number" ? v.km.toLocaleString("tr-TR") + " km" : "-"}</Text>
            <Text style={styles.cell}>{typeof v.fiyat === "number" ? v.fiyat.toLocaleString("tr-TR") + " ₺" : "Fiyat Yok"}</Text>
          </View>
        ))}

        <Text style={{ textAlign: "right", marginTop: 10 }}>Ara Toplam: {toplam.toLocaleString("tr-TR")} ₺</Text>
        <Text style={{ textAlign: "right", fontWeight: "bold" }}>Toplam: {toplam.toLocaleString("tr-TR")} ₺</Text>

        {/* Açıklama Notları */}
        <Text style={styles.note}>Genel Kiralama Koşulları:</Text>
        <Text style={styles.note}>- Teklifimiz 15 gün geçerlidir.</Text>
        <Text style={styles.note}>- Teklif edilen kiralama fiyatlarımıza; Rent A Car Kaskosu, İhtiyari Mali Mesuliyet Sigortası, Zorunlu Trafik Sigortası, periyodik servis bakımları ve mülkiyetle ilgili tüm vergiler dahildir.</Text>
        <Text style={styles.note}>- Belirtilen km aşım durumunda her km için 8,50 TL ile 10,50 TL + KDV arası ücret alınır.</Text>
        <Text style={styles.note}>- Araç lastikleri her 60.000 km’de değiştirilir. Aracın km’si değil lastiğin yapısı olduğu km esas alınacaktır.</Text>
        <Text style={styles.note}>- Araçlarımız kira süresi boyunca sabit fiyat garantilidir.</Text>
        <Text style={styles.note}>- Araç opsiyonlama işlemi yapılabilmesi adına gerekli evraklarınızla sipariş oluşturulmalıdır.</Text>

        <Text style={styles.note}>Tüm sorularınız için bir telefon mesafesi uzaklıktayız.</Text>
        <Text style={styles.note}>Saygılarımızla,</Text>
        <Text style={{ marginTop: 4 }}>LenaCars</Text>

        <View style={styles.footer}>
          <Text style={{ fontWeight: "bold", marginTop: 20 }}>Lena Mama Yayıncılık Ticaret A.Ş.</Text>
          <Text>Crea Center - Merkez, Çavuşbaşı Cd. 105/1 2-34372 Çekmeköy/İstanbul</Text>
          <Text>+90 537 777 79 29 | +90 850 532 7929 | info@lenacars.com | www.lenacars.com</Text>

          <View style={styles.grupLogolari}>
            {grupLogolari.map((item, index) => (
              <Link key={index} src={item.link}>
                <Image src={item.url} style={styles.grupLogo} />
              </Link>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};
