/* eslint-disable jsx-a11y/alt-text */
// 📁 src/components/invoice/download-buttons.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useInvoiceGenerator } from "@/hooks/use-invoice-generator";
import { ChevronDown, Download, FileText, Image } from "lucide-react";

import { ImageFormat } from "@/lib/services/image-generator";
import { InvoiceFormData } from "@/lib/validations/validation";

interface DownloadButtonsProps {
  invoiceData: InvoiceFormData;
  companyInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    logo?: string;
  };
  clientInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  invoiceNumber?: string;
  className?: string;
}

export function DownloadButtons({
  invoiceData,
  invoiceNumber,
  className,
}: DownloadButtonsProps) {
  const { isGenerating, generatePDF, generateImage } = useInvoiceGenerator();

  const handlePDFDownload = async () => {
    await generatePDF(invoiceData);
  };

  const handleImageDownload = async (format: ImageFormat) => {
    const filename = `invoice-${invoiceNumber || "draft"}`;
    await generateImage(format, filename);
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className || ""}`}>
      {/* PDF Download Button */}
      <Button
        onClick={handlePDFDownload}
        disabled={isGenerating}
        size="lg"
        className="flex items-center space-x-2"
      >
        <FileText className="w-4 h-4" />
        <span>{isGenerating ? "Generating..." : "Download PDF"}</span>
      </Button>

      {/* Image Download Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="lg"
            disabled={isGenerating}
            className="flex items-center space-x-2"
          >
            <Image className="w-4 h-4" />
            <span>Download Image</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => handleImageDownload("png")}
            disabled={isGenerating}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download as PNG</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleImageDownload("jpeg")}
            disabled={isGenerating}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download as JPEG</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleImageDownload("webp")}
            disabled={isGenerating}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download as WebP</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Combined Download Button for Mobile */}
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              disabled={isGenerating}
              className="w-full flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? "Generating..." : "Download"}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-48">
            <DropdownMenuItem
              onClick={handlePDFDownload}
              disabled={isGenerating}
              className="flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Download PDF</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleImageDownload("png")}
              disabled={isGenerating}
              className="flex items-center space-x-2"
            >
              <Image className="w-4 h-4" />
              <span>Download PNG</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleImageDownload("jpeg")}
              disabled={isGenerating}
              className="flex items-center space-x-2"
            >
              <Image className="w-4 h-4" />
              <span>Download JPEG</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
