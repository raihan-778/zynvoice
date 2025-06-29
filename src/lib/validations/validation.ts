import { z } from "zod";

// Address Schema
const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
});

// Contact Schema
const contactSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
});

// Company Info (matches `CompanyInfo` interface)
export const companyInfoSchema = z.object({
  name: z.string().min(1, "Company name is required").max(100, "Name too long"),
  logo: z.string().url("Invalid logo URL").optional().or(z.literal("")),
  address: addressSchema,
  contact: contactSchema,
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

// Client (matches `Client` interface)
export const clientSchema = z.object({
  name: z.string().min(1, "Client name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: addressSchema,
  notes: z.string().max(500, "Notes too long").optional(),
});

// Service Item (matches `ServiceItem` interface + added required fields)
export const serviceItemSchema = z.object({
  id: z.string(), // Not included in original schema — added to match interface
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  rate: z.number().min(0, "Rate must be 0 or higher"),
  amount: z.number().min(0).optional(), // Usually computed, but include for type alignment
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

// Invoice Schema (matches your `Invoice` interface closely)
export const invoiceSchema = z.object({
  id: z.string().optional(),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  companyInfo: companyInfoSchema,
  client: clientSchema,
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
    issued: z.date(),
    due: z.date(),
  }),
  notes: z.string().max(1000).optional(),
  terms: z.string().max(1000).optional(),
  paymentInstructions: z.string().max(500).optional(),
  subtotal: z.number().min(0), // usually calculated
  tax: z.number().min(0), // usually calculated
  total: z.number().min(0), // usually calculated
  status: z.enum(["draft", "sent", "paid", "overdue"]).optional(),
});

// Types inferred from Zod (strongly typed and synced)
export type CompanyInfo = z.infer<typeof companyInfoSchema>;
export type Client = z.infer<typeof clientSchema>;
export type ServiceItem = z.infer<typeof serviceItemSchema>;
export type Invoice = z.infer<typeof invoiceSchema>;
export type InvoiceFormData = z.infer<typeof invoiceSchema>;
export type InvoiceFormValues = z.infer<typeof invoiceSchema>;
