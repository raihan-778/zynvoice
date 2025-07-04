// / components/PDFExportButton.tsx
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import React from "react";

import { usePDFGeneration } from "@/hooks/useInvoicePdf";
import { InvoicePDFData } from "@/types/pdf";
import { toast } from "sonner";

interface PDFExportButtonProps {
  invoiceData: InvoicePDFData;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  children?: React.ReactNode;
  onPDFGenerated?: (blob: Blob) => void;
}

export const PDFExportButton: React.FC<PDFExportButtonProps> = ({
  invoiceData,
  variant = "default",
  size = "default",
  showIcon = true,
  children,
  onPDFGenerated,
}) => {
  const { downloadPDF, generatePDFBlob, isGenerating, error } =
    usePDFGeneration();

  const handleExport = async () => {
    try {
      const filename = `invoice-${invoiceData.invoice.invoiceNumber}-${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      // Generate blob for callback if provided
      if (onPDFGenerated) {
        const blob = await generatePDFBlob(invoiceData);
        onPDFGenerated(blob);
      }

      // Download the PDF
      await downloadPDF(invoiceData, filename);

      toast.success("PDF exported successfully!");
    } catch (err) {
      console.error("Export failed:", err);
      // You could also check the `error` from the hook here
      if (error) {
        toast.error(`PDF generation error: ${error}`);
      } else {
        toast.error("Failed to export PDF. Please try again.");
      }
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isGenerating}
      variant={variant}
      size={size}
      className="gap-2"
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : showIcon ? (
        <Download className="h-4 w-4" />
      ) : null}
      {children || (isGenerating ? "Generating..." : "Export PDF")}
    </Button>
  );
};
