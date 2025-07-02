// components/pdf/InvoicePDFTemplate.tsx

import { InvoicePDFData } from "@/types/pdf";
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

// Register fonts (optional - you can use system fonts)
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2",
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2",
      fontWeight: 600,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2",
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 10,
    paddingTop: 40,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 60,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#e5e7eb",
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  companyInfo: {
    flex: 1,
    maxWidth: "45%",
  },
  companyName: {
    fontSize: 18,
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: 8,
  },
  companyDetails: {
    fontSize: 9,
    color: "#6b7280",
    lineHeight: 1.4,
  },
  invoiceTitle: {
    textAlign: "right",
    flex: 1,
    maxWidth: "45%",
  },
  invoiceTitleText: {
    fontSize: 24,
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: 8,
  },
  invoiceNumber: {
    fontSize: 12,
    color: "#374151",
    marginBottom: 4,
  },
  statusBadge: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "4 8",
    borderRadius: 4,
    fontSize: 8,
    fontWeight: 600,
    textTransform: "uppercase",
    alignSelf: "flex-end",
    marginTop: 8,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: "#1f2937",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  billToSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  billToBox: {
    flex: 1,
    maxWidth: "45%",
  },
  clientName: {
    fontSize: 12,
    fontWeight: 600,
    color: "#1f2937",
    marginBottom: 6,
  },
  clientDetails: {
    fontSize: 9,
    color: "#6b7280",
    lineHeight: 1.4,
  },
  invoiceDates: {
    flex: 1,
    maxWidth: "45%",
    textAlign: "right",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 6,
  },
  dateLabel: {
    fontSize: 9,
    color: "#6b7280",
    width: 80,
    textAlign: "right",
    marginRight: 12,
  },
  dateValue: {
    fontSize: 9,
    color: "#1f2937",
    fontWeight: 600,
    width: 80,
    textAlign: "right",
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: 600,
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  descriptionHeader: {
    flex: 3,
  },
  quantityHeader: {
    flex: 1,
    textAlign: "center",
  },
  rateHeader: {
    flex: 1.5,
    textAlign: "right",
  },
  amountHeader: {
    flex: 1.5,
    textAlign: "right",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 35,
  },
  tableCell: {
    fontSize: 9,
    color: "#1f2937",
    alignSelf: "center",
  },
  descriptionCell: {
    flex: 3,
    fontWeight: 500,
  },
  quantityCell: {
    flex: 1,
    textAlign: "center",
  },
  rateCell: {
    flex: 1.5,
    textAlign: "right",
  },
  amountCell: {
    flex: 1.5,
    textAlign: "right",
    fontWeight: 600,
  },
  totalsSection: {
    marginTop: 20,
    marginLeft: "50%",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  totalLabel: {
    fontSize: 9,
    color: "#6b7280",
    width: 100,
  },
  totalValue: {
    fontSize: 9,
    color: "#1f2937",
    fontWeight: 500,
    width: 80,
    textAlign: "right",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f9fafb",
    borderTopWidth: 2,
    borderTopColor: "#e5e7eb",
    marginTop: 8,
  },
  grandTotalLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#1f2937",
    width: 100,
  },
  grandTotalValue: {
    fontSize: 11,
    fontWeight: 700,
    color: "#1f2937",
    width: 80,
    textAlign: "right",
  },
  notesSection: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#f9fafb",
    borderRadius: 4,
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: 600,
    color: "#1f2937",
    marginBottom: 8,
  },
  notesText: {
    fontSize: 9,
    color: "#6b7280",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 15,
  },
  bankDetails: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
  },
  bankTitle: {
    fontSize: 10,
    fontWeight: 600,
    color: "#1f2937",
    marginBottom: 8,
  },
  bankInfo: {
    fontSize: 8,
    color: "#64748b",
    lineHeight: 1.4,
  },
});

const formatCurrency = (amount: number, currency: string = "USD") => {
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
  }).format(new Date(date));
};

const getStatusColor = (status: string) => {
  const colors = {
    paid: { bg: "#dcfce7", text: "#166534" },
    sent: { bg: "#dbeafe", text: "#1d4ed8" },
    draft: { bg: "#f3f4f6", text: "#374151" },
    overdue: { bg: "#fee2e2", text: "#dc2626" },
    cancelled: { bg: "#fef3c7", text: "#d97706" },
  };
  return colors[status as keyof typeof colors] || colors.draft;
};

interface InvoicePDFTemplateProps {
  data: InvoicePDFData;
}

