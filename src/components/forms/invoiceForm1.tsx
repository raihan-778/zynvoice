"use client";

import { InvoiceFormErrors } from "@/types/database";

import { useEffect, useState } from "react";
import InvoicePreview from "./InvoicePreview";
// Get state and actions from store
import { useCallback } from "react";

import { useInvoiceStore } from "@/stors/invoiceStore";
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
import { InvoicePDF } from "../pdf/InvoicePDFTemplate";

// Form data interface matching your invoice schema

export default function InvoiceForm1() {
  // Get state and actions from store
  const {
    // State
    invoiceData,
    selectedCompany,
    selectedClient,
    calculations,
    template,
    companies,
    clients,
    templates,
    isGenerating,
    error,
    validationErrors,

    invoiceNumber,

    // Actions
    setInvoiceData,
    setSelectedCompany,
    setSelectedClient,
    setTemplate,
    setCompanies,
    setClients,
    addItem,
    updateItem,
    removeItem,
    setIsGenerating,
    setError,
    getInvoicePDFProps,
    generateInvoiceNumber,
    calculateTotals,
    resetInvoice,
    setvalidationErrors,
  } = useInvoiceStore();

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load companies
        const companiesResponse = await fetch("/api/companies/get-company");
        const companyData = await companiesResponse.json();
        const companies = await companyData.data.companies;

        console.log(companies);
        setCompanies(companies);
        console.log(companies);

        // Load clients
        const clientsResponse = await fetch("/api/clients/get-client");
        const data = await clientsResponse.json();
        console.log(data);
        const clientsData = await data.data;
        setClients(clientsData);

        console.log("clients Data", clients);

        console.log("Companies:", companies, "Clients:", clients);
      } catch (error) {
        console.error("Error loading initial data:", error);
        setError("Failed to load initial data");
      }
    };

    loadInitialData();
  }, [
    setClients,
    setCompanies,
    setSelectedCompany,
    setSelectedClient,
    setError,
  ]);

  // Generate PDF function - now much simpler!
  const generatePDF = useCallback(async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Get all required data from store
      const pdfProps = getInvoicePDFProps();

      if (!pdfProps) {
        throw new Error(
          "Missing required data. Please ensure company and client are selected."
        );
      }

      console.log("Generating PDF with data:", pdfProps);

      const doc = (
        <InvoicePDF
          calculations={pdfProps.calculations}
          template={pdfProps.template}
          invoiceData={pdfProps.invoiceData}
          selectedCompany={pdfProps.selectedCompany}
          selectedClient={pdfProps.selectedClient}
        />
      );

      const blob = await pdf(doc).toBlob();
      return blob;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate PDF";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, [getInvoicePDFProps, setIsGenerating, setError]);

  // Preview PDF
  const previewPDF = useCallback(async () => {
    try {
      const blob = await generatePDF();
      if (blob) {
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (error) {
      console.error("Error previewing PDF:", error);
    }
  }, [generatePDF]);

  // Download PDF
  const downloadPDF = useCallback(async () => {
    try {
      const blob = await generatePDF();
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice-${invoiceData.invoiceNumber}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  }, [generatePDF, invoiceData.invoiceNumber]);

  const [isLoading, setIsLoading] = useState(false);

  const [clientSearch, setClientSearch] = useState<string>("");

  const [showClientDropdown, setShowClientDropdown] = useState<boolean>(false);

  const [previewMode, setPreviewMode] = useState(false);
  const [errors, setErrors] = useState<Partial<InvoiceFormErrors>>({});

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

  // const filteredClients = clients.filter(
  //   (c) =>
  //     c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
  //     c?.email?.toLowerCase().includes(clientSearch.toLowerCase())
  // );
  const handleSaveAsDraft = async () => {
    try {
      setIsLoading(true);

      // Clear any existing validation errors for draft save

      // Prepare draft data with current timestamp
      const draftData = {
        ...invoiceData,
        status: "draft",
        isDraft: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        draftId: `draft_${Date.now()}`, // Unique draft ID
        // Optional: Add user identification if available
        // userId: currentUser?.id,
      };

      // Option 1: Save to localStorage (Client-side storage)
      const existingDrafts = JSON.parse(
        localStorage.getItem("invoiceDrafts") || "[]"
      );

      // Check if draft already exists (update existing draft)
      const existingDraftIndex = existingDrafts.findIndex(
        (draft) =>
          draft.draftId === draftData.draftId ||
          (draft.invoiceNumber === draftData.invoiceNumber &&
            draft.invoiceNumber)
      );

      if (existingDraftIndex !== -1) {
        // Update existing draft
        existingDrafts[existingDraftIndex] = draftData;
      } else {
        // Add new draft
        existingDrafts.push(draftData);
      }

      // Save to localStorage
      localStorage.setItem("invoiceDrafts", JSON.stringify(existingDrafts));

      // Option 2: Save to Database (Server-side storage)
      // const response = await fetch('/api/invoices/drafts', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(draftData),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to save draft');
      // }

      // Show success message
      // You can use a toast notification library or set a success state
      console.log("Draft saved successfully!");

      // Optional: Show success notification
      // toast.success('Invoice saved as draft!');
    } catch (error) {
      console.error("Error saving draft:", error);

      // Show error message
      // toast.error('Failed to save draft. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    const newErrors: Partial<InvoiceFormErrors> = {}; // Add this line

    if (!invoiceData.companyId)
      newErrors.companyId = "Company selection is required";
    if (!invoiceData.clientId)
      newErrors.clientId = "Client selection is required";
    if (!invoiceData.invoiceNumber)
      newErrors.invoiceNumber = "Invoice number is required";
    if (!invoiceData.invoiceDate)
      newErrors.invoiceDate = "Invoice date is required";
    if (!invoiceData.dueDate) newErrors.dueDate = "Due date is required";
    if (invoiceData.items.length === 0)
      newErrors.items = "At least one item is required";

    invoiceData.items.forEach((item, i) => {
      if (!item.description)
        newErrors[`items.${i}.description`] = "Description is required";
      if (item.quantity <= 0)
        newErrors[`items.${i}.quantity`] = "Quantity must be greater than 0";
      if (item.rate < 0)
        newErrors[`items.${i}.rate`] = "Rate cannot be negative";
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Submitting invoice data:", invoiceData);
      // Perform save or submit here
    }
  };

  const handlePreview = () => {
    console.log("handle Preview Btn Clicked");

    // Get current invoice data from Zustand
    const formData = useInvoiceStore.getState().invoiceData;

    console.log("Invoice data from Zustand:", formData);

    // Update local state (if you need to)
    setInvoiceData(formData);

    // Show the preview
    setPreviewMode(true);
  };

  // Local state for UI interactions
  // const [clientSearch, setClientSearch] = useState("");
  // const [showClientDropdown, setShowClientDropdown] = useState(false);

  // Computed values
  const selectedCurrency = currencies?.find(
    (c) => c.code === invoiceData.currency
  );
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      client?.email?.toLowerCase().includes(clientSearch.toLowerCase())
  );

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    setInvoiceData({ ...invoiceData, [field]: value });
    // Clear error when field is updated
    if (validationErrors[field]) {
      setvalidationErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // // Handle company selection
  const handleCompanyChange = (companyId) => {
    const company = companies.find((c) => c._id.toString() === companyId);
    setSelectedCompany(company);
    handleFieldChange("companyId", companyId);
  };

  // Handle client selection
  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setClientSearch(client.name);
    setShowClientDropdown(false);
    handleFieldChange("clientId", client._id.toString());
    handleFieldChange("paymentTerms", client.paymentTerms);

    // Auto-calculate due date based on payment terms
    if (invoiceData.invoiceDate) {
      const invoiceDate = new Date(invoiceData.invoiceDate);
      const dueDate = new Date(
        invoiceDate.getTime() + client.paymentTerms * 24 * 60 * 60 * 1000
      );
      handleFieldChange("dueDate", dueDate.toISOString().split("T")[0]);
    }
  };

  // // Handle item changes
  const handleItemChange = (index, field, value) => {
    const updatedItem = { ...invoiceData.items[index], [field]: value };

    // Calculate amount for quantity/rate changes
    if (field === "quantity" || field === "rate") {
      updatedItem.amount =
        (updatedItem.quantity || 0) * (updatedItem.rate || 0);
    }

    updateItem(index, updatedItem);
  };

  // Handle recurring settings
  const handleRecurringChange = (field, value) => {
    const recurring = { ...invoiceData.recurring, [field]: value };
    handleFieldChange("recurring", recurring);
  };
  // Add new item
  const handleAddItem = useCallback(() => {
    const newItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
      taxRate: 0,
    };
    addItem(newItem);
  }, [addItem]);

  // Update item
  const handleUpdateItem = useCallback(
    (id: string, field: string, value: any) => {
      const updates = { [field]: value };

      // Calculate amount if quantity or rate changed
      if (field === "quantity" || field === "rate") {
        const item = invoiceData.items.find((item) => item.id === id);
        if (item) {
          const quantity = field === "quantity" ? value : item.quantity;
          const rate = field === "rate" ? value : item.rate;
          updates.amount = quantity * rate;
        }
      }

      updateItem(id, updates);
    },
    [updateItem, invoiceData.items]
  );

  // Calculate due date when invoice date changes
  useEffect(() => {
    if (invoiceData.invoiceDate && selectedClient) {
      const invoiceDate = new Date(invoiceData.invoiceDate);
      const dueDate = new Date(
        invoiceDate.getTime() +
          selectedClient?.paymentTerms * 24 * 60 * 60 * 1000
      );
      handleFieldChange("dueDate", dueDate.toISOString().split("T")[0]);
    }
  }, [invoiceData.invoiceDate, selectedClient]);

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!invoiceData.companyId)
      validationErrors.companyId = "Company selection is required";
    if (!invoiceData.clientId)
      validationErrors.clientId = "Client selection is required";
    if (!invoiceData.invoiceNumber)
      validationErrors.invoiceNumber = "Invoice number is required";
    if (!invoiceData.invoiceDate)
      validationErrors.invoiceDate = "Invoice date is required";
    if (!invoiceData.dueDate) validationErrors.dueDate = "Due date is required";
    if (!invoiceData.items.length)
      validationErrors.items = "At least one item is required";

    invoiceData.items.forEach((item, index) => {
      if (!item.description)
        validationErrors[`items.${index}.description`] =
          "Description is required";
      if (!item.quantity || item.quantity <= 0)
        validationErrors[`items.${index}.quantity`] =
          "Quantity must be greater than 0";
      if (item.rate < 0)
        validationErrors[`items.${index}.rate`] = "Rate cannot be negative";
    });

    return Object.keys(validationErrors).length === 0;
  };

  // Handle preview
  const handlePreviewClick = () => {
    if (validateForm()) {
      handlePreview();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Create Invoice
        </h1>
        <p className="text-gray-600 text-lg">
          Generate professional invoices with automatic calculations
        </p>
      </div>

      <div>
        {previewMode ? (
          <InvoicePreview
            invoiceData={invoiceData}
            calculations={calculations}
            selectedClient={selectedClient}
            selectedCompany={selectedCompany}
            onBack={handleBackToEdit}
            previewPDF={previewPDF}
            downloadPDF={downloadPDF}
            generatePDF={generatePDF}
            error={error}
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company & Client Selection */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Company Selection */}
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3 mb-6">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    From Company
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Company *
                    </label>
                    <select
                      value={invoiceData.companyId || ""}
                      onChange={(e) => handleCompanyChange(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="">Choose your company...</option>
                      {companies.map((company) => (
                        <option
                          key={company?._id?.toString()}
                          value={company?._id?.toString()}
                        >
                          {company.name}
                        </option>
                      ))}
                    </select>
                    {validationErrors.companyId && (
                      <p className="text-red-500 text-sm mt-1">
                        {validationErrors.companyId}
                      </p>
                    )}
                  </div>

                  {selectedCompany && (
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {selectedCompany.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {selectedCompany.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedCompany.address},{" "}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Client Selection */}
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    To Client
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Client *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={clientSearch}
                        onChange={(e) => {
                          setClientSearch(e.target.value);
                          setShowClientDropdown(true);
                        }}
                        onFocus={() => setShowClientDropdown(true)}
                        placeholder="Search clients by name, email, or company..."
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                      />
                      <Search className="w-5 h-5 text-gray-400 absolute left-4 top-4" />
                    </div>

                    {showClientDropdown && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                        {filteredClients.length > 0 ? (
                          filteredClients.map((client) => (
                            <button
                              key={client._id.toString()}
                              type="button"
                              onClick={() => handleClientSelect(client)}
                              className="w-full px-4 py-4 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                            >
                              <div className="font-medium text-gray-900">
                                {client.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {client.email}
                              </div>

                              <div className="text-xs text-green-600 mt-1">
                                Payment terms: {client.paymentTerms} days
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-4 text-gray-500 text-center">
                            No active clients found
                          </div>
                        )}
                      </div>
                    )}
                    {validationErrors.clientId && (
                      <p className="text-red-500 text-sm mt-1">
                        Client selection is required
                      </p>
                    )}
                  </div>

                  {selectedClient && (
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {selectedClient.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {selectedClient.email}
                      </p>
                      {selectedClient.company && (
                        <p className="text-sm text-gray-600">
                          {selectedClient.company}
                        </p>
                      )}
                      {selectedClient?.address?.street && (
                        <p className="text-sm text-gray-600">
                          {selectedClient.address.street},{" "}
                          {selectedClient.address.city}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Invoice Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Number *
                  </label>
                  <div className="flex">
                    <input
                      value={invoiceNumber}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={generateInvoiceNumber}
                      className="px-3 py-2 bg-gray-200 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-300 transition-colors"
                      title="Generate new invoice number"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                  {validationErrors.invoiceNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.invoiceNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={invoiceData.invoiceDate.toISOString() || ""}
                      onChange={(e) =>
                        handleFieldChange("invoiceDate", e.target.value)
                      }
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                  {validationErrors.invoiceDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.invoiceDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={invoiceData.dueDate.toISOString() || ""}
                      onChange={(e) =>
                        handleFieldChange("dueDate", e.target.value)
                      }
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                  {validationErrors.dueDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.dueDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={invoiceData.currency || "USD"}
                    onChange={(e) =>
                      handleFieldChange("currency", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Recurring Invoice Settings */}
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <RefreshCw className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Recurring Invoice
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={invoiceData.recurring?.isRecurring || false}
                    onChange={(e) =>
                      handleRecurringChange("isRecurring", e.target.checked)
                    }
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Make this a recurring invoice
                  </label>
                </div>

                {invoiceData.recurring?.isRecurring && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency
                      </label>
                      <select
                        value={invoiceData.recurring?.frequency || "monthly"}
                        onChange={(e) =>
                          handleRecurringChange("frequency", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        {frequencyOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Next Invoice Date
                      </label>
                      <input
                        type="date"
                        value={
                          invoiceData.recurring?.nextDate?.toISOString() || ""
                        }
                        onChange={(e) =>
                          handleRecurringChange("nextDate", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={
                          invoiceData.recurring?.endDate?.toISOString() || ""
                        }
                        onChange={(e) =>
                          handleRecurringChange("endDate", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Item List
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <div className="bg-gray-50 px-6 py-4 grid grid-cols-12 gap-4 text-sm font-medium text-gray-700 border-b border-gray-200">
                  <div className="col-span-5">Description</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Rate</div>
                  <div className="col-span-2 text-center">Amount</div>
                  <div className="col-span-1"></div>
                </div>

                {(invoiceData.items || []).map((item, index) => (
                  <div
                    key={index}
                    className="px-6 py-4 grid grid-cols-12 gap-4 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="col-span-5">
                      <textarea
                        value={item.description || ""}
                        onChange={(e) =>
                          handleItemChange(index, "description", e.target.value)
                        }
                        placeholder="Describe your service or product..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      />
                      {validationErrors[`items.${index}.description`] && (
                        <p className="text-red-500 text-xs mt-1">
                          Description is required
                        </p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.quantity || ""}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "quantity",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center"
                      />
                      {validationErrors[`items.${index}.quantity`] && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors[`items.${index}.quantity`]}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <div className="flex">
                        <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg">
                          {selectedCurrency?.symbol || "$"}
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.rate || ""}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "rate",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center"
                        />
                      </div>
                      {validationErrors[`items.${index}.rate`] && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors[`items.${index}.rate`]}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center justify-center h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 font-medium">
                        {selectedCurrency?.symbol || "$"}
                        {(item.amount || 0).toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={invoiceData.items.length === 1}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations & Settings */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Tax & Discount Settings
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={invoiceData.taxRate || 0}
                        onChange={(e) =>
                          handleFieldChange(
                            "taxRate",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Discount Type
                        </label>
                        <select
                          value={invoiceData.discountType || "percentage"}
                          onChange={(e) =>
                            handleFieldChange("discountType", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="percentage">Percentage</option>
                          <option value="fixed">Fixed Amount</option>
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Discount Value
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg">
                            {invoiceData.discountType === "percentage"
                              ? "%"
                              : selectedCurrency?.symbol || "$"}
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={invoiceData.discountValue || 0}
                            onChange={(e) =>
                              handleFieldChange(
                                "discountValue",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes & Terms */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={invoiceData.notes || ""}
                      onChange={(e) =>
                        handleFieldChange("notes", e.target.value)
                      }
                      placeholder="Add any additional notes or special instructions..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Terms & Conditions
                    </label>
                    <textarea
                      value={invoiceData.terms || ""}
                      onChange={(e) =>
                        handleFieldChange("terms", e.target.value)
                      }
                      placeholder="Add payment terms, conditions, or other legal information..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Summary */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-6">
                  <Calculator className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Invoice Summary
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      {selectedCurrency?.symbol || "$"}
                      {calculations.subtotal.toFixed(2)}
                    </span>
                  </div>

                  {calculations.discountAmount > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-200 text-red-600">
                      <span>
                        Discount (
                        {invoiceData.discountType === "percentage"
                          ? `${invoiceData.discountValue}%`
                          : "Fixed"}
                        ):
                      </span>
                      <span className="font-medium">
                        -{selectedCurrency?.symbol || "$"}
                        {calculations.discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {calculations.taxAmount > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">
                        Tax ({invoiceData.taxRate}%):
                      </span>
                      <span className="font-medium">
                        {selectedCurrency?.symbol || "$"}
                        {calculations.taxAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between py-4 border-t-2 border-gray-300">
                    <span className="text-xl font-semibold text-gray-900">
                      Total:
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      {selectedCurrency?.symbol || "$"}
                      {calculations.total.toFixed(2)}
                    </span>
                  </div>

                  {selectedClient && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Payment Information
                      </h4>
                      <p className="text-sm text-gray-600">
                        Payment Terms: {invoiceData.paymentTerms} days
                      </p>
                      <p className="text-sm text-gray-600">
                        Due Date:{" "}
                        {new Date(invoiceData.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSaveAsDraft}
                disabled={isLoading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={handlePreview}
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                Preview Invoice
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </div>
                ) : (
                  "Create Invoice"
                )}
              </button>
            </div>

            {/* Form Validation Summary */}
            {Object.keys(validationErrors).length > 0 && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-red-800 font-medium mb-2">
                  Please fix the following errors:
                </h4>
                <ul className="text-sm text-red-600 space-y-1">
                  {validationErrors.companyId && (
                    <li>• Company selection is required</li>
                  )}
                  {validationErrors.clientId && (
                    <li>• Client selection is required</li>
                  )}
                  {validationErrors.invoiceNumber && (
                    <li>• Invoice number is required</li>
                  )}
                  {validationErrors.invoiceDate && (
                    <li>• Invoice date is required</li>
                  )}
                  {validationErrors.dueDate && <li>• Due date is required</li>}
                  {validationErrors.items && (
                    <li>• Please check line items for errors</li>
                  )}
                </ul>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
