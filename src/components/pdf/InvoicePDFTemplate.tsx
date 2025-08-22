// First, install the required dependencies:
// npm install @react-pdf/renderer

// 1. PDF Document Component - /components/pdf/InvoicePDF.tsx

import { InvoicePdfProps, ITemplate } from "@/types/database";
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React from "react";

// Register fonts (optional - you can use system fonts)
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2",
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2",
      fontWeight: "bold",
    },
  ],
});

// Create PDF styles with default fallbacks
const createStyles = (template: ITemplate) => {
  // Provide default values if template is null or undefined
  const safeTemplate = {
    name: template?.name || "Modern",
    primaryColor: template?.primaryColor || "#3b82f6",
    secondaryColor: template?.secondaryColor || "#1e40af",
    fontFamily: template?.fontFamily || "Helvetica",
    fontSize: template?.fontSize || 12,
    showLogo: template?.showLogo !== false,
    showCompanyAddress: template?.showCompanyAddress !== false,
    showClientAddress: template?.showClientAddress !== false,
    showInvoiceNumber: template?.showInvoiceNumber !== false,
    showDates: true,
    showPaymentTerms: true,
    showNotes: true,
    showTerms: true,
  };

  return StyleSheet.create({
    page: {
      fontFamily: safeTemplate.fontFamily === "Inter" ? "Inter" : "Helvetica",
      fontSize: safeTemplate.fontSize,
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 35,
      color: safeTemplate.secondaryColor,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 30,
    },
    logo: {
      width: 60,
      height: 60,
      backgroundColor: safeTemplate.primaryColor,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    logoText: {
      color: "white",
      fontSize: 24,
      fontWeight: "bold",
    },
    invoiceTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: safeTemplate.primaryColor,
      marginBottom: 8,
    },
    invoiceNumber: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 4,
    },
    status: {
      fontSize: 12,
      backgroundColor: "#f3f4f6",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      textTransform: "uppercase",
    },
    addressSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 30,
    },
    addressBlock: {
      flex: 1,
      marginRight: 20,
    },
    addressTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: safeTemplate.primaryColor,
      marginBottom: 8,
    },
    addressText: {
      fontSize: 11,
      lineHeight: 1.5,
      marginBottom: 2,
    },
    companyName: {
      fontSize: 13,
      fontWeight: "bold",
      marginBottom: 2,
    },
    detailsSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 30,
    },
    detailBlock: {
      flex: 1,
    },
    detailTitle: {
      fontSize: 12,
      fontWeight: "bold",
      color: safeTemplate.primaryColor,
      marginBottom: 4,
    },
    detailText: {
      fontSize: 11,
    },
    table: {
      marginBottom: 20,
    },
    tableHeader: {
      flexDirection: "row",
      borderBottomWidth: 2,
      borderBottomColor: safeTemplate.primaryColor,
      paddingBottom: 8,
      marginBottom: 8,
    },
    tableHeaderCell: {
      fontSize: 12,
      fontWeight: "bold",
      color: safeTemplate.primaryColor,
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#e5e7eb",
      paddingVertical: 8,
    },
    tableCell: {
      fontSize: 11,
    },
    descriptionCell: {
      flex: 6,
    },
    quantityCell: {
      flex: 2,
      textAlign: "center",
    },
    rateCell: {
      flex: 2,
      textAlign: "right",
    },
    amountCell: {
      flex: 2,
      textAlign: "right",
      fontWeight: "bold",
    },
    totalsSection: {
      alignItems: "flex-end",
      marginBottom: 30,
    },
    totalsTable: {
      width: 250,
    },
    totalsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 4,
    },
    totalsLabel: {
      fontSize: 11,
    },
    totalsValue: {
      fontSize: 11,
      fontWeight: "bold",
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 8,
      borderTopWidth: 2,
      borderTopColor: safeTemplate.primaryColor,
      marginTop: 8,
    },
    totalLabel: {
      fontSize: 14,
      fontWeight: "bold",
      color: safeTemplate.primaryColor,
    },
    totalValue: {
      fontSize: 14,
      fontWeight: "bold",
      color: safeTemplate.primaryColor,
    },
    notesSection: {
      marginBottom: 20,
    },
    notesTitle: {
      fontSize: 12,
      fontWeight: "bold",
      color: template.primaryColor,
      marginBottom: 8,
    },
    notesText: {
      fontSize: 10,
      lineHeight: 1.5,
    },
    footer: {
      position: "absolute",
      fontSize: 10,
      bottom: 30,
      left: 35,
      right: 35,
      textAlign: "center",
      color: "#6b7280",
    },
  });
};

