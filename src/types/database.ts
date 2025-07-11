// types/database.ts

import { InvoiceFormData } from "@/lib/validations/validation";
import { Document, Types } from "mongoose";

// Base interface for all documents
export interface BaseDocument extends Document {
  _id: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

// User Types
export interface IUser extends BaseDocument {
  email: string;
  password?: string;
  name: string;
  avatar?: string;
  emailVerified: boolean;
  role: "user" | "admin";
  subscription: {
    plan: "free" | "pro" | "enterprise";
    status: "active" | "inactive" | "cancelled";
    expiresAt?: Date;
  };
  preferences: {
    theme: "light" | "dark";
    currency: string;
    timezone: string;
    language: string;
  };
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  emailVerificationToken?: string;
}

// Company Types
export interface ICompany extends BaseDocument {
  userId?: Types.ObjectId;
  name: string;
  email?: string;
  logo?: string;

  phone?: string;
  website?: string;
  status?: "active" | "inactive";

  paymentTerms?: number;
  company?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  taxId?: string;
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    routingNumber?: string;
    swift?: string;
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  isDefault: boolean;
}

// Client Types
export interface IClient extends BaseDocument {
  userId?: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  notes?: string;
  tags?: string[];
  paymentTerms: number; // days
  status: "active" | "inactive";
  totalInvoiced: number;
  totalPaid: number;
  lastInvoiceDate?: Date;
}

// Invoice Types
export interface IInvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  taxRate?: number;
}

export interface IInvoice extends BaseDocument {
  userId?: Types.ObjectId;
  companyId: Types.ObjectId;
  clientId: Types.ObjectId;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  items: IInvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountAmount: number;
  total: number;
  currency: string;

  notes?: string;
  terms?: string;
  paymentTerms: number;
  paidAt?: Date;
  paidAmount: number;
  status?: ["draft", "sent", "viewed", "paid", "overdue"];

  paymentMethod?: string;
  emailSentAt?: Date;
  viewedAt?: Date;
  templateId?: Types.ObjectId;
  recurring?: {
    isRecurring: boolean;
    frequency: "weekly" | "monthly" | "quarterly" | "yearly";
    nextDate?: Date;
    endDate?: Date;
  };
}
export interface IInvoiceCalculations {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
}

// In your types file, create a type for the populated document it is for pdfId route
export type PopulatedInvoice = IInvoice & {
  companyId: ICompany;
  clientId: IClient;
  _id: string;
  __v: number;
};

export interface ITemplate extends BaseDocument {
  userId?: Types.ObjectId;
  name: string;
  description?: string;
  layout?: "modern" | "classic" | "minimal";
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: number;
  logoPosition?: "left" | "center" | "right";
  showLogo: boolean;
  showDates: boolean;
  showNotes: boolean;
  showTerms: boolean;
  showCompanyAddress: boolean;
  showClientAddress: boolean;
  showInvoiceNumber: boolean;
  showPaymentTerms: boolean;
  isDefault?: boolean;
  isPublic?: boolean;
}

// Audit Log Types
export interface IAuditLog extends BaseDocument {
  userId: Types.ObjectId;
  action: "create" | "update" | "delete" | "view" | "send" | "pay";
  resourceType: "invoice" | "client" | "company" | "template" | "user";
  resourceId: Types.ObjectId;
  details: {
    changes?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  };
  ipAddress: string;
  userAgent: string;
}

// / Request body interface
export interface InvoiceRequestBody {
  companyId: string;
  clientId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceItem[];
  taxRate: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
  currency: string;
  notes?: string;
  terms?: string;
  paymentTerms: number;
  recurring: {
    isRecurring: boolean;
    frequency?: "weekly" | "monthly" | "quarterly" | "yearly";
    nextDate?: string;
    endDate?: string;
  };
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  taxRate?: number;
}
export interface InvoicePreviewProps {
  invoiceData: InvoiceFormData | null;
  selectedClient: IClient;
  selectedCompany: ICompany;
  clientData: IClient[];
  companyData: ICompany[];
  calculations: IInvoiceCalculations;
  onBack: () => void;
  onSubmit: () => void;
  onExportPDF: () => void;
}
export interface InvoicePdfProps {
  invoiceData: InvoiceFormData | null;
  selectedClient: IClient;
  selectedCompany: ICompany;
  calculations: IInvoiceCalculations;
  template: Partial<ITemplate>;
  templates?: Partial<ITemplate[]>;
}
export type ClientsResponse = {
  clients: IClient[];
};

export interface FormErrors {
  companyId?: string;
  clientId?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  dueDate?: string;
  items?: ItemError | string;
  recurringFrequency?: string;
  recurringNextDate?: string;
  [key: string]: unknown; // for dynamic item errors like `items.0.description`
}

// Then use it:
export interface ItemError {
  id?: string;
  description: string;
  quantity: string;
  rate: string;
  amount: string;
  taxRate?: string;
}
