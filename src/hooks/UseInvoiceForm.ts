// hooks/useInvoiceForm.ts
"use client";

import { Client, CompanyInfo, Invoice, ServiceItem } from "@/types/invoice";
import { useCallback, useState } from "react";

export const useInvoiceForm = () => {
  const [invoice, setInvoice] = useState<Invoice>({
    invoiceNumber: `INV-${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    company: {
      name: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      logo: "",
    },
    client: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    items: [
      {
        id: "1",
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ],
    subtotal: 0,
    tax: 0,
    total: 0,
    notes: "",
    template: "modern",
  });

  const updateCompany = useCallback((company: Partial<CompanyInfo>) => {
    setInvoice((prev) => ({
      ...prev,
      company: { ...prev.company, ...company },
    }));
  }, []);

  const updateClient = useCallback((client: Partial<Client>) => {
    setInvoice((prev) => ({
      ...prev,
      client: { ...prev.client, ...client },
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
            (item.quantity || newItems[index].quantity) *
            (item.rate || newItems[index].rate),
        };

        const subtotal = newItems.reduce((sum, item) => sum + item.amount, 0);
        const tax = subtotal * 0.1; // 10% tax
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
        },
      ],
    }));
  }, []);

  const removeItem = useCallback((index: number) => {
    setInvoice((prev) => {
      if (prev.items.length <= 1) return prev;

      const newItems = prev.items.filter((_, i) => i !== index);
      const subtotal = newItems.reduce((sum, item) => sum + item.amount, 0);
      const tax = subtotal * 0.1;
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
