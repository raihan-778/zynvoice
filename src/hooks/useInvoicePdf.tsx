// 2. PDF Generation Hook - /hooks/useInvoicePDF.ts
import { InvoicePDF } from "@/components/pdf/InvoicePDFTemplate";
import { UseInvoicePDFProps } from "@/types/pdf";

import { pdf } from "@react-pdf/renderer";
import { useCallback, useState } from "react";

export const useInvoicePDF = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePDF = useCallback(
    async ({
      invoiceData,
      selectedCompany,
      selectedClient,
      calculations,
      template,
    }: UseInvoicePDFProps) => {
      setIsGenerating(true);
      setError(null);

      try {
        // Generate PDF blob
        const doc = (
          <InvoicePDF
            invoiceData={invoiceData}
            selectedCompany={selectedCompany}
            selectedClient={selectedClient}
            calculations={calculations}
            template={template}
          />
        );

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
    },
    []
  );

  const downloadPDF = useCallback(
    async (props: UseInvoicePDFProps, filename?: string) => {
      try {
        const blob = await generatePDF(props);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download =
          filename || `invoice-${props.invoiceData.invoiceNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Error downloading PDF:", err);
      }
    },
    [generatePDF]
  );

  const previewPDF = useCallback(
    async (props: UseInvoicePDFProps) => {
      try {
        const blob = await generatePDF(props);
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
        // Clean up URL after a delay to allow the browser to load it
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (err) {
        console.error("Error previewing PDF:", err);
      }
    },
    [generatePDF]
  );

  return {
    generatePDF,
    downloadPDF,
    previewPDF,
    isGenerating,
    error,
  };
};
