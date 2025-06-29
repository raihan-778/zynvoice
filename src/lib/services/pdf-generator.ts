// import { InvoicePDFTemplate } from "@/components/pdf/invoice-template-pdf";
import { InvoicePDFTemplate } from "@/components/pdf/InvoicePDFTemplate";

import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { InvoiceFormData } from "../validations/validation";
// 📁 src/lib/services/pdf-generator.ts

export class PDFGeneratorService {
  static async generatePDF(invoiceData: InvoiceFormData): Promise<Blob> {
    try {
      const templateElement = InvoicePDFTemplate({ data: invoiceData });

      if (!templateElement) {
        throw new Error(
          "InvoicePDFTemplate did not return a valid React element."
        );
      }

      const pdfBlob = await pdf(
        templateElement as React.ReactElement<
          import("@react-pdf/renderer").DocumentProps
        >
      ).toBlob();
      return pdfBlob;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error("Failed to generate PDF");
    }
  }

  static async downloadPDF(invoiceData: InvoiceFormData): Promise<void> {
    try {
      const pdfBlob = await this.generatePDF(invoiceData);

      const fileName = `invoice-${invoiceData.invoiceNumber}-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      saveAs(pdfBlob, fileName);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      throw error;
    }
  }

  static async getPDFDataURL(invoiceData: InvoiceFormData): Promise<string> {
    try {
      const pdfBlob = await this.generatePDF(invoiceData);

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(pdfBlob);
      });
    } catch (error) {
      console.error("Error getting PDF data URL:", error);
      throw error;
    }
  }
}
