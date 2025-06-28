// 📁 src/components/pdf/invoice-pdf-template.tsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { InvoiceFormData } from "@/lib/validations/validation";
import { Client, CompanyInfo } from "@/types/invoice";

// Register fonts (optional - for better typography)
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxK.woff2",
    },
    {
      src: "https://fonts.gstatic.com/s/roboto/v27/KFOlCnqEu92Fr1MmEU9fBBc4.woff2",
      fontWeight: "bold",
    },
  ],
});

// PDF Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 30,
    lineHeight: 1.5,
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  companyInfo: {
    flex: 1,
    paddingRight: 20,
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2563eb",
    textAlign: "right",
  },
  invoiceNumber: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "right",
    marginTop: 5,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#1f2937",
  },
  companyDetails: {
    fontSize: 10,
    color: "#6b7280",
    lineHeight: 1.4,
  },
  billToSection: {
    flexDirection: "row",
    marginBottom: 30,
    justifyContent: "space-between",
  },
  billToBox: {
    flex: 1,
    paddingRight: 20,
  },
  dateBox: {
    flex: 1,
    paddingLeft: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  clientName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#1f2937",
  },
  clientDetails: {
    fontSize: 10,
    color: "#6b7280",
    lineHeight: 1.4,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  dateLabel: {
    fontSize: 10,
    color: "#6b7280",
  },
  dateValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1f2937",
  },
  table: {
    width: "100%",
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    padding: 8,
    fontWeight: "bold",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    padding: 8,
    minHeight: 35,
  },
  tableColDescription: {
    flex: 3,
    paddingRight: 10,
  },
  tableColQuantity: {
    flex: 1,
    textAlign: "center",
  },
  tableColRate: {
    flex: 1,
    textAlign: "right",
  },
  tableColAmount: {
    flex: 1,
    textAlign: "right",
    fontWeight: "bold",
  },
  totalsSection: {
    width: "50%",
    alignSelf: "flex-end",
    marginTop: 20,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  totalLabel: {
    fontSize: 10,
    color: "#6b7280",
  },
  totalValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1f2937",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f3f4f6",
    marginTop: 5,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1f2937",
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2563eb",
  },
  notesSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 10,
  },
  notesText: {
    fontSize: 10,
    color: "#6b7280",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
});

interface InvoicePDFTemplateProps {
  data: InvoiceFormData;
  companyInfo: CompanyInfo;
  clientInfo: Client;
  invoiceNumber?: string;
}

export const InvoicePDFTemplate: React.FC<InvoicePDFTemplateProps> = ({
  data,
  companyInfo,
  clientInfo,
  invoiceNumber = "INV-001",
}) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const calculateSubtotal = () => {
    return data.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (data.discountType === "percentage") {
      return (subtotal * data.discountValue) / 100;
    }
    return data.discountValue;
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    return ((subtotal - discount) * data.taxRate) / 100;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    return subtotal - discount + tax;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            {companyInfo?.logo && (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image style={styles.logo} src={companyInfo.logo} />
            )}
            <Text style={styles.companyName}>
              {companyInfo?.name || "Your Company"}
            </Text>
            <Text style={styles.companyDetails}>
              {companyInfo?.address && `${companyInfo.address}\n`}
              {companyInfo?.phone && `Phone: ${companyInfo.phone}\n`}
              {companyInfo?.email && `Email: ${companyInfo.email}`}
            </Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>#{invoiceNumber}</Text>
          </View>
        </View>

        {/* Bill To & Dates */}
        <View style={styles.billToSection}>
          <View style={styles.billToBox}>
            <Text style={styles.sectionTitle}>Bill To</Text>
            <Text style={styles.clientName}>
              {clientInfo?.name || "Client Name"}
            </Text>
            <Text style={styles.clientDetails}>
              {clientInfo?.email && `${clientInfo.email}\n`}
              {clientInfo?.phone && `${clientInfo.phone}\n`}
              {clientInfo?.address && clientInfo.address}
            </Text>
          </View>
          <View style={styles.dateBox}>
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>Issue Date:</Text>
              <Text style={styles.dateValue}>
                {formatDate(data.dates.issued)}
              </Text>
            </View>
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>Due Date:</Text>
              <Text style={styles.dateValue}>{formatDate(data.dates.due)}</Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableColDescription}>Description</Text>
            <Text style={styles.tableColQuantity}>Qty</Text>
            <Text style={styles.tableColRate}>Rate</Text>
            <Text style={styles.tableColAmount}>Amount</Text>
          </View>
          {data.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableColDescription}>{item.description}</Text>
              <Text style={styles.tableColQuantity}>{item.quantity}</Text>
              <Text style={styles.tableColRate}>
                {formatCurrency(item.rate, data.currency)}
              </Text>
              <Text style={styles.tableColAmount}>
                {formatCurrency(item.quantity * item.rate, data.currency)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(calculateSubtotal(), data.currency)}
            </Text>
          </View>
          {data.discountValue > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Discount (
                {data.discountType === "percentage"
                  ? `${data.discountValue}%`
                  : "Fixed"}
                ):
              </Text>
              <Text style={styles.totalValue}>
                -{formatCurrency(calculateDiscount(), data.currency)}
              </Text>
            </View>
          )}
          {data.taxRate > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax ({data.taxRate}%):</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(calculateTax(), data.currency)}
              </Text>
            </View>
          )}
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total:</Text>
            <Text style={styles.grandTotalValue}>
              {formatCurrency(calculateTotal(), data.currency)}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {(data.notes || data.terms || data.paymentInstructions) && (
          <View style={styles.notesSection}>
            {data.notes && (
              <View style={{ marginBottom: 15 }}>
                <Text style={styles.notesTitle}>Notes</Text>
                <Text style={styles.notesText}>{data.notes}</Text>
              </View>
            )}
            {data.terms && (
              <View style={{ marginBottom: 15 }}>
                <Text style={styles.notesTitle}>Terms & Conditions</Text>
                <Text style={styles.notesText}>{data.terms}</Text>
              </View>
            )}
            {data.paymentInstructions && (
              <View>
                <Text style={styles.notesTitle}>Payment Instructions</Text>
                <Text style={styles.notesText}>{data.paymentInstructions}</Text>
              </View>
            )}
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Thank you for your business! • Generated on {formatDate(new Date())}
        </Text>
      </Page>
    </Document>
  );
};
