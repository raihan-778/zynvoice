// utils/invoiceDataMapper.ts
import { IClient, ICompany, IInvoice } from "@/types/database";
import { InvoicePDFData } from "@/types/pdf";

export const mapInvoiceDataForPDF = (
  invoice: IInvoice,
  company: ICompany,
  client: IClient
): InvoicePDFData => {
  return {
    invoice: {
      invoiceNumber: invoice.invoiceNumber,
      companyId: invoice.companyId.toString(),
      clientId: invoice.clientId.toString(),
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      items: invoice.items,
      subtotal: invoice.subtotal,
      taxRate: invoice.taxRate,
      taxAmount: invoice.taxAmount,
      discountType: invoice.discountType,
      discountValue: invoice.discountValue,
      discountAmount: invoice.discountAmount,
      total: invoice.total,
      currency: invoice.currency,
      status: invoice.status,
      notes: invoice.notes,
      terms: invoice.terms,
      paidAmount: invoice.paidAmount,
      paymentMethod: invoice.paymentMethod,
    },
    company: {
      name: company.name,
      logo: company.logo,
      email: company.email,
      phone: company.phone,
      website: company.website,
      address: company.address,
      taxId: company.taxId,
      bankDetails: company.bankDetails,
      branding: company.branding,
    },
    client: {
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      address: client.address,
    },
  };
};
