import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

// Logo ve alt bilgi görselleri
const logoUrl = "https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/1746433174940-Untitled%20design%20(8).png";
const footerUrl = "https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/1746433163305-1.png";

// PDF stilleri
const styles = StyleSheet.create({
  page: {
    position: "relative",
    paddingTop: 80,      // Logo ve başlık için üst boşluk artırıldı
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 120,  // Alt bilgi için alt boşluk artırıldı
    fontSize: 10,
    fontFamily: "OpenSans", // OpenSans fontu kullanılıyor
  },
  logo: {
    width: 120, // Logo genişliği
    // height: "auto", // @react-pdf/renderer için geçerli değil, genellikle width ayarlanır, height orantılı olur.
    position: "absolute",
    top: 25, // Üstten konum
    left: 40, // Soldan konum
  },
  headerText: { // 'header' yerine daha açıklayıcı bir isim
    position: "absolute",
    top: 30,
    right: 40,
    fontSize: 10,
    fontWeight: "bold", // OpenSans için kalın stil, API'de OpenSans-Bold.ttf kayıtlıysa çalışır
    fontFamily: "OpenSans",
  },
  title: { // Belge için bir başlık eklendi
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "OpenSans",
    marginBottom: 20,
    marginTop: 0,
  },
  tableContainer: {
    marginTop: 10,
  },
  tableHeaderView: { // Sadece View için stil, fontWeight Text'e uygulanmalı
    flexDirection: "row",
    borderBottomWidth: 1.5,
    borderTopWidth: 1.5,
    borderColor: "#333",
    paddingVertical: 6,
    backgroundColor: "#f0f0f0",
  },
  tableHeaderText: { // Tablo başlık metinleri için stil
    flex: 1,
    paddingRight: 4,
    fontWeight: "bold", // Kalın stil doğrudan Text'e uygulanır
    fontFamily: "OpenSans",
    fontSize: 9,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
    paddingVertical: 5,
  },
  cell: {
    flex: 1,
    paddingRight: 4,
    fontSize: 9,
    fontFamily: "OpenSans",
  },
  footerView: { // Sadece View için stil
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
  },
  footerImage: {
    width: "80%",
    // height: "auto", // @react-pdf/renderer için geçerli değil
    marginLeft: "10%", // Genişlik %100'den azsa resmi ortalar
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
}

interface TeklifPdfProps {
  vehicles: Vehicle[];
}

export const TeklifPdf: React.FC<TeklifPdfProps> = ({ vehicles }) => {
  const today = new Date().toLocaleDateString("tr-TR", {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <Document author="LenaCars" title={`Araç Kiralama Teklifi - ${today}`}>
      <Page size="A4" style={styles.page}>
        {/* Logo */}
        <Image src={logoUrl} style={styles.logo} onError={(e) => console.error("Logo Resim Hatası:", e)} />

        {/* Teklif Tarihi */}
        <Text style={styles.headerText}>Teklif Tarihi: {today}</Text>

        {/* Belge Başlığı */}
        <Text style={styles.title}>Araç Kiralama Teklif Formu</Text>

        {/* Tablo */}
        <View style={styles.tableContainer}>
          {/* Tablo Başlıkları */}
          <View style={styles.tableHeaderView}>
            <Text style={[styles.tableHeaderText, { flex: 2.5 }]}>Araç Marka - Model</Text>
            <Text style={styles.tableHeaderText}>Vites</Text>
            <Text style={styles.tableHeaderText}>Yakıt</Text>
            <Text style={styles.tableHeaderText}>Km</Text>
            <Text style={styles.tableHeaderText}>Fiyat</Text>
          </View>

          {/* Araç Satırları */}
          {vehicles.map((v) => (
            <View style={styles.tableRow} key={v.id}>
              <Text style={[styles.cell, { flex: 2.5 }]}>{v.isim || "N/A"}</Text>
              <Text style={styles.cell}>{v.vites || "-"}</Text>
              <Text style={styles.cell}>{v.yakit_turu || "-"}</Text>
              <Text style={styles.cell}>
                {typeof v.km === "number" ? `${v.km.toLocaleString("tr-TR")} km` : "-"}
              </Text>
              <Text style={styles.cell}>
                {typeof v.fiyat === "number" ? `${v.fiyat.toLocaleString("tr-TR")} ₺` : "Fiyat Yok"}
              </Text>
            </View>
          ))}
        </View>

        {/* Alt Bilgi Görseli */}
        <View style={styles.footerView} fixed>
          <Image src={footerUrl} style={styles.footerImage} onError={(e) => console.error("Altbilgi Resim Hatası:", e)} />
        </View>
      </Page>
    </Document>
  );
};
