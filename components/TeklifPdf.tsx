import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

const logoUrl = "https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/1746433174940-Untitled%20design%20(8).png";
const footerUrl = "https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/1746433163305-1.png";

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    paddingTop: 60,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 80,
    fontFamily: "OpenSans", // ✔️ artık düzgün
  },
  logo: {
    width: 120,
    position: "absolute",
    top: 20,
    left: 40,
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
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
    marginTop: 100,
    paddingTop: 5,
    paddingBottom: 5,
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
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  footerImage: {
    width: "60%",
    height: "auto",
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

export const TeklifPdf = ({ vehicles }: { vehicles: Vehicle[] }) => {
  const today = new Date().toLocaleDateString("tr-TR");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src={logoUrl} style={styles.logo} />
        <Text style={styles.header}>Teklif Tarihi: {today}</Text>

        <View style={styles.tableHeader}>
          <Text style={[styles.cell, { flex: 2 }]}>Araç Marka - Model</Text>
          <Text style={styles.cell}>Vites</Text>
          <Text style={styles.cell}>Yakıt</Text>
          <Text style={styles.cell}>Km</Text>
          <Text style={styles.cell}>Fiyat</Text>
        </View>

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

        <View style={styles.footer}>
          <Image src={footerUrl} style={styles.footerImage} />
        </View>
      </Page>
    </Document>
  );
};
