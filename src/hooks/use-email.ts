// 8. EMAIL HOOK
// ===========================================

// hooks/useEmail.ts
import { EmailResponse } from "@/lib/email/config";
import { useState } from "react";
import { toast } from "sonner";

interface UseEmailOptions {
  onSuccess?: (response: EmailResponse) => void;
  onError?: (error: string) => void;
}

export const useEmail = (options: UseEmailOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);

  const sendEmailServerSide = async (
    to: string,
    invoiceData: any,
    pdfBuffer?: string,
    customMessage?: string,
    toName?: string
  ): Promise<EmailResponse> => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to,
          toName,
          invoiceData,
          pdfBuffer,
          customMessage,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Email sent successfully!");
        options.onSuccess?.(result);
      } else {
        toast.error(result.message || "Failed to send email");
        options.onError?.(result.message);
      }

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send email";
      toast.error(errorMessage);
      options.onError?.(errorMessage);

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmailClientSide = async (
    to: string,
    invoiceData: any,
    pdfBase64?: string,
    customMessage?: string,
    toName?: string
  ): Promise<EmailResponse> => {
    setIsLoading(true);

    try {
      const emailData = {
        to,
        toName,
        subject: `Invoice ${invoiceData.invoiceNumber} from ${invoiceData.companyName}`,
        message:
          customMessage ||
          `Please find attached your invoice #${invoiceData.invoiceNumber}`,
        invoiceNumber: invoiceData.invoiceNumber,
        companyName: invoiceData.companyName,
        pdfBase64,
      };

      const result = await emailjsService.sendInvoiceEmail(emailData);

      if (result.success) {
        toast.success("Email sent successfully!");
        options.onSuccess?.(result);
      } else {
        toast.error(result.message || "Failed to send email");
        options.onError?.(result.message);
      }

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send email";
      toast.error(errorMessage);
      options.onError?.(errorMessage);

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendEmailServerSide,
    sendEmailClientSide,
    isLoading,
  };
};
