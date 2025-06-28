import { useState, useEffect } from "react";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  dueDate: string;
  createdDate: string;
  description?: string;
}

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockInvoices: Invoice[] = [
      {
        id: "1",
        invoiceNumber: "INV-001",
        clientName: "Acme Corp",
        clientEmail: "contact@acme.com",
        amount: 2500,
        status: "paid",
        dueDate: "2024-07-15",
        createdDate: "2024-06-15",
        description: "Web development services",
      },
      {
        id: "2",
        invoiceNumber: "INV-002",
        clientName: "Tech Solutions",
        clientEmail: "billing@techsolutions.com",
        amount: 1800,
        status: "sent",
        dueDate: "2024-07-20",
        createdDate: "2024-06-20",
        description: "Consulting services",
      },
      {
        id: "3",
        invoiceNumber: "INV-003",
        clientName: "Digital Agency",
        clientEmail: "payments@digitalagency.com",
        amount: 3200,
        status: "overdue",
        dueDate: "2024-06-30",
        createdDate: "2024-06-01",
        description: "Design and development",
      },
      {
        id: "4",
        invoiceNumber: "INV-004",
        clientName: "StartupXYZ",
        clientEmail: "finance@startupxyz.com",
        amount: 1200,
        status: "draft",
        dueDate: "2024-08-01",
        createdDate: "2024-07-01",
        description: "Mobile app development",
      },
    ];

    // Simulate loading delay
    setTimeout(() => {
      setInvoices(mockInvoices);
      setLoading(false);
    }, 1000);
  }, []);

  const deleteInvoice = async (id: string): Promise<void> => {
    setLoading(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
    setLoading(false);
  };

  const updateInvoice = async (
    id: string,
    updates: Partial<Invoice>
  ): Promise<void> => {
    setLoading(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    setInvoices((prev) =>
      prev.map((invoice) =>
        invoice.id === id ? { ...invoice, ...updates } : invoice
      )
    );
    setLoading(false);
  };

  const addInvoice = async (invoice: Omit<Invoice, "id">): Promise<void> => {
    setLoading(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newInvoice: Invoice = {
      ...invoice,
      id: Date.now().toString(),
    };

    setInvoices((prev) => [...prev, newInvoice]);
    setLoading(false);
  };

  return {
    invoices,
    loading,
    deleteInvoice,
    updateInvoice,
    addInvoice,
  };
}
