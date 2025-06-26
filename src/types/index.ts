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
  address: string;
  company?: string;
  userId: string; // Link to user who created this client
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
  company: Company;
  client: Client;
  items: ServiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: "draft" | "sent" | "paid" | "overdue";
  issueDate: Date;
  dueDate: Date;
  notes?: string;
  templateId?: string;
  userId: string; // Link to user who created this invoice
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InvoiceTemplate {
  _id?: string;
  name: string;
  description?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  layout: "modern" | "classic" | "minimal";
  logoPosition: "left" | "center" | "right";
  isDefault: boolean;
  userId?: string; // Optional: for user-specific templates
  createdAt?: Date;
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
