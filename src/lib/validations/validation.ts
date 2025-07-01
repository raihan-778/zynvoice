// 📁 src/lib/validations/validation.ts
import { z } from "zod";

// Company Information Schema
export const CompanyInfoSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Company name is required"),
  logo: z.string().optional(),
  address: z.string().optional(),
  contact: z
    .object({
      phone: z.string().optional(),
      email: z.string().email().optional(),
    })
    .optional(),
});

// Client Information Schema
export const ClientInfoSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Client name is required"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
});

// Invoice Item Schema

export const InvoiceItemSchema = z.object({
  id: z.number().optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description too long"),
  quantity: z
    .number()
    .min(0.01, "Quantity must be greater than 0")
    .max(10000, "Quantity too large"),
  rate: z
    .number()
    .min(0.01, "Rate must be greater than 0")
    .max(1000000, "Rate too large"),
  amount: z.number().optional(),
});

// Invoice Form Data Schema
export const InvoiceFormDataSchema = z.object({
  id: z.string().optional(),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  companyInfo: CompanyInfoSchema.optional(),
  client: ClientInfoSchema.optional(),
  items: z.array(InvoiceItemSchema).min(1, "At least one item is required"),
  dates: z.object({
    issued: z.date(),
    due: z.date(),
  }),
  currency: z.string().default("USD"),
  discountType: z.enum(["percentage", "fixed"]).default("percentage"),
  discountValue: z.number().min(0).default(0),
  taxRate: z.number().min(0).max(100).default(0),
  notes: z.string().optional(),
  terms: z.string().optional(),
  paymentInstructions: z.string().optional(),
  template: z.string().optional(),
  subtotal: z.number().optional(),
  tax: z.number().optional(),
  total: z.number().optional(),
  status: z.enum(["draft", "sent", "paid", "overdue"]).optional(),
});

// TypeScript types
export type CompanyInfo = z.infer<typeof CompanyInfoSchema>;
export type ClientInfo = z.infer<typeof ClientInfoSchema>;
export type InvoiceItem = z.infer<typeof InvoiceItemSchema>;
export type InvoiceFormData = z.infer<typeof InvoiceFormDataSchema>;

// Validation function
export function validateInvoiceData(data: unknown): InvoiceFormData {
  return InvoiceFormDataSchema.parse(data);
}

// Partial validation for form fields
export function validateInvoiceField<T extends keyof InvoiceFormData>(
  field: T,
  value: InvoiceFormData[T]
): boolean {
  try {
    const fieldSchema = InvoiceFormDataSchema.shape[field];
    fieldSchema.parse(value);
    return true;
  } catch {
    return false;
  }
}

export const InvoiceSchema = z
  .object({
    id: z.number().optional(),
    invoiceNumber: z
      .string()
      .regex(/^INV-\d{4}-\d{3}$/, "Invalid invoice number format"),
    clientId: z.number().min(1, "Client is required"),
    companyId: z.number().min(1, "Company is required"),
    issueDate: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), "Invalid issue date"),
    dueDate: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), "Invalid due date"),
    items: z.array(InvoiceItemSchema).min(1, "At least one item is required"),
    subtotal: z.number().optional(),
    taxRate: z.number().min(0).max(1).optional(),
    taxAmount: z.number().optional(),
    totalAmount: z.number().min(0.01, "Total amount must be greater than 0"),
    notes: z.string().max(1000, "Notes too long").optional(),
    status: z.enum(["draft", "sent", "paid", "overdue"]).optional(),
  })
  .refine(
    (data) => {
      const issueDate = new Date(data.issueDate);
      const dueDate = new Date(data.dueDate);
      return dueDate >= issueDate;
    },
    {
      message: "Due date must be after or equal to issue date",
      path: ["dueDate"],
    }
  );

export const ClientSearchSchema = z.object({
  search: z.string().optional(),
  limit: z.number().min(1).max(100).optional(),
});

// lib/validation.ts - Client-side validation utilities
import { InvoiceSchema } from "@/lib/validationSchemas";
import type { FormErrors, Invoice, InvoiceItem } from "@/types/invoice";

export const validateInvoiceForm = (
  formData: Partial<Invoice>
): {
  isValid: boolean;
  errors: FormErrors;
} => {
  const result = InvoiceSchema.safeParse(formData);

  if (result.success) {
    return { isValid: true, errors: {} };
  }

  const errors: FormErrors = {};
  result.error.errors.forEach((error) => {
    const path = error.path.join(".");
    errors[path] = error.message;
  });

  return { isValid: false, errors };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const calculateItemTotal = (quantity: number, rate: number): number => {
  return Number(((quantity || 0) * (rate || 0)).toFixed(2));
};

export const calculateInvoiceTotal = (items: InvoiceItem[]): number => {
  return Number(
    items
      .reduce((total, item) => {
        return total + calculateItemTotal(item.quantity, item.rate);
      }, 0)
      .toFixed(2)
  );
};

export const calculateTaxAmount = (
  subtotal: number,
  taxRate: number
): number => {
  return Number((subtotal * (taxRate || 0)).toFixed(2));
};
