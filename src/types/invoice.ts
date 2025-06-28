export interface CompanyInfo {
  logo?: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
}

export interface Client {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface ServiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id?: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  company: CompanyInfo;
  client: Client;
  items: ServiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  template: string;
  status?: "draft" | "sent" | "paid" | "overdue";
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}
