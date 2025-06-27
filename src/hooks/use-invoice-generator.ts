// 📁 src/hooks/use-invoice-generator.ts
"use client";

import {
  ImageFormat,
  ImageGeneratorService,
} from "@/lib/services/image-generator";
import { PDFGeneratorService } from "@/lib/services/pdf-generator";
import { useRef, useState } from "react";

import { InvoiceFormData } from "@/lib/validations/validation";
import { toast } from "sonner";

export function useInvoiceGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const generatePDF = async (
    invoiceData: InvoiceFormData,
    companyInfo: any,
    clientInfo: any,
    invoiceNumber?: string
  ) => {
    setIsGenerating(true);
    try {
      await PDFGeneratorService.downloadPDF(
        invoiceData,
        companyInfo,
        clientInfo,
        invoiceNumber
      );
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImage = async (
    format: ImageFormat = "png",
    filename: string = "invoice"
  ) => {
    if (!previewRef.current) {
      toast.error("Invoice preview not found");
      return;
    }

    setIsGenerating(true);
    try {
      await ImageGeneratorService.downloadImage(
        previewRef.current,
        filename,
        format,
        {
          quality: 1,
          backgroundColor: "#ffffff",
          width: 1200, // Fixed width for consistent output
        }
      );
      toast.success(`${format.toUpperCase()} image downloaded successfully!`);
    } catch (error) {
      console.error("Image generation failed:", error);
      toast.error(
        `Failed to generate ${format.toUpperCase()} image. Please try again.`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const getPDFBlob = async (
    invoiceData: InvoiceFormData,
    companyInfo: unknown,
    clientInfo: unknown,
    invoiceNumber?: string
  ): Promise<Blob | null> => {
    try {
      return await PDFGeneratorService.generatePDF(
        invoiceData,
        companyInfo,
        clientInfo,
        invoiceNumber
      );
    } catch (error) {
      console.error("PDF blob generation failed:", error);
      return null;
    }
  };

  const getImageBlob = async (
    format: ImageFormat = "png"
  ): Promise<Blob | null> => {
    if (!previewRef.current) {
      console.error("Invoice preview not found");
      return null;
    }

    try {
      const dataUrl: string = await ImageGeneratorService.generateImage(
        previewRef.current,
        format,
        {
          quality: 1,
          backgroundColor: "#ffffff",
          width: 1200,
        }
      );
      // Convert data URL to Blob
      const arr = dataUrl.split(",");
      const mime = arr[0].match(/:(.*?);/)?.[1] || "";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    } catch (error) {
      console.error("Image blob generation failed:", error);
      return null;
    }
  };

  return {
    isGenerating,
    previewRef,
    generatePDF,
    generateImage,
    getPDFBlob,
    getImageBlob,
  };
}
