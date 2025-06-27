// 📁 src/lib/utils/invoice-utils.ts

import { ServiceItem } from "@/types/invoice";

/**
 * Format number as currency
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculate subtotal from invoice items
 */
export function calculateSubtotal(items: ServiceItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
}

/**
 * Calculate total with tax and discount
 */
export function calculateTotal(
  items: ServiceItem[],
  taxRate: number = 0,
  discount: number = 0
): number {
  const subtotal = calculateSubtotal(items);
  const taxAmount = subtotal * (taxRate / 100);
  return subtotal + taxAmount - discount;
}

/**
 * Generate invoice number
 */
export function generateInvoiceNumber(prefix: string = "INV"): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `${prefix}-${year}${month}${day}-${random}`;
}

/**
 * Format date for invoice
 */
export function formatInvoiceDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Calculate due date
 */
export function calculateDueDate(
  issueDate: Date,
  paymentTerms: number = 30
): Date {
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + paymentTerms);
  return dueDate;
}

/**
 * Validate invoice data
 */
export function validateInvoiceData(data: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check required fields
  if (!data.items || data.items.length === 0) {
    errors.push("At least one invoice item is required");
  }

  if (data.items) {
    data.items.forEach((item: any, index: number) => {
      if (!item.description?.trim()) {
        errors.push(`Item ${index + 1}: Description is required`);
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Valid quantity is required`);
      }
      if (!item.rate || item.rate <= 0) {
        errors.push(`Item ${index + 1}: Valid rate is required`);
      }
    });
  }

  if (data.taxRate && (data.taxRate < 0 || data.taxRate > 100)) {
    errors.push("Tax rate must be between 0 and 100");
  }

  if (data.discount && data.discount < 0) {
    errors.push("Discount cannot be negative");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Create invoice filename
 */
export function createInvoiceFilename(
  invoiceNumber: string,
  clientName: string,
  extension: "pdf" | "png" | "jpeg" | "webp" = "pdf"
): string {
  const sanitizedClientName = clientName
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `invoice-${invoiceNumber}-${sanitizedClientName}.${extension}`;
}

/**
 * Get invoice status based on dates
 */
export function getInvoiceStatus(
  issueDate: Date,
  dueDate: Date
): "draft" | "sent" | "overdue" | "paid" {
  const now = new Date();
  const issueDateObj = new Date(issueDate);
  const dueDateObj = new Date(dueDate);

  if (now < issueDateObj) return "draft";
  if (now > dueDateObj) return "overdue";
  return "sent";
}

/**
 * Convert blob to base64 for email attachments
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        // Remove data URL prefix to get just base64
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to convert blob to base64"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
