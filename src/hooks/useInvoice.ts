import { Invoice } from "@/types/invoice";
import { useEffect, useState } from "react";

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockInvoices: Invoice[] = [
      {
        invoiceNumber: "INV-1001",
        date: "2025-06-01",
        dueDate: "2025-06-15",
        company: {
          name: "TechNova Solutions",
          address: "123 Innovation Drive, San Francisco, CA",
          phone: "+1 (555) 123-4567",
          email: "info@technova.com",
          website: "https://www.technova.com",
        },
        client: {
          name: "Green Valley Farms",
          email: "contact@greenvalleyfarms.com",
          phone: "+1 (555) 987-6543",
          address: "456 Country Rd, Austin, TX",
        },
        items: [
          {
            id: "srv1",
            description: "Custom Software Development",
            quantity: 100,
            rate: 80,
            amount: 8000,
          },
          {
            id: "srv2",
            description: "Monthly Maintenance",
            quantity: 1,
            rate: 500,
            amount: 500,
          },
        ],
        subtotal: 8500,
        tax: 850,
        total: 9350,
        notes: "Payment due within 14 days.",
        template: "modern",
        status: "sent",
      },
      {
        invoiceNumber: "INV-1002",
        date: "2025-06-10",
        dueDate: "2025-07-10",
        company: {
          name: "DesignHouse Co.",
          address: "789 Art Blvd, New York, NY",
          phone: "+1 (555) 321-7654",
          email: "hello@designhouse.co",
        },
        client: {
          name: "Urban Market Inc.",
          email: "finance@urbanmarket.com",
          phone: "+1 (555) 432-1987",
          address: "123 Market St, Boston, MA",
        },
        items: [
          {
            id: "srv3",
            description: "Brand Identity Package",
            quantity: 1,
            rate: 3000,
            amount: 3000,
          },
        ],
        subtotal: 3000,
        tax: 240,
        total: 3240,
        template: "classic",
        status: "draft",
      },
      {
        invoiceNumber: "INV-1003",
        date: "2025-06-15",
        dueDate: "2025-06-30",
        company: {
          name: "ByteWorks IT Services",
          address: "222 Tech Park, Seattle, WA",
          phone: "+1 (555) 567-9988",
          email: "support@byteworks.com",
        },
        client: {
          name: "Clear Water Authority",
          email: "admin@cwa.org",
          phone: "+1 (555) 678-1234",
          address: "100 River Dr, Portland, OR",
        },
        items: [
          {
            id: "srv4",
            description: "Network Infrastructure Setup",
            quantity: 2,
            rate: 2500,
            amount: 5000,
          },
          {
            id: "srv5",
            description: "Onsite Technical Support",
            quantity: 5,
            rate: 200,
            amount: 1000,
          },
        ],
        subtotal: 6000,
        tax: 600,
        total: 6600,
        notes: "Includes 1-month free support.",
        template: "clean",
        status: "paid",
      },
      {
        invoiceNumber: "INV-1004",
        date: "2025-06-20",
        dueDate: "2025-07-05",
        company: {
          name: "SkyPixel Media",
          address: "55 Creative Ave, Los Angeles, CA",
          phone: "+1 (555) 777-9988",
          email: "projects@skypixelmedia.com",
          website: "https://www.skypixelmedia.com",
        },
        client: {
          name: "Sunset Hotels Group",
          email: "billing@sunsethotels.com",
          phone: "+1 (555) 121-3344",
          address: "300 Beachfront Blvd, Miami, FL",
        },
        items: [
          {
            id: "srv6",
            description: "Drone Photography Session",
            quantity: 3,
            rate: 400,
            amount: 1200,
          },
          {
            id: "srv7",
            description: "Video Editing",
            quantity: 1,
            rate: 700,
            amount: 700,
          },
        ],
        subtotal: 1900,
        tax: 190,
        total: 2090,
        notes: "Deliverables will be shared via Dropbox.",
        template: "minimal",
        status: "overdue",
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
