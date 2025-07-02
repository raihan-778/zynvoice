// hooks/usePDFGeneration.ts
import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { InvoicePDFData } from "@/types/pdf";

export const usePDFGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePDFBlob = async (data: InvoicePDFData): Promise<Blob> => {
    try {
      setIsGenerating(true);
      setError(null);

      const doc = <InvoicePDFTemplate />;
      const blob = await pdf(doc).toBlob();

      return blob;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate PDF";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = async (data: InvoicePDFData, filename?: string) => {
    try {
      const blob = await generatePDFBlob(data);
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download =
        filename || `invoice-${String(data.invoice.invoiceNumber)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download PDF:", err);
      throw err;
    }
  };

  const generatePDFDataURL = async (data: InvoicePDFData): Promise<string> => {
    try {
      const blob = await generatePDFBlob(data);
      return URL.createObjectURL(blob);
    } catch (err) {
      console.error("Failed to generate PDF data URL:", err);
      throw err;
    }
  };

  return {
    generatePDFBlob,
    downloadPDF,
    generatePDFDataURL,
    isGenerating,
    error,
  };
};
