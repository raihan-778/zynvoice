// 📁 src/lib/validations.ts
import { z } from "zod";

// Company Info Validation
export const companyInfoSchema = z.object({
  name: z.string().min(1, "Company name is required").max(100, "Name too long"),
  logo: z.string().url("Invalid logo URL").optional().or(z.literal("")),
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "Zip code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  contact: z.object({
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  }),
  bankDetails: z
    .object({
      bankName: z.string().optional(),
      accountNumber: z.string().optional(),
      routingNumber: z.string().optional(),
      accountHolderName: z.string().optional(),
    })
    .optional(),
  taxInfo: z
    .object({
      taxId: z.string().optional(),
      vatNumber: z.string().optional(),
    })
    .optional(),
});

// Client Validation
export const clientSchema = z.object({
  name: z.string().min(1, "Client name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "Zip code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  notes: z.string().max(500, "Notes too long").optional(),
});

// Service Item Validation
export const serviceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  rate: z.number().min(0, "Rate must be 0 or higher"),
  category: z.enum([
    "Design",
    "Development",
    "Consulting",
    "Marketing",
    "Other",
  ]),
  unit: z.enum(["hour", "day", "week", "month", "project", "piece"]),
  taxable: z.boolean(),
  taxRate: z.number().min(0).max(100),
});

// Your existing schema
export const invoiceSchema = z.object({
  client: z.string().min(1, "Client is required"),
  companyInfo: z.string().min(1, "Company info is required"),
  template: z.string().min(1, "Template is required"),
  items: z
    .array(serviceItemSchema)
    .min(1, "At least one service item is required"),
  taxRate: z.number().min(0).max(100).default(0),
  discountType: z.enum(["percentage", "fixed"]).default("percentage"),
  discountValue: z.number().min(0).default(0),
  currency: z
    .enum(["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "INR"])
    .default("USD"),
  dates: z.object({
    // issued: z.union([z.string(), z.date()]).transform((val) => new Date(val)),
    // due: z.union([z.string(), z.date()]).transform((val) => new Date(val)),
    issued: z.date(), // Keep as Date type
    due: z.date(), // Keep as Date type
  }),
  notes: z.string().max(1000).optional(),
  terms: z.string().max(1000).optional(),
  paymentInstructions: z.string().max(500).optional(),
});

export type CompanyInfoFormData = z.infer<typeof companyInfoSchema>;
export type ClientFormData = z.infer<typeof clientSchema>;
export type ServiceItemFormData = z.infer<typeof serviceItemSchema>;
export type InvoiceFormData = z.infer<typeof invoiceSchema>;
export type InvoiceFormValues = z.infer<typeof invoiceSchema>;
