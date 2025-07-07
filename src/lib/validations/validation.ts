// 📁 src/lib/validations/validation.ts

import { z } from "zod";

// Company Information Schema
export const CompanyInfoSchema = z.object({
  _id: z.string().optional(),
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
  _id: z.string().optional(),
  name: z.string().min(1, "Client name is required"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company:z.string().optional(),
  status:z.enum(["active","inactive"]),
  paymentTerms: z.number().optional(),
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

export const InvoiceItemSchema = z
  .object({
    id: z.string().optional(),
    description: z
      .string()
      .min(1, "Description is required")
      .max(500, "Description too long"),
    quantity: z.coerce
      .number()
      .min(0.01, "Quantity must be greater than 0")
      .max(10000, "Quantity too large"),
    rate: z.coerce
      .number()
      .min(0, "Rate cannot be negative") // Changed from 0.01 to 0
      .max(1000000, "Rate too large"),
    amount: z.number(),
  })

  .array()
  .optional();

const dateString = z.string().refine(
  (date) => {
    // Check if it's a valid date string in YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;

    // Check if it's a valid date
    const parsedDate = new Date(date);
    return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
  },
  {
    message: "Invalid date format. Expected YYYY-MM-DD",
  }
);

// Validation for invoice date specifically
const invoiceDateSchema = dateString.refine(
  (date) => {
    const parsedDate = new Date(date);
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    // Allow dates from one year ago to today
    return parsedDate >= oneYearAgo && parsedDate <= today;
  },
  {
    message: "Invoice date must be within the last year and not in the future",
  }
);

// Validation for due date
const dueDateSchema = dateString;

// // Invoice item schema
// const invoiceItemSchema = z.object({
//   description: z
//     .string()
//     .min(1, "Description is required")
//     .max(500, "Description cannot exceed 500 characters")
//     .trim(),
//   quantity: z
//     .number()
//     .min(1, "Quantity must be greater than 0")
//     .max(999999, "Quantity cannot exceed 999,999")
//     .multipleOf(0.01, "Quantity can have at most 2 decimal places"),
//   rate: z
//     .number()
//     .min(0, "Rate cannot be negative")
//     .max(999999.99, "Rate cannot exceed 999,999.99")
//     .multipleOf(0.01, "Rate can have at most 2 decimal places"),
//   amount: z
//     .number()
//     .min(0, "Amount cannot be negative")
//     .multipleOf(0.01, "Amount can have at most 2 decimal places"),
// });

// Recurring settings schema
const recurringSchema = z
  .object({
    isRecurring: z.boolean(),
    frequency: z.enum(["weekly", "monthly", "quarterly", "yearly"]),
    nextDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine(
    (data) => {
      // If recurring is enabled, nextDate is required
      if (data.isRecurring && !data.nextDate) {
        return false;
      }

      // If nextDate is provided, it should be a valid date
      if (data.nextDate && !dateString.safeParse(data.nextDate).success) {
        return false;
      }

      // If endDate is provided, it should be a valid date
      if (data.endDate && !dateString.safeParse(data.endDate).success) {
        return false;
      }

      // If both nextDate and endDate are provided, endDate should be after nextDate
      if (data.nextDate && data.endDate) {
        return new Date(data.endDate) > new Date(data.nextDate);
      }

      return true;
    },
    {
      message:
        "Invalid recurring settings. Check dates and ensure end date is after next date.",
    }
  );

// Assuming you already have InvoiceItemSchema

export const InvoiceFormDataSchema = z.object({
  userId: z.string().optional(),
  companyId: z.string(),
  clientId: z.string(),
  items: InvoiceItemSchema,

  invoiceNumber: z.string().min(1, "Invoice number is required"),

  invoiceDate: invoiceDateSchema,

  dueDate: dueDateSchema,

  subtotal: z.number().min(0),
  taxRate: z.number().min(0).max(100).default(0),
  taxAmount: z.number().min(0).default(0),

  discountType: z.enum(["percentage", "fixed"]).default("percentage"),
  discountValue: z.number().min(0).default(0),
  discountAmount: z.number().min(0).default(0),

  total: z.number().min(0),
  currency: z.string().default("USD"),

  status: z
    .enum(["draft", "sent", "viewed", "paid", "overdue", "cancelled"])
    .default("draft"),

  notes: z.string().optional(),
  terms: z.string().optional(),

  paymentTerms: z.number().min(0), // in days

  paidAt: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),

  paidAmount: z.number().min(0).default(0),
  paymentMethod: z.string().optional(),

  emailSentAt: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),

  viewedAt: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),

  templateId: z.string().optional(),

  recurring: recurringSchema.default({
    isRecurring: false,
    frequency: "monthly",
    nextDate: "",
    endDate: "",
  }),
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

// Validation function
export const validateInvoiceForm = (data: unknown) => {
  return InvoiceFormDataSchema.safeParse(data);
};

// Partial validation for individual fields
export const validateInvoiceField = (
  field: keyof InvoiceFormData,
  value: unknown
) => {
  const fieldSchema = InvoiceFormDataSchema.shape[field];
  return fieldSchema.safeParse(value);
};

// Specific validators for common use cases
export const validators = {
  invoiceDate: (date: string) => {
    return invoiceDateSchema.safeParse(date);
  },

  dueDate: (date: string) => {
    return dueDateSchema.safeParse(date);
  },

  invoiceNumber: (number: string) => {
    return InvoiceFormDataSchema.shape.invoiceNumber.safeParse(number);
  },

  currency: (currency: string) => {
    return InvoiceFormDataSchema.shape.currency.safeParse(currency);
  },

  taxRate: (rate: number) => {
    return InvoiceFormDataSchema.shape.taxRate.safeParse(rate);
  },

  discountValue: (value: number, type: "percentage" | "fixed") => {
    const baseValidation =
      InvoiceFormDataSchema.shape.discountValue.safeParse(value);
    if (!baseValidation.success) return baseValidation;

    if (type === "percentage" && value > 100) {
      return {
        success: false,
        error: { message: "Percentage discount cannot exceed 100%" },
      };
    }
    return baseValidation;
  },

  item: (item: unknown) => {
    return InvoiceItemSchema.safeParse(item);
  },

  recurring: (settings: unknown) => {
    return recurringSchema.safeParse(settings);
  },
};

// Error formatter
export const formatValidationErrors = (error: z.ZodError) => {
  const formattedErrors: Record<string, string> = {};

  error.errors.forEach((err) => {
    const path = err.path.join(".");
    formattedErrors[path] = err.message;
  });

  return formattedErrors;
};
