// components/TeklifPdf.tsx
"use client";
import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

// Arka plan görseli URL
const backgroundImage =
  "https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/1746373140622-teklif.png";

// PDF stilleri
const styles = StyleSheet.create({
  page: {
    position: "relative",
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
  },
  header: {
    marginBottom: 20,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "#000",
    fontWeight: "bold",
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
        {/* Arka Plan */}
        <Image src={backgroundImage} style={styles.background} />

        {/* Teklif Tarihi */}
        <Text style={styles.header}>Teklif Tarihi: {today}</Text>

        {/* Araçlar Tablosu Başlık */}
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, { flex: 2 }]}>Araç Marka - Model</Text>
          <Text style={styles.cell}>Vites</Text>
          <Text style={styles.cell}>Yakıt</Text>
          <Text style={styles.cell}>Km</Text>
          <Text style={styles.cell}>Fiyat</Text>
        </View>

        {/* Araçlar Tablosu */}
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
      </Page>
    </Document>
  );
};
