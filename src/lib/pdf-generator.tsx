// ==========================================
// 2. PDF GENERATOR USING REACT-PDF
// ==========================================

// lib/pdf-generator.tsx
import { Invoice } from "@/types/invoice";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React from "react";

// Register fonts (optional - for better typography)
// Font.register({
//   family: 'Inter',
//   src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2'
// });

// Create styles for PDF
const createStyles = (template: string) => {
  const colors = {
    modern: {
      primary: "#3B82F6",
      secondary: "#1E40AF",
      accent: "#EFF6FF",
      text: "#1F2937",
    },
    classic: {
      primary: "#374151",
      secondary: "#111827",
      accent: "#F9FAFB",
      text: "#374151",
    },
    minimal: {
      primary: "#10B981",
      secondary: "#059669",
      accent: "#ECFDF5",
      text: "#1F2937",
    },
    elegant: {
      primary: "#7C3AED",
      secondary: "#5B21B6",
      accent: "#F3E8FF",
      text: "#1F2937",
    },
  };

  const theme = colors[template as keyof typeof colors] || colors.modern;

  return StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#FFFFFF",
      padding: 30,
      fontFamily: "Helvetica",
      fontSize: 10,
      color: theme.text,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 30,
    },
    companyInfo: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    logo: {
      width: 50,
      height: 50,
      marginRight: 15,
    },
    companyDetails: {
      flexDirection: "column",
    },
    companyName: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.primary,
      marginBottom: 5,
    },
    companyAddress: {
      fontSize: 9,
      color: "#6B7280",
      lineHeight: 1.4,
    },
    invoiceTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.primary,
      textAlign: "right",
    },
    invoiceNumber: {
      fontSize: 10,
      color: "#6B7280",
      textAlign: "right",
      marginTop: 5,
    },
    billToSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 30,
    },
    billToContainer: {
      flex: 1,
    },
    billToTitle: {
      fontSize: 12,
      fontWeight: "bold",
      color: theme.secondary,
      marginBottom: 8,
    },
    clientInfo: {
      fontSize: 10,
      lineHeight: 1.4,
    },
    clientName: {
      fontWeight: "bold",
      marginBottom: 3,
    },
    invoiceDetails: {
      alignItems: "flex-end",
    },
    invoiceDetailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: 150,
      marginBottom: 3,
    },
    invoiceDetailLabel: {
      fontWeight: "bold",
      fontSize: 9,
    },
    invoiceDetailValue: {
      fontSize: 9,
    },
    table: {
      marginBottom: 20,
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: theme.primary,
      color: "#FFFFFF",
      padding: 8,
      fontSize: 10,
      fontWeight: "bold",
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#E5E7EB",
      padding: 8,
      fontSize: 9,
    },
    tableRowEven: {
      backgroundColor: "#F9FAFB",
    },
    descriptionColumn: {
      flex: 2,
    },
    quantityColumn: {
      flex: 1,
      textAlign: "center",
    },
    rateColumn: {
      flex: 1,
      textAlign: "center",
    },
    amountColumn: {
      flex: 1,
      textAlign: "right",
      fontWeight: "bold",
    },
    totalsSection: {
      alignItems: "flex-end",
      marginBottom: 20,
    },
    totalsContainer: {
      width: 200,
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 5,
      fontSize: 10,
    },
    totalRowFinal: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: theme.primary,
      color: "#FFFFFF",
      padding: 8,
      fontWeight: "bold",
      fontSize: 12,
    },
    notesSection: {
      marginBottom: 20,
    },
    notesTitle: {
      fontSize: 12,
      fontWeight: "bold",
      color: theme.secondary,
      marginBottom: 8,
    },
    notesText: {
      fontSize: 9,
      lineHeight: 1.4,
      color: "#6B7280",
    },
    footer: {
      textAlign: "center",
      borderTopWidth: 1,
      borderTopColor: "#E5E7EB",
      paddingTop: 15,
      fontSize: 9,
      color: "#9CA3AF",
    },
  });
};

// PDF Document Component
const InvoicePDF: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
  const styles = createStyles(invoice.template);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            {invoice.company.logo && (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image style={styles.logo} src={invoice.company.logo} />
            )}
            <View style={styles.companyDetails}>
              <Text style={styles.companyName}>{invoice.company.name}</Text>
              <Text style={styles.companyAddress}>
                {invoice.company.address}
              </Text>
              <Text style={styles.companyAddress}>
                {invoice.company.phone} • {invoice.company.email}
              </Text>
              {invoice.company.website && (
                <Text style={styles.companyAddress}>
                  {invoice.company.website}
                </Text>
              )}
            </View>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
          </View>
        </View>

        {/* Bill To Section */}
        <View style={styles.billToSection}>
          <View style={styles.billToContainer}>
            <Text style={styles.billToTitle}>Bill To:</Text>
            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>{invoice.client.name}</Text>
              <Text>{invoice.client.address}</Text>
              <Text>{invoice.client.phone}</Text>
              <Text>{invoice.client.email}</Text>
            </View>
          </View>
          <View style={styles.invoiceDetails}>
            <View style={styles.invoiceDetailRow}>
              <Text style={styles.invoiceDetailLabel}>Invoice Date:</Text>
              <Text style={styles.invoiceDetailValue}>
                {new Date(invoice.date).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.invoiceDetailRow}>
              <Text style={styles.invoiceDetailLabel}>Due Date:</Text>
              <Text style={styles.invoiceDetailValue}>
                {new Date(invoice.dueDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.descriptionColumn}>Description</Text>
            <Text style={styles.quantityColumn}>Qty</Text>
            <Text style={styles.rateColumn}>Rate</Text>
            <Text style={styles.amountColumn}>Amount</Text>
          </View>
          {invoice.items.map((item, index) => (
            <View
              key={item.id}
              style={
                index % 2 === 0
                  ? [styles.tableRow, styles.tableRowEven]
                  : [styles.tableRow]
              }
            >
              <Text style={styles.descriptionColumn}>{item.description}</Text>
              <Text style={styles.quantityColumn}>{item.quantity}</Text>
              <Text style={styles.rateColumn}>${item.rate.toFixed(2)}</Text>
              <Text style={styles.amountColumn}>${item.amount.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsContainer}>
            <View style={styles.totalRow}>
              <Text>Subtotal:</Text>
              <Text>${invoice.subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Tax (10%):</Text>
              <Text>${invoice.tax.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRowFinal}>
              <Text>Total:</Text>
              <Text>${invoice.total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Notes:</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
        </View>
      </Page>
    </Document>
  );
};

export { InvoicePDF };
