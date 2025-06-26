import { pdf } from "@react-pdf/renderer";

import { InvoicePDF } from "@/lib/pdf-generator";
import { Invoice } from "@/types/invoice";

export class PDFService {
  static async generatePDF(invoice: Invoice): Promise<Blob> {
    try {
      const invoiceElement = InvoicePDF({ invoice });
      if (
        !invoiceElement ||
        typeof invoiceElement !== "object" ||
        !("type" in invoiceElement)
      ) {
        throw new Error("InvoicePDF did not return a valid ReactElement");
      }
      const blob = await pdf(
        invoiceElement as React.ReactElement<
          import("@react-pdf/renderer").DocumentProps
        >
      ).toBlob();
      return blob;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error("Failed to generate PDF");
    }
  }

  static async downloadPDF(invoice: Invoice, filename?: string): Promise<void> {
    try {
      const blob = await this.generatePDF(invoice);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || `invoice-${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      throw error;
    }
  }

  static async getPDFBase64(invoice: Invoice): Promise<string> {
    try {
      const blob = await this.generatePDF(invoice);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting PDF to base64:", error);
      throw error;
    }
  }
}
