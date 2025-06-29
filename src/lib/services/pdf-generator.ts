// import { InvoicePDFTemplate } from "@/components/pdf/InvoicePDFTemplate";

// import { pdf } from "@react-pdf/renderer";
// import { saveAs } from "file-saver";
// import { InvoiceFormData } from "../validations/validation";
// // 📁 src/lib/services/pdf-generator.ts

// export class PDFGeneratorService {
//   static async generatePDF(invoiceData: InvoiceFormData): Promise<Blob> {
//     try {
//       console.log("pdf generating");
//       const templateElement = InvoicePDFTemplate({ data: invoiceData });

//       if (!templateElement) {
//         throw new Error(
//           "InvoicePDFTemplate did not return a valid React element."
//         );
//       }

//       const pdfBlob = await pdf(
//         templateElement as React.ReactElement<
//           import("@react-pdf/renderer").DocumentProps
//         >
//       ).toBlob();
//       return pdfBlob;
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//       throw new Error("Failed to generate PDF");
//     }
//   }

//   static async downloadPDF(invoiceData: InvoiceFormData): Promise<void> {
//     try {
//       const pdfBlob = await this.generatePDF(invoiceData);

//       const fileName = `invoice-${invoiceData.invoiceNumber}-${
//         new Date().toISOString().split("T")[0]
//       }.pdf`;
//       saveAs(pdfBlob, fileName);
//     } catch (error) {
//       console.error("Error downloading PDF:", error);
//       throw error;
//     }
//   }

//   static async getPDFDataURL(invoiceData: InvoiceFormData): Promise<string> {
//     try {
//       const pdfBlob = await this.generatePDF(invoiceData);

//       return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = () => resolve(reader.result as string);
//         reader.onerror = reject;
//         reader.readAsDataURL(pdfBlob);
//       });
//     } catch (error) {
//       console.error("Error getting PDF data URL:", error);
//       throw error;
//     }
//   }
// }

// 📁 src/lib/services/pdf-generator.ts

import { InvoicePDFTemplate } from "@/components/pdf/InvoicePDFTemplate";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import React from "react";
import { InvoiceFormData } from "../validations/validation";

export class PDFGeneratorService {
  static async generatePDF(invoiceData: InvoiceFormData): Promise<Blob> {
    try {
      console.log("PDF generating...", invoiceData);

      // Validate invoice data
      if (!invoiceData) {
        throw new Error("Invoice data is required");
      }

      // Create the PDF template component wrapped in a <Document>
      const { Document } = await import("@react-pdf/renderer");
      const templateElement = React.createElement(
        Document,
        null,
        React.createElement(InvoicePDFTemplate, { data: invoiceData })
      );

      if (!templateElement) {
        throw new Error(
          "InvoicePDFTemplate did not return a valid React element."
        );
      }

      // Generate PDF blob
      const pdfBlob = await pdf(templateElement).toBlob();

      console.log("PDF generated successfully");
      return pdfBlob;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error(
        `Failed to generate PDF: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  static async downloadPDF(invoiceData: InvoiceFormData): Promise<void> {
    try {
      const pdfBlob = await this.generatePDF(invoiceData);

      const fileName = `invoice-${invoiceData.invoiceNumber || "draft"}-${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      saveAs(pdfBlob, fileName);
      console.log(`PDF downloaded: ${fileName}`);
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

  static async previewPDF(invoiceData: InvoiceFormData): Promise<string> {
    try {
      const pdfBlob = await this.generatePDF(invoiceData);
      return URL.createObjectURL(pdfBlob);
    } catch (error) {
      console.error("Error creating PDF preview:", error);
      throw error;
    }
  }
}
