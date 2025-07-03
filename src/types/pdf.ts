// types/pdf.ts
export interface InvoicePDFData {
  invoice: {
    invoiceNumber: string;
    clientId: string;
    companyId: string;
    invoiceDate: Date;
    dueDate: Date;
    items: Array<{
      description: string;
      quantity: number;
      rate: number;
      amount: number;
      taxRate?: number;
    }>;
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    discountType: "percentage" | "fixed";
    discountValue: number;
    discountAmount: number;
    total: number;
    currency: string;
    status: string;
    notes?: string;
    terms?: string;
    paidAmount: number;
    paymentMethod?: string;
  };
  company: {
    name: string;
    logo?: string;
    email: string;
    phone?: string;
    website?: string;
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
  };
  client: {
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
  };
}
