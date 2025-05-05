import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

// LOGO ve ALT BİLGİ görsellerinin URL'leri:
const logoUrl = "https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/1746433174940-Untitled%20design%20(8).png";
const footerUrl = "https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/1746433163305-1.png";

// Stil tanımları:
const styles = StyleSheet.create({
  page: {
    position: "relative",
    paddingTop: 60,
    paddingBottom: 120,
    paddingHorizontal: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  logo: {
    position: "absolute",
    top: 20,
    left: 40,
    width: 120,
    height: 40,
    objectFit: "contain",
  },
  header: {
    position: "absolute",
    top: 30,
    right: 40,
    fontSize: 10,
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "#000",
    fontWeight: "bold",
    marginTop: 40,
    paddingVertical: 6,
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
    height: 80,
  },
});

interface Vehicle {
  id: string;
  isim: string;
  fiyat: number;
  kategori?: string;
  vites?: string;
  yakit_turu?: string;
  yil?: string;
  km?: string;
}

export const TeklifPdf = ({ vehicles }: { vehicles: Vehicle[] }) => {
  const today = new Date().toLocaleDateString("tr-TR");

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* LOGO */}
        <Image src={logoUrl} style={styles.logo} />

        {/* Tarih */}
        <Text style={styles.header}>Teklif Tarihi: {today}</Text>

        {/* Tablo Başlığı */}
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, { flex: 2 }]}>Araç Marka - Model</Text>
          <Text style={styles.cell}>Vites</Text>
          <Text style={styles.cell}>Yakıt</Text>
          <Text style={styles.cell}>Km</Text>
          <Text style={styles.cell}>Fiyat</Text>
        </View>

        {/* Tablo Satırları */}
        {vehicles.map((v) => (
          <View style={styles.tableRow} key={v.id}>
            <Text style={[styles.cell, { flex: 2 }]}>{v.isim}</Text>
            <Text style={styles.cell}>{v.vites || "-"}</Text>
            <Text style={styles.cell}>{v.yakit_turu || "-"}</Text>
            <Text style={styles.cell}>{v.km || "-"}</Text>
            <Text style={styles.cell}>
              {v.fiyat ? v.fiyat.toLocaleString("tr-TR") + " ₺" : "Fiyat Yok"}
            </Text>
          </View>
        ))}

        {/* ALT BİLGİ (footer) */}
        <Image src={footerUrl} style={styles.footer} />

      </Page>
    </Document>
  );
};
