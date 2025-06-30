// 📁 src/app/invoice/page.tsx
"use client";

import { InvoiceForm } from "@/components/forms/invoice-form";
import MainLayout from "@/components/layout/Main-Layout";
import {
  ClientInfo,
  CompanyInfo,
  InvoiceFormData,
} from "@/lib/validations/validation";
import { useState } from "react";
import { toast } from "sonner"; // or your preferred toast library

// Mock data - replace with your actual data fetching logic
const mockClients: ClientInfo[] = [
  {
    id: "1",
    name: "Acme Corporation",
    email: "contact@acme.com",
    address: {
      city: "Chittagong",
      state: "CityGate",
    },
    phone: "+1 (555) 123-4567",
  },
  {
    id: "2",
    name: "Tech Solutions Inc",
    email: "info@techsolutions.com",
    address: {
      city: "Dhaka",
      state: "FarmGate",
    },
    phone: "+1 (555) 987-6543",
  },
];

const mockCompanies: CompanyInfo[] = [
  {
    id: "1",
    name: "Your Company Name",
    contact: {
      email: "billing@yourcompany.com",
      phone: "+1 (555) 111-2222",
    },
    address: "789 Your Street, Your City, YC 11111",

    logo: "/logo.png", // optional
  },
];

export default function InvoicePage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: InvoiceFormData) => {
    setIsLoading(true);
    try {
      // Here you would typically save to your database
      console.log("Saving invoice:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Invoice saved successfully!");

      // Optionally redirect to invoice list or view page
      // router.push('/invoices');
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error("Failed to save invoice. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = (data: InvoiceFormData) => {
    console.log("Previewing invoice:", data);
    // Open preview modal or navigate to preview page
    toast.info("Preview functionality coming soon!");
  };

  const handleDownload = async (data: InvoiceFormData) => {
    try {
      console.log("Downloading invoice:", data);
      // Implement PDF generation logic here
      // You might use libraries like jsPDF, Puppeteer, or call a backend API
      toast.info("Download functionality coming soon!");
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice.");
    }
  };

  const handleSendEmail = async (data: InvoiceFormData) => {
    try {
      console.log("Sending invoice via email:", data);
      // Implement email sending logic here
      // This would typically call your backend API
      toast.info("Email functionality coming soon!");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send invoice via email.");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create New Invoice
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Fill in the details below to generate your professional invoice.
          </p>
        </div>

        <InvoiceForm
          onSubmit={handleSubmit}
          onPreview={handlePreview}
          onDownload={handleDownload}
          onSendEmail={handleSendEmail}
          isLoading={isLoading}
          clientList={mockClients}
          companyList={mockCompanies}
        />
      </div>
    </MainLayout>
  );
}
