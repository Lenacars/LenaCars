import { Document, Page, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, marginBottom: 20 },
  item: { fontSize: 16, marginBottom: 10 },
});

export function TeklifPdf({ vehicles }: { vehicles: any[] }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Teklif Detayları</Text>
        {vehicles.map((v, index) => (
          <Text style={styles.item} key={index}>
            {v.isim} - {v.fiyat ? v.fiyat.toLocaleString() : "Fiyat Yok"} ₺
          </Text>
        ))}
      </Page>
    </Document>
  );
}
