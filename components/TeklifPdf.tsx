"use client";

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

// 1. Roboto fontu register
Font.register({
  family: "Roboto",
  src: "/fonts/Roboto-Regular.ttf", // public klasörüne koymalısın
});

// 2. Logo
const logoUrl =
  "https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/2bf3ea48-ca84-4f34-a109-0a6ef8c7f914.png";

// 3. Styles
const styles = StyleSheet.create({
  page: {
    position: "relative",
    paddingTop: 40,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 80,
    fontSize: 10,
    fontFamily: "Roboto",
  },
  logo: {
    width: 120,
    height: "auto",
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
  title: {
    marginTop: 100,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  paragraph: {
    marginTop: 20,
    marginBottom: 4,
    fontSize: 10,
    lineHeight: 1.5,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "#000",
    fontWeight: "bold",
    marginTop: 20,
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
        {/* Logo */}
        <Image src={logoUrl} style={styles.logo} />

        {/* Teklif Tarihi */}
        <Text style={styles.header}>Teklif Tarihi: {today}</Text>

        {/* Başlık */}
        <Text style={styles.title}>Araç Kiralama Teklif Formu</Text>

        {/* Açıklama */}
        <Text style={styles.paragraph}>
          Değerli Müşteri Adayımız,
        </Text>
        <Text style={styles.paragraph}>
          "Birlikte kazanırsak, gerçekten kazanırız" anlayışıyla hareket eden LenaCars olarak, araç kiralama teklifimizi
          paylaşıyoruz. Başarılı yolculuğunuzda her adımınızı kolaylaştırmak için buradayız.
        </Text>
        <Text style={styles.paragraph}>
          Tüm sorularınız için bir telefon mesafesi uzaklıktayız. Değerli geri dönüşlerinizi bekliyoruz.
        </Text>
        <Text style={styles.paragraph}>Saygılarımızla,</Text>
        <Text style={styles.paragraph}>LenaCars</Text>

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
            <Text style={styles.cell}>
              {typeof v.km === "number"
                ? v.km.toLocaleString("tr-TR") + " km"
                : "-"}
            </Text>
            <Text style={styles.cell}>
              {typeof v.fiyat === "number"
                ? v.fiyat.toLocaleString("tr-TR") + " ₺"
                : "Fiyat Yok"}
            </Text>
          </View>
        ))}
      </Page>
    </Document>
  );
};
