export * from "@/lib/validations/validation";
export * from "@/types/database";

export interface EmailRecord {
  id: string;
  invoiceId: string;
  recipientEmail: string;
  subject: string;
  status: "sent" | "failed" | "pending";
  sentAt: Date;
  error?: string;
  attachmentType: "pdf" | "image";
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  isDefault: boolean;
}

export interface SendEmailOptions {
  recipientEmail: string;
  subject: string;
  message: string;
  attachmentType: "pdf" | "image";
  imageFormat?: "png" | "jpeg";
  templateId?: string;
}
