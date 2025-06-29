// hooks/useInvoiceForm.ts
"use client";



import {
  Client,
  CompanyInfo,
  Invoice,
  ServiceItem,
} from "@/lib/validations/validation"; // adjust path if needed
import { useCallback, useState } from "react";

export const useInvoiceForm = () => {
  const [invoice, setInvoice] = useState<Invoice>({
    id: undefined,
    invoiceNumber: `INV-${Date.now()}`,
    companyInfo: {
      name: "",
      logo: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      contact: {
        email: "",
        phone: "",
        website: "",
      },
      bankDetails: {
        bankName: "",
        accountNumber: "",
        routingNumber: "",
        accountHolderName: "",
      },
      taxInfo: {
        taxId: "",
        vatNumber: "",
      },
    },
    client: {
      name: "",
      email: "",
      phone: "",
      company: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      notes: "",
    },
    template: "modern",
    items: [
      {
        id: "1",
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0,
        category: "Other",
        unit: "hour",
        taxable: false,
        taxRate: 0,
      },
    ],
    taxRate: 0,
    discountType: "percentage",
    discountValue: 0,
    currency: "USD",
    dates: {
      issued: new Date(),
      due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    notes: "",
    terms: "",
    paymentInstructions: "",
    subtotal: 0,
    tax: 0,
    total: 0,
    status: "draft",
  });

  const updateCompany = useCallback((company: Partial<CompanyInfo>) => {
    setInvoice((prev) => ({
      ...prev,
      companyInfo: {
        ...prev.companyInfo,
        ...company,
        address: {
          ...prev.companyInfo.address,
          ...(company.address || {}),
        },
        contact: {
          ...prev.companyInfo.contact,
          ...(company.contact || {}),
        },
        bankDetails: {
          ...prev.companyInfo.bankDetails,
          ...(company.bankDetails || {}),
        },
        taxInfo: {
          ...prev.companyInfo.taxInfo,
          ...(company.taxInfo || {}),
        },
      },
    }));
  }, []);

  const updateClient = useCallback((client: Partial<Client>) => {
    setInvoice((prev) => ({
      ...prev,
      client: {
        ...prev.client,
        ...client,
        address: {
          ...prev.client.address,
          ...(client.address || {}),
        },
      },
    }));
  }, []);

  const updateItem = useCallback(
    (index: number, item: Partial<ServiceItem>) => {
      setInvoice((prev) => {
        const newItems = [...prev.items];
        newItems[index] = {
          ...newItems[index],
          ...item,
          amount:
            (item.quantity ?? newItems[index].quantity) *
            (item.rate ?? newItems[index].rate),
        };

        const subtotal = newItems.reduce((sum, item) => sum + item.amount!, 0);
        const tax = subtotal * (prev.taxRate / 100);
        const total = subtotal + tax;

        return {
          ...prev,
          items: newItems,
          subtotal,
          tax,
          total,
        };
      });
    },
    []
  );

  const addItem = useCallback(() => {
    setInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: Date.now().toString(),
          description: "",
          quantity: 1,
          rate: 0,
          amount: 0,
          category: "Other",
          unit: "hour",
          taxable: false,
          taxRate: 0,
        },
      ],
    }));
  }, []);

  const removeItem = useCallback((index: number) => {
    setInvoice((prev) => {
      if (prev.items.length <= 1) return prev;

      const newItems = prev.items.filter((_, i) => i !== index);
      const subtotal = newItems.reduce(
        (sum, item) => sum + (item.amount ?? 0),
        0
      );
      const tax = subtotal * (prev.taxRate / 100);
      const total = subtotal + tax;

      return {
        ...prev,
        items: newItems,
        subtotal,
        tax,
        total,
      };
    });
  }, []);

  return {
    invoice,
    updateCompany,
    updateClient,
    updateItem,
    addItem,
    removeItem,
    setInvoice,
  };
};
