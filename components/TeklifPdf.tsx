import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

// Logo ve alt bilgi görselleri
const logoUrl = "https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/1746433174940-Untitled%20design%20(8).png";
const footerUrl = "https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/1746433163305-1.png";

// PDF stilleri
const styles = StyleSheet.create({
  page: {
    position: "relative",
    paddingTop: 40,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 100, // Alt bilgi için boşluk bırakıldı
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  logo: {
    width: 100,
    height: "auto",
    marginBottom: 10,
    position: "absolute",
    top: 20,
    left: 20,
  },
  header: {
    position: "absolute",
    top: 30,
    right: 40,
    fontSize: 12,
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "#000",
    fontWeight: "bold",
    marginTop: 120,
    paddingTop: 4,
    paddingBottom: 4,
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
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
  },
  footerImage: {
    width: "100%",
    height: "auto",
  },
});

interface Vehicle {
  id: string;
  isim: string;
  fiyat: number | null;    // null gelebilir!
  kategori?: string;
  vites?: string;
  yakit_turu?: string;
  yil?: string;
  km?: number | null;      // null gelebilir!
}

export const TeklifPdf = ({ vehicles }: { vehicles: Vehicle[] }) => {
  const today = new Date().toLocaleDateString("tr-TR");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logo */}
        <Image src={logoUrl} style={styles.logo} />

        {/* Teklif Tarihi */}
        <Text style={styles.header}>Teklif Tarihi: {today}</Text>

        {/* Tablo Başlıkları */}
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, { flex: 2 }]}>Araç Marka - Model</Text>
          <Text style={styles.cell}>Vites</Text>
          <Text style={styles.cell}>Yakıt</Text>
          <Text style={styles.cell}>Km</Text>
          <Text style={styles.cell}>Fiyat</Text>
        </View>

        {/* Araç Satırları */}
        {vehicles.map((v) => (
          <View style={styles.tableRow} key={v.id}>
            <Text style={[styles.cell, { flex: 2 }]}>{v.isim}</Text>
            <Text style={styles.cell}>{v.vites || "-"}</Text>
            <Text style={styles.cell}>{v.yakit_turu || "-"}</Text>
            <Text style={styles.cell}>
              {typeof v.km === "number" ? v.km.toLocaleString("tr-TR") + " km" : "-"}
            </Text>
            <Text style={styles.cell}>
              {typeof v.fiyat === "number" ? v.fiyat.toLocaleString("tr-TR") + " ₺" : "Fiyat Yok"}
            </Text>
          </View>
        ))}

        {/* Alt Bilgi Görseli */}
        <View style={styles.footer}>
          <Image src={footerUrl} style={styles.footerImage} />
        </View>
      </Page>
    </Document>
  );
};
