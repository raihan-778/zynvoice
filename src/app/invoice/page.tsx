// 📁 src/app/invoice/page.tsx
"use client";

import InvoiceForm from "@/components/forms/invoiceForm1";
// import InvoiceFormBuilder from "@/components/forms/invoiceFormBuilder";
import MainLayout from "@/components/layout/Main-Layout";

// Mock data - replace with your actual data fetching logic

export default function InvoicePage() {
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

        <InvoiceForm />
      </div>
    </MainLayout>
  );
}
