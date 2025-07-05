// InvoiceFormBuilder.tsx - Section 1: Setup and Imports
"use client";

import { InvoiceFormData } from "@/lib/validations/validation";
import { InvoiceApiResponse } from "@/types/apiResponse";
import { InvoiceCalculations } from "@/types/database";
import { InvoicePDFProps } from "@/types/pdf";
import { pdf } from "@react-pdf/renderer";
import {
  Building2,
  Calculator,
  Calendar,
  FileText,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  User,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
// Remove these React Hook Form imports:
// import { useFieldArray, useForm } from "react-hook-form";

// Add your Zustand store import:
import { useInvoiceStore } from "@/stores/invoiceStore"; // Update path to your store

import { InvoicePDF } from "../pdf/InvoicePDFTemplate";
import { InvoicePreview } from "./InvoicePreview";

export default function InvoiceFormBuilder() {
  // Replace React Hook Form with Zustand store
  const {
    // Form data
    formData,
    calculations,
    
    // Selected entities
    selectedClient,
    selectedCompany,
    
    // UI state
    isLoading,
    isGenerating,
    previewMode,
    showClientDropdown,
    clientSearch,
    error,
    apiErrors,
    
    // Actions
    updateFormData,
    setSelectedClient,
    setSelectedCompany,
    setIsLoading,
    setIsGenerating,
    setPreviewMode,
    setShowClientDropdown,
    setClientSearch,
    setError,
    setApiErrors,
    addItem,
    removeItem,
    updateItem,
    calculateTotals,
    generateInvoiceNumber,
    resetForm,
  } = useInvoiceStore();

  // Keep your mock data (these stay the same)
  const mockClients = [
    {
      _id: "1",
      name: "John Doe",
      email: "john@example.com",
      company: "Client Corp",
      paymentTerms: 30,
      status: "active",
      address: {
        street: "789 Client Rd",
        city: "Boston",
        state: "MA",
        zipCode: "02101",
        country: "USA",
      },
    },
    // ... rest of your mock clients
  ];

  const mockCompanies = [
    {
      _id: "1",
      name: "Acme Corp",
      email: "info@acme.com",
      address: {
        street: "123 Business St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
    },
    // ... rest of your mock companies
  ];

  // Remove these React Hook Form related state:
  // const form = useForm<InvoiceFormData>({...});
  // const { fields, append, remove } = useFieldArray({...});
  // const watchedItems = form.watch("items");
  // etc.

  // Replace with direct access to Zustand state
  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  ];

  const frequencyOptions = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "yearly", label: "Yearly" },
  ];

  // Keep these local states that aren't part of the main form
  const [companies] = useState(mockCompanies);
  const [clients] = useState(mockClients);
  const [invoiceData, setInvoiceData] = useState<InvoiceFormData | null>(null);