export const InvoicePDFTemplate: React.FC<InvoicePDFTemplateProps> = ({ data }) => {
  const { invoice, company, client } = data;
  const statusColors = getStatusColor(invoice.status);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            {company.logo && (
              <Image
                style={styles.logo}
                alt={company.name}
                src={company.logo}
              />
            )}
            <Text style={styles.companyName}>{company.name}</Text>
            <Text style={styles.companyDetails}>
              {company.address.street}
              {"\n"}
              {company.address.city}, {company.address.state}{" "}
              {company.address.zipCode}
              {"\n"}
              {company.address.country}
              {company.phone && `\n${company.phone}`}
              {"\n"}
              {company.email}
              {company.website && `\n${company.website}`}
              {company.taxId && `\nTax ID: ${company.taxId}`}
            </Text>
          </View>

          <View style={styles.invoiceTitle}>
            <Text style={styles.invoiceTitleText}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>#{invoice.invoiceNumber}</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: statusColors.bg,
                  color: statusColors.text,
                },
              ]}
            >
              <Text>{invoice.status}</Text>
            </View>
          </View>
        </View>

        {/* Bill To & Invoice Details */}
        <View style={styles.billToSection}>
          <View style={styles.billToBox}>
            <Text style={styles.sectionTitle}>Bill To</Text>
            <Text style={styles.clientName}>{client.name}</Text>
            {client.company && (
              <Text style={styles.clientDetails}>{client.company}</Text>
            )}
            <Text style={styles.clientDetails}>
              {client.address.street ? client.address.street + "\n" : ""}
              {client.address.city && client.address.state
                ? `${client.address.city}, ${client.address.state} ${client.address.zipCode}\n`
                : ""}
              {client.address.country ? client.address.country + "\n" : ""}
              {client.email}
              {client.phone ? "\n" + client.phone : ""}
            </Text>
          </View>

          <View style={styles.invoiceDates}>
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>Invoice Date:</Text>
              <Text style={styles.dateValue}>
                {formatDate(invoice.invoiceDate)}
              </Text>
            </View>
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>Due Date:</Text>
              <Text style={styles.dateValue}>
                {formatDate(invoice.dueDate)}
              </Text>
            </View>
            {invoice.paidAmount > 0 && (
              <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>Amount Paid:</Text>
                <Text style={styles.dateValue}>
                  {formatCurrency(invoice.paidAmount, invoice.currency)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.descriptionHeader]}>
              Description
            </Text>
            <Text style={[styles.tableHeaderCell, styles.quantityHeader]}>
              Qty
            </Text>
            <Text style={[styles.tableHeaderCell, styles.rateHeader]}>
              Rate
            </Text>
            <Text style={[styles.tableHeaderCell, styles.amountHeader]}>
              Amount
            </Text>
          </View>

          {invoice.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.descriptionCell]}>
                {item.description}
              </Text>
              <Text style={[styles.tableCell, styles.quantityCell]}>
                {item.quantity}
              </Text>
              <Text style={[styles.tableCell, styles.rateCell]}>
                {formatCurrency(item.rate, invoice.currency)}
              </Text>
              <Text style={[styles.tableCell, styles.amountCell]}>
                {formatCurrency(item.amount, invoice.currency)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(invoice.subtotal, invoice.currency)}
            </Text>
          </View>

          {invoice.discountAmount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Discount (
                {invoice.discountType === "percentage"
                  ? `${invoice.discountValue}%`
                  : formatCurrency(invoice.discountValue, invoice.currency)}
                ):
              </Text>
              <Text style={styles.totalValue}>
                -{formatCurrency(invoice.discountAmount, invoice.currency)}
              </Text>
            </View>
          )}

          {invoice.taxAmount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax ({invoice.taxRate}%):</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(invoice.taxAmount, invoice.currency)}
              </Text>
            </View>
          )}

          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total:</Text>
            <Text style={styles.grandTotalValue}>
              {formatCurrency(invoice.total, invoice.currency)}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Notes</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Terms */}
        {invoice.terms && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Terms & Conditions</Text>
            <Text style={styles.notesText}>{invoice.terms}</Text>
          </View>
        )}

        {/* Bank Details */}
        {company.bankDetails && (
          <View style={styles.bankDetails}>
            <Text style={styles.bankTitle}>Payment Details</Text>
            <Text style={styles.bankInfo}>
              {`Bank: ${company.bankDetails.bankName}
            Account Name: ${company.bankDetails.accountName}
            Account Number: ${company.bankDetails.accountNumber}
            ${
              company.bankDetails.routingNumber
                ? `Routing Number: ${company.bankDetails.routingNumber}\n`
                : ""
            }${
                company.bankDetails.swift
                  ? `SWIFT: ${company.bankDetails.swift}`
                  : ""
              }`}
            </Text>
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

export default InvoicePDFTemplate;
