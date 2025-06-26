import { DefaultSession } from "next-auth";

// Extend NextAuth session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "user" | "admin";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "user" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "user" | "admin";
  }
}

export interface Company {
  _id?: string;
  name: string;
  logo?: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  taxId?: string;
}

export interface Client {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  companyName?: string;
}

export interface ServiceItem {
  _id?: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  _id?: string;
  invoiceNumber: string;
  companyInfo: string | CompanyInfo;
  client: string | Client;
  serviceItems: ServiceItem[];
  template: string | InvoiceTemplate;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountRate: number;
  discountAmount: number;
  totalAmount: number;
  currency: "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "JPY" | "CNY" | "INR";
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  issueDate: Date;
  dueDate: Date;
  notes?: string;
  terms?: string;
  paymentMethod?:
    | "Bank Transfer"
    | "Credit Card"
    | "PayPal"
    | "Check"
    | "Cash"
    | "Other";
  emailSent: boolean;
  emailSentAt?: Date;
  paidAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InvoiceTemplate {
  _id?: string;
  name: string;
  description?: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  layout: "modern" | "classic" | "minimal" | "corporate";
  fontFamily: string;
  isActive: boolean;
}

export interface FormData {
  company: Company;
  client: Client;
  items: ServiceItem[];
  taxRate: number;
  notes?: string;
  templateId?: string;
  dueDate: Date;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "user" | "admin";
  company?: Company;
}
export interface CompanyInfo {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  logo?: string;
  website?: string;
  taxId?: string;
}

export interface ServiceItem {
  _id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  category?: "Design" | "Development" | "Consultation" | "Marketing" | "Other";
}

export interface InvoiceFormData {
  companyInfo: CompanyInfo;
  client: Client;
  serviceItems: ServiceItem[];
  templateId: string;
  taxRate: number;
  discountRate: number;
  currency: string;
  issueDate: Date;
  dueDate: Date;
  notes?: string;
  terms?: string;
  paymentMethod?: string;
}

// Form validation types
export interface FormErrors {
  companyInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  };
  client?: {
    name?: string;
    email?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  };
  serviceItems?: string[];
  general?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta?: PaginationMeta;
}

export interface CompanyInfo {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  logo?: string;
  website?: string;
  taxId?: string;
}

export interface ServiceItem {
  _id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  category?: "Design" | "Development" | "Consultation" | "Marketing" | "Other";
}

export interface InvoiceTemplate {
  _id?: string;
  name: string;
  description?: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  layout: "modern" | "classic" | "minimal" | "corporate";
  fontFamily: string;
  isActive: boolean;
}

export interface Invoice {
  _id?: string;
  invoiceNumber: string;
  companyInfo: string | CompanyInfo;
  client: string | Client;
  serviceItems: ServiceItem[];
  template: string | InvoiceTemplate;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountRate: number;
  discountAmount: number;
  totalAmount: number;
  currency: "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "JPY" | "CNY" | "INR";
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  issueDate: Date;
  dueDate: Date;
  notes?: string;
  terms?: string;
  paymentMethod?:
    | "Bank Transfer"
    | "Credit Card"
    | "PayPal"
    | "Check"
    | "Cash"
    | "Other";
  emailSent: boolean;
  emailSentAt?: Date;
  paidAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InvoiceFormData {
  companyInfo: CompanyInfo;
  client: Client;
  serviceItems: ServiceItem[];
  templateId: string;
  taxRate: number;
  discountRate: number;
  currency: string;
  issueDate: Date;
  dueDate: Date;
  notes?: string;
  terms?: string;
  paymentMethod?: string;
}

// Form validation types
export interface FormErrors {
  companyInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  };
  client?: {
    name?: string;
    email?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  };
  serviceItems?: string[];
  general?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta?: PaginationMeta;
}
