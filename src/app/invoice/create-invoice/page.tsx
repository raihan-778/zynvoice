// app/invoice/page.tsx
"use client";

import { InvoiceFormBuilder } from "@/components/forms/invoiceFormBuilder";

// import { InvoiceGenerator } from "@/components/invoice/InvoiceGenerator";

export default function InvoicePage() {
  // return <InvoiceGenerator />;
  return <InvoiceFormBuilder />;
}
