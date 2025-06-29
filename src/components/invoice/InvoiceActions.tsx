// components/invoice/InvoiceActions.tsx (Fixed)
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ImageFormat,
  ImageGeneratorService,
} from "@/lib/services/image-generator";
import { JSPDFService } from "@/lib/services/jspdf.service";
import { PDFGeneratorService } from "@/lib/services/pdf-generator";
import { Invoice } from "@/lib/validations/validation";

import { motion } from "framer-motion";
import {
  Download,
  FileText,
  Image as ImageIcon,
  Loader2,
  Mail,
  Palette,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface InvoiceActionsProps {
  invoice: Invoice;

  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
  onGenerateInvoice: () => Promise<void>;
  onDownloadPDF: () => Promise<void>;
  onDownloadImage: () => Promise<void>;
  onSendEmail: () => Promise<void>;
  isGenerating: boolean;
  isDownloading: boolean;
  isSending: boolean;
}

const templates = [
  {
    id: "modern",
    name: "Modern",
    preview: "Modern professional design",
    colors: { primary: "#3B82F6", secondary: "#1E40AF", accent: "#EFF6FF" },
  },
  {
    id: "classic",
    name: "Classic",
    preview: "Traditional business style",
    colors: { primary: "#374151", secondary: "#111827", accent: "#F9FAFB" },
  },
  {
    id: "minimal",
    name: "Minimal",
    preview: "Clean and simple layout",
    colors: { primary: "#10B981", secondary: "#059669", accent: "#ECFDF5" },
  },
  {
    id: "elegant",
    name: "Elegant",
    preview: "Sophisticated design",
    colors: { primary: "#7C3AED", secondary: "#5B21B6", accent: "#F3E8FF" },
  },
];

export const InvoiceActions: React.FC<InvoiceActionsProps> = ({
  invoice,
  selectedTemplate,
  onTemplateChange,
  onSendEmail,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleDownloadPDF = async (useReactPDF = true) => {
    setIsDownloading(true);
    try {
      if (useReactPDF) {
        await PDFGeneratorService.downloadPDF(invoice);
      } else {
        JSPDFService.downloadPDF(invoice);
      }

      toast("Success!", {
        description: "PDF downloaded successfully.",
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);

      toast("Error!", {
        description: "Failed to download PDF. Please try again.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadImage = async (format: ImageFormat = "png") => {
    setIsDownloading(true);
    try {
      const invoiceElement = document.getElementById("invoice-preview");
      if (!invoiceElement) {
        toast("Error", {
          description: "Invoice preview element not found.",
        });
        setIsDownloading(false);
        return;
      }
      await ImageGeneratorService.downloadImage(
        invoiceElement,
        `invoice-${invoice.invoiceNumber}`,
        format,
        {
          quality: 0.95,
          backgroundColor: "#ffffff",
          width: 1200,
          height: 1600,
        }
      );

      toast("Success!", {
        description: `${format.toUpperCase()} image downloaded successfully.`,
      });
    } catch (error) {
      console.error("Error downloading image:", error);
      toast("Error", {
        description: `Failed to download ${format.toUpperCase()} image. Please try again.`,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGenerateInvoice = async () => {
    setIsGenerating(true);
    try {
      // Generate PDF blob for preview or processing
      const pdfBlob = await PDFGeneratorService.generatePDF(invoice);
      console.log("Invoice generated successfully:", pdfBlob);

      toast("Success!", {
        description: "Invoice generated successfully.",
      });
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast("Error", {
        description: "Failed to generate invoice. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    try {
      await onSendEmail();

      toast("Success!", {
        description: "Invoice sent successfully via email.",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      toast("Error", {
        description: "Failed to send invoice via email. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Template Selector */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span className="text-sm font-medium">Choose Template</span>
              </div>
              <Select value={selectedTemplate} onValueChange={onTemplateChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: template.colors.primary }}
                        />
                        {template.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Generate Invoice */}
              <Button
                onClick={handleGenerateInvoice}
                disabled={isGenerating}
                className="w-full flex items-center gap-2"
                size="lg"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                {isGenerating ? "Generating..." : "Generate Invoice"}
              </Button>

              {/* PDF Download Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleDownloadPDF(true)}
                  disabled={isDownloading}
                  className="flex items-center gap-2"
                >
                  {isDownloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  PDF (React-PDF)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDownloadPDF(false)}
                  disabled={isDownloading}
                  className="flex items-center gap-2"
                >
                  {isDownloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  PDF (jsPDF)
                </Button>
              </div>

              {/* Image Download Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleDownloadImage("png")}
                  disabled={isDownloading}
                  className="flex items-center gap-2"
                >
                  {isDownloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImageIcon className="h-4 w-4" />
                  )}
                  Download PNG
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDownloadImage("jpeg")}
                  disabled={isDownloading}
                  className="flex items-center gap-2"
                >
                  {isDownloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImageIcon className="h-4 w-4" />
                  )}
                  Download JPEG
                </Button>
              </div>

              {/* Email Invoice */}
              <Button
                variant="outline"
                onClick={handleSendEmail}
                disabled={isSending}
                className="w-full flex items-center gap-2"
                size="lg"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                {isSending ? "Sending..." : "Send via Email"}
              </Button>
            </div>

            {/* Template Preview */}
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium">Template Preview</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                {templates.find((t) => t.id === selectedTemplate) && (
                  <>
                    <div className="flex gap-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: templates.find(
                            (t) => t.id === selectedTemplate
                          )?.colors.primary,
                        }}
                      />
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: templates.find(
                            (t) => t.id === selectedTemplate
                          )?.colors.secondary,
                        }}
                      />
                      <div
                        className="w-3 h-3 rounded-full border"
                        style={{
                          backgroundColor: templates.find(
                            (t) => t.id === selectedTemplate
                          )?.colors.accent,
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {templates.find((t) => t.id === selectedTemplate)?.name}{" "}
                      Template
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InvoiceActions;
