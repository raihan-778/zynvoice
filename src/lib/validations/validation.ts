// 📁 src/lib/validations/validation.ts
import { z } from "zod";

// Company Information Schema
export const CompanyInfoSchema = z.object({
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
  id: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  rate: z.number().min(0, "Rate must be non-negative"),
});

// Invoice Form Data Schema
export const InvoiceFormDataSchema = z.object({
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
