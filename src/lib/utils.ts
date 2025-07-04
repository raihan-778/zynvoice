import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export function formatCurrency(amount: number, currency: string): string {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//   }).format(amount);
// }

// export function formatDate(date: Date): string {
//   return new Intl.DateTimeFormat("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   }).format(date);
// }

// export function generateInvoiceNumber(): string {
//   const now = new Date();
//   const year = now.getFullYear();
//   const month = String(now.getMonth() + 1).padStart(2, "0");
//   const day = String(now.getDate()).padStart(2, "0");
//   const random = Math.floor(Math.random() * 1000)
//     .toString()
//     .padStart(3, "0");

//   return `INV-${year}${month}${day}-${random}`;
// }

export function calculateItemAmount(quantity: number, rate: number): number {
  return Math.round(quantity * rate * 100) / 100;
}

export function calculateSubtotal(items: { amount: number }[]): number {
  return (
    Math.round(items.reduce((sum, item) => sum + item.amount, 0) * 100) / 100
  );
}

export function calculateTax(subtotal: number, taxRate: number): number {
  return Math.round(((subtotal * taxRate) / 100) * 100) / 100;
}

export function calculateTotal(subtotal: number, taxAmount: number): number {
  return Math.round((subtotal + taxAmount) * 100) / 100;
}

export function formatDate(date: Date | string | undefined): string {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export function generateInvoiceNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `INV-${timestamp}-${random}`;
}

// 15. PERFORMANCE OPTIMIZATIONS
// ===========================================

import { useEffect, useState } from "react";

// utils/animationUtils.ts
export const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

export const getAnimationProps = (baseProps: any) => {
  if (
    typeof window !== "undefined" &&
    window.matchMedia(reducedMotionQuery).matches
  ) {
    return {
      ...baseProps,
      transition: { duration: 0 },
      animate: baseProps.initial || {},
    };
  }
  return baseProps;
};

// Custom hook for respecting reduced motion preferences
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(reducedMotionQuery);
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

// Section 2: Input Validation Functions
// function validateInvoiceData(data: InvoiceRequestBody): ValidationError[] {
//   const errors: ValidationError[] = [];

//   // Required fields validation
//   if (!data.companyId?.trim()) {
//     errors.push({ field: "companyId", message: "Company ID is required" });
//   }

//   if (!data.clientId?.trim()) {
//     errors.push({ field: "clientId", message: "Client ID is required" });
//   }

//   if (!data.invoiceNumber?.trim()) {
//     errors.push({
//       field: "invoiceNumber",
//       message: "Invoice number is required",
//     });
//   }

//   if (!data.invoiceDate) {
//     errors.push({ field: "invoiceDate", message: "Invoice date is required" });
//   }

//   if (!data.dueDate) {
//     errors.push({ field: "dueDate", message: "Due date is required" });
//   }

//   // Validate ObjectId format
//   if (data.companyId && !mongoose.Types.ObjectId.isValid(data.companyId)) {
//     errors.push({ field: "companyId", message: "Invalid company ID format" });
//   }

//   if (data.clientId && !mongoose.Types.ObjectId.isValid(data.clientId)) {
//     errors.push({ field: "clientId", message: "Invalid client ID format" });
//   }

//   // Validate dates
//   if (data.invoiceDate && isNaN(Date.parse(data.invoiceDate))) {
//     errors.push({
//       field: "invoiceDate",
//       message: "Invalid invoice date format",
//     });
//   }

//   if (data.dueDate && isNaN(Date.parse(data.dueDate))) {
//     errors.push({ field: "dueDate", message: "Invalid due date format" });
//   }

//   // Validate due date is after invoice date
//   if (data.invoiceDate && data.dueDate) {
//     const invoiceDate = new Date(data.invoiceDate);
//     const dueDate = new Date(data.dueDate);
//     if (dueDate <= invoiceDate) {
//       errors.push({
//         field: "dueDate",
//         message: "Due date must be after invoice date",
//       });
//     }
//   }

//   // Validate items array
//   if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
//     errors.push({ field: "items", message: "At least one item is required" });
//   } else {
//     data.items.forEach(
//       (
//         item: { description: string; quantity: number; rate: number },
//         index: unknown
//       ) => {
//         if (!item.description?.trim()) {
//           errors.push({
//             field: `items[${index}].description`,
//             message: "Item description is required",
//           });
//         }
//         if (!item.quantity || item.quantity <= 0) {
//           errors.push({
//             field: `items[${index}].quantity`,
//             message: "Item quantity must be greater than 0",
//           });
//         }
//         if (item.rate < 0) {
//           errors.push({
//             field: `items[${index}].rate`,
//             message: "Item rate cannot be negative",
//           });
//         }
//       }
//     );
//   }

//   // Validate numeric fields
//   if (data.taxRate < 0 || data.taxRate > 100) {
//     errors.push({
//       field: "taxRate",
//       message: "Tax rate must be between 0 and 100",
//     });
//   }

//   if (data.discountValue < 0) {
//     errors.push({
//       field: "discountValue",
//       message: "Discount value cannot be negative",
//     });
//   }

//   if (data.discountType === "percentage" && data.discountValue > 100) {
//     errors.push({
//       field: "discountValue",
//       message: "Percentage discount cannot exceed 100%",
//     });
//   }

//   if (data.paymentTerms < 0) {
//     errors.push({
//       field: "paymentTerms",
//       message: "Payment terms cannot be negative",
//     });
//   }

//   if (data.total < 0) {
//     errors.push({ field: "total", message: "Total amount cannot be negative" });
//   }

//   // Validate recurring settings
//   if (data.recurring?.isRecurring) {
//     if (!data.recurring.frequency) {
//       errors.push({
//         field: "recurring.frequency",
//         message: "Frequency is required for recurring invoices",
//       });
//     }
//     if (!data.recurring.nextDate) {
//       errors.push({
//         field: "recurring.nextDate",
//         message: "Next date is required for recurring invoices",
//       });
//     }
//     if (data.recurring.nextDate && isNaN(Date.parse(data.recurring.nextDate))) {
//       errors.push({
//         field: "recurring.nextDate",
//         message: "Invalid next date format",
//       });
//     }
//     if (data.recurring.endDate && isNaN(Date.parse(data.recurring.endDate))) {
//       errors.push({
//         field: "recurring.endDate",
//         message: "Invalid end date format",
//       });
//     }
//   }

//   return errors;
// }
