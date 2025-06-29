// / services/dfjps - service.ts;

import jsPDF from "jspdf";
import { InvoiceFormData } from "../validations/validation";

export class JSPDFService {
  static generatePDF(invoice: InvoiceFormData): jsPDF {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Set up colors based on template
    const colors: {
      modern: {
        primary: [number, number, number];
        secondary: [number, number, number];
      };
      classic: {
        primary: [number, number, number];
        secondary: [number, number, number];
      };
      minimal: {
        primary: [number, number, number];
        secondary: [number, number, number];
      };
      elegant: {
        primary: [number, number, number];
        secondary: [number, number, number];
      };
    } = {
      modern: { primary: [59, 130, 246], secondary: [30, 64, 175] },
      classic: { primary: [55, 65, 81], secondary: [17, 24, 39] },
      minimal: { primary: [16, 185, 129], secondary: [5, 150, 105] },
      elegant: { primary: [124, 58, 237], secondary: [91, 33, 182] },
    };

    const theme =
      colors[invoice.template as keyof typeof colors] || colors.modern;
    let yPosition = 20;

    // Header
    doc.setFontSize(24);
    doc.setTextColor(...theme.primary);
    doc.text("INVOICE", pageWidth - 50, yPosition, { align: "right" });

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(invoice.invoiceNumber, pageWidth - 50, yPosition + 8, {
      align: "right",
    });

    // Company Info
    if (invoice.companyInfo?.logo) {
      try {
        doc.addImage(
          invoice.companyInfo.logo,
          "JPEG",
          20,
          yPosition - 5,
          20,
          20
        );
      } catch (error) {
        console.warn("Could not add logo to PDF:", error);
      }
    }

    doc.setFontSize(16);
    doc.setTextColor(...theme.primary);
    doc.text(
      invoice.companyInfo?.name || "",
      invoice.companyInfo?.logo ? 50 : 20,
      yPosition + 5
    );

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const formatAddress = (
      address:
        | string
        | {
            street: string;
            city: string;
            state: string;
            zipCode: string;
            country: string;
          }
    ) => {
      if (typeof address === "string") return address;
      if (address && typeof address === "object") {
        const { street, city, state, zipCode, country } = address;
        return [street, city, state, zipCode, country]
          .filter(Boolean)
          .join(", ");
      }
      return "";
    };

    const companyLines = [
      formatAddress(invoice.companyInfo?.address ?? ""),
      `${invoice.companyInfo?.contact?.phone ?? ""} • ${
        invoice?.companyInfo?.contact?.email ?? ""
      }`,
    ].filter(Boolean);

    companyLines.forEach((line, index) => {
      return doc.text(
        line || "",
        invoice.companyInfo?.logo ? 50 : 20,
        yPosition + 15 + index * 5
      );
    });

    yPosition += 50;

    // Bill To Section
    doc.setFontSize(12);
    doc.setTextColor(...theme.secondary);
    doc.text("Bill To:", 20, yPosition);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(invoice?.client?.name || "", 20, yPosition + 8);
    doc.text(invoice?.client?.email || "", 20, yPosition + 16);
    doc.text(invoice.client?.address?.street || "", 20, yPosition + 24);
    if (client?.address?.city || client?.address?.zip) {
      doc.text(
        `${client.address.city || ""}, ${client.address.zip || ""}`,
        20,
        yPosition + 32
      );
    }

    // Invoice Details
    const invoiceDate = new Date(invoice.dates.issued).toLocaleDateString();
    const dueDate = new Date(invoice.dates.due).toLocaleDateString();

    doc.text(`Invoice Date: ${invoiceDate}`, pageWidth - 80, yPosition + 8, {
      align: "right",
    });
    doc.text(`Due Date: ${dueDate}`, pageWidth - 80, yPosition + 16, {
      align: "right",
    });

    yPosition += 50;

    // Items Table Header
    doc.setFillColor(...theme.primary);
    doc.rect(20, yPosition, pageWidth - 40, 10, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("Description", 25, yPosition + 7);
    doc.text("Qty", pageWidth - 120, yPosition + 7, { align: "center" });
    doc.text("Rate", pageWidth - 80, yPosition + 7, { align: "center" });
    doc.text("Amount", pageWidth - 30, yPosition + 7, { align: "right" });

    yPosition += 15;

    // Items
    doc.setTextColor(0, 0, 0);
    invoice.items.forEach((item, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(20, yPosition - 3, pageWidth - 40, 10, "F");
      }

      doc.text(item.description, 25, yPosition + 4);
      doc.text(item.quantity.toString(), pageWidth - 120, yPosition + 4, {
        align: "center",
      });
      doc.text(`$${item.rate.toFixed(2)}`, pageWidth - 80, yPosition + 4, {
        align: "center",
      });
      doc.text(
        `$${(item?.rate ?? 0).toFixed(2)}`,
        pageWidth - 30,
        yPosition + 4,
        {
          align: "right",
        }
      );

      yPosition += 12;
    });

    yPosition += 10;

    // Totals
    const totalsX = pageWidth - 80;
    doc.text(`Subtotal: $${invoice.subtotal?.toFixed(2)}`, totalsX, yPosition, {
      align: "right",
    });
    doc.text(`Tax (10%): $${invoice.tax?.toFixed(2)}`, totalsX, yPosition + 8, {
      align: "right",
    });

    doc.setFillColor(...theme.primary);
    doc.rect(totalsX - 60, yPosition + 12, 60, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text(`Total: $${invoice.total?.toFixed(2)}`, totalsX, yPosition + 19, {
      align: "right",
    });

    yPosition += 35;

    // Notes
    if (invoice.notes) {
      doc.setTextColor(...theme.secondary);
      doc.setFontSize(12);
      doc.text("Notes:", 20, yPosition);

      doc.setTextColor(100, 100, 100);
      doc.setFontSize(10);
      const notesLines = doc.splitTextToSize(invoice.notes, pageWidth - 40);
      doc.text(notesLines, 20, yPosition + 8);
      yPosition += notesLines.length * 5 + 15;
    }

    // Footer
    doc.setDrawColor(229, 231, 235);
    doc.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30);

    doc.setTextColor(156, 163, 175);
    doc.setFontSize(10);
    doc.text("Thank you for your business!", pageWidth / 2, pageHeight - 20, {
      align: "center",
    });

    return doc;
  }

  static downloadPDF(invoice: InvoiceFormData, filename?: string): void {
    const doc = this.generatePDF(invoice);
    doc.save(filename || `invoice-${invoice.invoiceNumber}.pdf`);
  }

  static getPDFBlob(invoice: InvoiceFormData): Blob {
    const doc = this.generatePDF(invoice);
    return doc.output("blob");
  }

  static getPDFBase64(invoice: InvoiceFormData): string {
    const doc = this.generatePDF(invoice);
    return doc.output("datauristring").split(",")[1];
  }
}
