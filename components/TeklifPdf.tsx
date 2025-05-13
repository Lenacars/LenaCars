import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

// 🔁 Güncel Logo ve Footer URL'leri
const logoUrl = "https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/866644b2-4e89-4dec-84a8-e607311ece2e.png";
const footerUrl = "https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/2bf3ea48-ca84-4f34-a109-0a6ef8c7f914.png";

const styles = StyleSheet.create({
  page: {
    position: "relative",
    paddingTop: 80,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 120,
    fontSize: 10,
    fontFamily: "OpenSans",
  },
  logo: {
    width: 120,
    position: "absolute",
    top: 25,
    left: 40,
  },
  headerText: {
    position: "absolute",
    top: 30,
    right: 40,
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "OpenSans",
  },
  title: {
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
  tableHeaderView: {
    flexDirection: "row",
    borderBottomWidth: 1.5,
    borderTopWidth: 1.5,
    borderColor: "#333",
    paddingVertical: 6,
    backgroundColor: "#f0f0f0",
  },
  tableHeaderText: {
    flex: 1,
    paddingRight: 4,
    fontWeight: "bold",
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
  footerView: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
  },
  footerImage: {
    width: "80%",
    marginLeft: "10%",
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
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document author="LenaCars" title={`Araç Kiralama Teklifi - ${today}`}>
      <Page size="A4" style={styles.page}>
        <Image src={logoUrl} style={styles.logo} />

        <Text style={styles.headerText}>Teklif Tarihi: {today}</Text>
        <Text style={styles.title}>Araç Kiralama Teklif Formu</Text>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeaderView}>
            <Text style={[styles.tableHeaderText, { flex: 2.5 }]}>Araç Marka - Model</Text>
            <Text style={styles.tableHeaderText}>Vites</Text>
            <Text style={styles.tableHeaderText}>Yakıt</Text>
            <Text style={styles.tableHeaderText}>Km</Text>
            <Text style={styles.tableHeaderText}>Fiyat</Text>
          </View>

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

        <View style={styles.footerView} fixed>
          <Image src={footerUrl} style={styles.footerImage} />
        </View>
      </Page>
    </Document>
  );
};
