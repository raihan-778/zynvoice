import { InvoicePDFTemplate } from "@/components/pdf/invoice-template-pdf";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { InvoiceFormData } from "../validations/validation";
// 📁 src/lib/services/pdf-generator.ts

export class PDFGeneratorService {
  static async generatePDF(
    invoiceData: InvoiceFormData,
    companyInfo: unknown,
    clientInfo: unknown,
    invoiceNumber?: string
  ): Promise<Blob> {
    try {
      const pdfBlob = await pdf(
        InvoicePDFTemplate({
          data: invoiceData,
          companyInfo,
          clientInfo,
          invoiceNumber,
        }) as React.ReactElement<import("@react-pdf/renderer").DocumentProps>
      ).toBlob();

      return pdfBlob;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error("Failed to generate PDF");
    }
  }

  static async downloadPDF(
    invoiceData: InvoiceFormData,
    companyInfo: unknown,
    clientInfo: unknown,
    invoiceNumber: string = "INV-001"
  ): Promise<void> {
    try {
      const pdfBlob = await this.generatePDF(
        invoiceData,
        companyInfo,
        clientInfo,
        invoiceNumber
      );

      const fileName = `invoice-${invoiceNumber}-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      saveAs(pdfBlob, fileName);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      throw error;
    }
  }

  static async getPDFDataURL(
    invoiceData: InvoiceFormData,
    companyInfo: unknown,
    clientInfo: unknown,
    invoiceNumber?: string
  ): Promise<string> {
    try {
      const pdfBlob = await this.generatePDF(
        invoiceData,
        companyInfo,
        clientInfo,
        invoiceNumber
      );

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