export const InvoicePDF: React.FC<InvoicePdfProps> = ({
  invoiceData,
  selectedCompany,
  selectedClient,
  calculations,
  template,
}) => {
  // Add this validation right at the start
  if (!template) {
    console.error("Template is undefined in InvoicePDF component");
    return null; // or return a loading state
  }
  // Default template fallback
  const defaultTemplate = {
    name: "Default",
    primaryColor: "#2563eb",
    secondaryColor: "#64748b",
    fontFamily: "Helvetica",
    fontSize: 12,
    showLogo: true,
    showCompanyAddress: true,
    showClientAddress: true,
    showInvoiceNumber: true,
    showDates: true,
    showPaymentTerms: true,
    showNotes: true,
    showTerms: true,
    layout: "modern",
    logoPosition: "left",
    isDefault: true,
    isPublic: false,
  };

  const activeTemplate = template || defaultTemplate;
  const styles = createStyles(activeTemplate);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: invoiceData?.currency,
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "#6b7280";
      case "sent":
        return "#3b82f6";
      case "viewed":
        return "#f59e0b";
      case "paid":
        return "#10b981";
      case "overdue":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {template.showLogo ? (
            <View style={styles.logo}>
              <Text style={styles.logoText}>{template?.name?.charAt(0)}</Text>
            </View>
          ) : null}

          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            {template.showInvoiceNumber && (
              <Text style={styles.invoiceNumber}>
                {invoiceData?.invoiceNumber}
              </Text>
            )}
            <Text
              style={[
                styles.status,
                { color: getStatusColor(invoiceData?.status ?? "draft") },
              ]}
            >
              {invoiceData?.status}
            </Text>
          </View>
        </View>

        {/* Company & Client Information */}
        <View style={styles.addressSection}>
          {template.showCompanyAddress && (
            <View style={styles.addressBlock}>
              <Text style={styles.addressTitle}>From:</Text>
              <Text style={styles.companyName}>{selectedCompany.name}</Text>
              <Text style={styles.addressText}>
                {selectedCompany?.address.country}
              </Text>

              <Text style={styles.addressText}>{selectedCompany?.email}</Text>
              <Text style={styles.addressText}>{selectedCompany?.phone}</Text>
            </View>
          )}

          {template.showClientAddress && (
            <View style={styles.addressBlock}>
              <Text style={styles.addressTitle}>Bill To:</Text>
              <Text style={styles.companyName}>{selectedClient.name}</Text>
              <Text style={styles.addressText}>
                {selectedClient.address?.street}
              </Text>
              <Text style={styles.addressText}>
                {selectedClient.address?.city}, {selectedClient.address?.state}{" "}
                {selectedClient.address?.zipCode}
              </Text>
              <Text style={styles.addressText}>
                {selectedClient.address?.country}
              </Text>
              <Text style={styles.addressText}>{selectedClient.email}</Text>
              <Text style={styles.addressText}>{selectedClient.phone}</Text>
            </View>
          )}
        </View>

        {/* Invoice Details */}
        {template.showDates && (
          <View style={styles.detailsSection}>
            <View style={styles.detailBlock}>
              <Text style={styles.detailTitle}>Invoice Date:</Text>
              <Text style={styles.detailText}>
                {invoiceData?.invoiceDate
                  ? formatDate(invoiceData.invoiceDate)
                  : "N?A"}
              </Text>
            </View>
            <View style={styles.detailBlock}>
              <Text style={styles.detailTitle}>Due Date:</Text>
              <Text style={styles.detailText}>
                {invoiceData?.dueDate ? formatDate(invoiceData.dueDate) : "N/A"}
              </Text>
            </View>
            {template.showPaymentTerms && (
              <View style={styles.detailBlock}>
                <Text style={styles.detailTitle}>Payment Terms:</Text>
                <Text style={styles.detailText}>
                  Net {invoiceData?.paymentTerms} days
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.descriptionCell]}>
              Description
            </Text>
            <Text style={[styles.tableHeaderCell, styles.quantityCell]}>
              Qty
            </Text>
            <Text style={[styles.tableHeaderCell, styles.rateCell]}>Rate</Text>
            <Text style={[styles.tableHeaderCell, styles.amountCell]}>
              Amount
            </Text>
          </View>

          {invoiceData?.items?.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.descriptionCell]}>
                {item.description}
              </Text>
              <Text style={[styles.tableCell, styles.quantityCell]}>
                {item.quantity}
              </Text>
              <Text style={[styles.tableCell, styles.rateCell]}>
                {formatCurrency(item.rate)}
              </Text>
              <Text style={[styles.tableCell, styles.amountCell]}>
                {formatCurrency(item.amount)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsTable}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal:</Text>
              <Text style={styles.totalsValue}>
                {formatCurrency(calculations.subtotal)}
              </Text>
            </View>

            {invoiceData && invoiceData?.discountValue > 0 && (
              <View style={styles.totalsRow}>
                <Text style={[styles.totalsLabel, { color: "#10b981" }]}>
                  Discount ({invoiceData.discountValue}%):
                </Text>
                <Text style={[styles.totalsValue, { color: "#10b981" }]}>
                  -{formatCurrency(calculations.discountAmount)}
                </Text>
              </View>
            )}

            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>
                Tax ({invoiceData?.taxRate}%):
              </Text>
              <Text style={styles.totalsValue}>
                {formatCurrency(calculations.taxAmount)}
              </Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(calculations.total)}
              </Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {template.showNotes && invoiceData?.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Notes:</Text>
            <Text style={styles.notesText}>{invoiceData.notes}</Text>
          </View>
        )}

        {/* Terms */}
        {template.showTerms && invoiceData?.terms && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Terms & Conditions:</Text>
            <Text style={styles.notesText}>{invoiceData.terms}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Generated on {formatDate(new Date())} • {selectedCompany.name}
        </Text>
      </Page>
    </Document>
  );
};
