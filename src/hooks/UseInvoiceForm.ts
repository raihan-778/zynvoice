// hooks/useInvoiceForm.ts
"use client";

import {
  ClientInfo,
  CompanyInfo,
  InvoiceFormData,
  InvoiceItem,
} from "@/lib/validations/validation";
import { useCallback, useEffect, useState } from "react";

export const useInvoiceForm = () => {
  const [invoice, setInvoice] = useState<InvoiceFormData>({
    invoiceNumber: `INV-${Date.now()}`,
    companyInfo: {
      name: "",
      logo: "",
      address: "",
      contact: {
        email: "",
        phone: "",
      },
    },
    client: {
      name: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
    },
    items: [
      {
        id: "1",
        description: "",
        quantity: 1,
        rate: 0,
      },
    ],
    dates: {
      issued: new Date(),
      due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
    currency: "USD",
    discountType: "percentage",
    discountValue: 0,
    taxRate: 0,
    notes: "",
    terms: "",
    paymentInstructions: "",
    template: "modern",
    subtotal: 0,
    tax: 0,
    total: 0,
  });

  // Calculate totals whenever items, discount, or tax rate changes
  const calculateTotals = useCallback(
    (
      items: InvoiceItem[],
      taxRate: number,
      discountValue: number,
      discountType: "percentage" | "fixed"
    ) => {
      const subtotal = items.reduce(
        (sum, item) => sum + item.quantity * item.rate,
        0
      );

      let discount = 0;
      if (discountType === "percentage") {
        discount = (subtotal * discountValue) / 100;
      } else {
        discount = discountValue;
      }

      const discountedSubtotal = subtotal - discount;
      const tax = (discountedSubtotal * taxRate) / 100;
      const total = discountedSubtotal + tax;

      return {
        subtotal,
        discount,
        tax,
        total,
      };
    },
    []
  );

  // Update totals whenever relevant fields change
  useEffect(() => {
    const totals = calculateTotals(
      invoice.items,
      invoice.taxRate,
      invoice.discountValue,
      invoice.discountType
    );

    setInvoice((prev) => ({
      ...prev,
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
    }));
  }, [
    invoice.items,
    invoice.taxRate,
    invoice.discountValue,
    invoice.discountType,
    calculateTotals,
  ]);

  const updateCompany = useCallback((company: Partial<CompanyInfo>) => {
    setInvoice((prev) => ({
      ...prev,
      companyInfo: {
        ...prev.companyInfo,
        ...company,
        contact: {
          ...prev.companyInfo?.contact,
          ...(company.contact || {}),
        },
      } as CompanyInfo, // Type assertion to ensure compatibility
    }));
  }, []);

  const updateClient = useCallback((client: Partial<ClientInfo>) => {
    setInvoice((prev) => ({
      ...prev,
      client: {
        ...prev.client,
        ...client,
        address: {
          ...prev.client?.address,
          ...(client.address || {}),
        },
      } as ClientInfo, // Type assertion to ensure compatibility
    }));
  }, []);

  const updateItem = useCallback(
    (index: number, item: Partial<InvoiceItem>) => {
      setInvoice((prev) => {
        const newItems = [...prev.items];
        newItems[index] = {
          ...newItems[index],
          ...item,
        };

        return {
          ...prev,
          items: newItems,
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
        },
      ],
    }));
  }, []);

  const removeItem = useCallback((index: number) => {
    setInvoice((prev) => {
      if (prev.items.length <= 1) return prev;

      const newItems = prev.items.filter((_, i) => i !== index);

      return {
        ...prev,
        items: newItems,
      };
    });
  }, []);

  // Update discount
  const updateDiscount = useCallback(
    (discountValue: number, discountType: "percentage" | "fixed") => {
      setInvoice((prev) => ({
        ...prev,
        discountValue,
        discountType,
      }));
    },
    []
  );

  // Update tax rate
  const updateTaxRate = useCallback((taxRate: number) => {
    setInvoice((prev) => ({
      ...prev,
      taxRate,
    }));
  }, []);

  // Update currency
  const updateCurrency = useCallback((currency: string) => {
    setInvoice((prev) => ({
      ...prev,
      currency,
    }));
  }, []);

  // Update dates
  const updateDates = useCallback(
    (dates: Partial<{ issued: Date; due: Date }>) => {
      setInvoice((prev) => ({
        ...prev,
        dates: {
          ...prev.dates,
          ...dates,
        },
      }));
    },
    []
  );

  // Update notes, terms, payment instructions
  const updateNotes = useCallback((notes: string) => {
    setInvoice((prev) => ({
      ...prev,
      notes,
    }));
  }, []);

  const updateTerms = useCallback((terms: string) => {
    setInvoice((prev) => ({
      ...prev,
      terms,
    }));
  }, []);

  const updatePaymentInstructions = useCallback(
    (paymentInstructions: string) => {
      setInvoice((prev) => ({
        ...prev,
        paymentInstructions,
      }));
    },
    []
  );

  // Reset form
  const resetForm = useCallback(() => {
    setInvoice({
      invoiceNumber: `INV-${Date.now()}`,
      companyInfo: {
        name: "",
        logo: "",
        address: "",
        contact: {
          email: "",
          phone: "",
        },
      },
      client: {
        name: "",
        email: "",
        phone: "",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
      },
      items: [
        {
          id: "1",
          description: "",
          quantity: 1,
          rate: 0,
        },
      ],
      dates: {
        issued: new Date(),
        due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      currency: "USD",
      discountType: "percentage",
      discountValue: 0,
      taxRate: 0,
      notes: "",
      terms: "",
      paymentInstructions: "",
      template: "modern",
      subtotal: 0,
      tax: 0,
      total: 0,
    });
  }, []);

  // Validate form data
  const validateForm = useCallback(() => {
    const errors: string[] = [];

    if (!invoice.invoiceNumber) errors.push("Invoice number is required");
    if (!invoice.companyInfo?.name) errors.push("Company name is required");
    if (!invoice.client?.name) errors.push("Client name is required");
    if (!invoice.items || invoice.items.length === 0)
      errors.push("At least one item is required");

    invoice.items.forEach((item, index) => {
      if (!item.description)
        errors.push(`Item ${index + 1}: Description is required`);
      if (!item.quantity || item.quantity <= 0)
        errors.push(`Item ${index + 1}: Valid quantity is required`);
      if (!item.rate || item.rate < 0)
        errors.push(`Item ${index + 1}: Valid rate is required`);
    });

    return errors;
  }, [invoice]);

  return {
    invoice,
    setInvoice,
    updateCompany,
    updateClient,
    updateItem,
    addItem,
    removeItem,
    updateDiscount,
    updateTaxRate,
    updateCurrency,
    updateDates,
    updateNotes,
    updateTerms,
    updatePaymentInstructions,
    resetForm,
    validateForm,
  };
};
