"use client";

import { ClientInfo, InvoiceFormData } from "@/lib/validations/validation";
import { InvoiceApiResponse } from "@/types/apiResponse";

import { useInvoiceFormStore } from "@/stors/invoiceFormStore";
<<<<<<< HEAD
import { Building2, Calendar, RefreshCw, Search, User } from "lucide-react";
=======
import { Building2, Calculator, RefreshCw, Search, User } from "lucide-react";
>>>>>>> f13c752af7bdacffb147a81d137f814bd4c750f5
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { InvoicePreview } from "./InvoicePreview";
import { EmailState } from "@/stors/invoiceStore";

export default function InvoiceForm() {
  // Zustand store
  const {
    // State
    formData,
    isInitialLoading,
    generalError,
    loadInitialData,
    updateFormField,

    setGeneralError,
    selectedCompany,
    selectedClient,
    calculations,
    template,
    companies,
    clients,
    isGenerating,
    currencies,
    error,
    validationErrors,
    isLoading,
    previewMode,
    showClientDropdown,
    clientSearch,
    invoiceNumber,

    // Actions
    setInvoiceData,
    setSelectedClientSafe,
    setSelectedCompany,
    setSelectedClient,
    setCalculations,
    setCompanies,
    setClients,
    setIsGenerating,
    setError,
    setvalidationErrors,
    setIsLoading,
    setPreviewMode,
    setShowClientDropdown,
    setClientSearch,
    generateInvoiceNumber,
    addItem,
    updateItem,
    removeItem,
    updateFormField,
    calculateTotals,
    getInvoicePDFProps,
    resetInvoice,
  } = useInvoiceFormStore();

  // Keep React Hook Form for validation only - sync with Zustand
  const form = useForm<InvoiceFormData>({
    defaultValues: formData,
  });



  // Sync form with Zustand store
  useEffect(() => {
    if (formData) {
      form.reset(formData);
    }
  }, [formData, form]);

  // Custom validation function that uses both RHF and Zustand
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    clearValidationErrors();

    // Validate using RHF
    const isRHFValid = await form.trigger();

    // Validate using Zustand
    const isZustandValid = validateForm();

    if (isRHFValid && isZustandValid) {
      // Submit the form
      console.log("Form is valid, submitting...", formData);
      // Call your submit function here
    } else {
      console.log("Form has errors", {
        rhfErrors: form.formState.errors,
        zustandErrors: validationErrors,
      });
    }
  };

  // Load initial data on component mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Show loading state
  if (isInitialLoading) {
    return <div>Loading companies and clients...</div>;
  }

  // Show error state
  if (generalError) {
    return <div>Error: {generalError}</div>;
  }

  // Handle form changes and update Zustand store
  const handleFormChange = (field: keyof InvoiceFormData, value: any) => {
    setInvoiceData({ [field]: value });
    form.setValue(field, value);
  };

  // const handleFieldChange = (fieldName, value) => {
  //   // Update the field in state or form data
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [fieldName]: value,
  //   }));
  // };

  // Handle item changes
  const handleItemChange = (
    index: number,
    field: keyof InvoiceFormData["items"][0],
    value: any
  ) => {
    const currentItems = [...(formData?.items || [])];
    currentItems[index] = { ...currentItems[index], [field]: value };

    // Calculate amount for quantity/rate changes
    if (field === "quantity" || field === "rate") {
      const quantity =
        field === "quantity" ? value : currentItems[index].quantity;
      const rate = field === "rate" ? value : currentItems[index].rate;
      currentItems[index].amount = quantity * rate;
    }

    setInvoiceData({ items: currentItems });
  };

  // Client selection handler
  // Client selection handler - Updated to avoid hydration issues
  const handleClientSelect = (client: ClientInfo) => {
    // Use the safe version that doesn't calculate dates immediately
    setSelectedClientSafe(client);
  };

  // Filter clients based on search
  const filteredClients = clients.filter(
    (client) =>
      client.status === "active" &&
      (client.name.toLowerCase().includes(clientSearch?.toLowerCase()) ||
        client.email?.toLowerCase().includes(clientSearch?.toLowerCase()) ||
        (client.company &&
          client.company?.toLowerCase().includes(clientSearch?.toLowerCase())))
  );
  // Add item handler
  const handleAddItem = () => {
    const newItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    addItem(newItem);
  };

  // Remove item handler
  const handleRemoveItem = (index: number) => {
    if (formData?.items && formData.items.length > 1) {
      const itemToRemove = formData.items[index];
      removeItem(itemToRemove.id);
    }
  };

  // Preview handler
  const handlePreview = () => {
    setPreviewMode(true);
  };

  const handleBackToEdit = () => {
    setPreviewMode(false);
  };

  // Submit handler
  const onSubmit = async (data: InvoiceFormData) => {
    setIsLoading(true);

    try {
      const invoiceDataWithCalculations = {
        ...formData,
        ...calculations,
      };

      const response = await fetch("/api/invoices/send-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceDataWithCalculations),
      });

      const result: InvoiceApiResponse = await response.json();

      if (!response.ok) {
        if (result.errors) {
          setvalidationErrors(result.errors);
          Object.entries(result.errors).forEach(([field, message]) => {
            form.setError(field as keyof InvoiceFormData, { message });
          });
        }
        throw new Error(result.message || "Failed to create invoice");
      }

      alert(
        `Invoice created successfully! Invoice ID: ${result.data?.invoiceId}`
      );
    } catch (error) {
      console.error("Error creating invoice:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create invoice"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // PDF Generation
  // const generatePDF = useCallback(
  //   async (props: InvoicePdfProps) => {
  //     setIsGenerating(true);
  //     setError(null);

  //     try {
  //       const doc = (
  //         <InvoicePDF
  //           invoiceData={props.invoiceData}
  //           selectedCompany={props.selectedCompany}
  //           selectedClient={props.selectedClient}
  //           calculations={props.calculations}
  //           template={props.template}
  //         />
  //       );

  //       const blob = await pdf(doc).toBlob();
  //       return blob;
  //     } catch (err) {
  //       const errorMessage =
  //         err instanceof Error ? err.message : "Failed to generate PDF";
  //       setError(errorMessage);
  //       throw new Error(errorMessage);
  //     } finally {
  //       setIsGenerating(false);
  //     }
  //   },
  //   [setIsGenerating, setError]
  // );

  // const downloadPDF = useCallback(
  //   async (props: InvoicePdfProps, filename?: string) => {
  //     try {
  //       const blob = await generatePDF(props);
  //       const url = URL.createObjectURL(blob);
  //       const link = document.createElement("a");
  //       link.href = url;
  //       link.download =
  //         filename || `invoice-${props.invoiceData?.invoiceNumber}.pdf`;
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //       URL.revokeObjectURL(url);
  //     } catch (err) {
  //       console.error("Error downloading PDF:", err);
  //     }
  //   },
  //   [generatePDF]
  // );

  // const previewPDF = useCallback(
  //   async (props: InvoicePdfProps) => {
  //     try {
  //       const blob = await generatePDF(props);
  //       const url = URL.createObjectURL(blob);
  //       window.open(url, "_blank");
  //       setTimeout(() => URL.revokeObjectURL(url), 1000);
  //     } catch (err) {
  //       console.error("Error previewing PDF:", err);
  //     }
  //   },
  //   [generatePDF]
  // );

  // Get current currency
  const selectedCurrency = currencies.find(
    (c) => c.code === formData?.currency || "USD"
  );

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
            invoiceData={formData}
            calculations={calculations}
            selectedClient={selectedClient}
            selectedCompany={selectedCompany}
            onBack={handleBackToEdit}
            previewPDF={previewPDF}
            downloadPDF={downloadPDF}
            generatePDF={generatePDF}
            getInvoicePDFProps={getInvoicePDFProps}
            error={error}
          />
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                      onChange={(e) => {
                        const companyId = e.target.value;
                        const company = companies.find(
                          (c) => c._id === companyId
                        );
                        setSelectedCompany(company || null);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="">Choose your company...</option>
                      {companies.map((company) => (
                        <option key={company._id} value={company._id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                    {form.formState.errors.companyId && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.companyId.message}
                      </p>
                    )}
                  </div>

                  {selectedCompany && (
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {selectedCompany.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {selectedCompany.contact?.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedCompany?.address},
                        {/* {selectedCompany.address.city},{" "}
                        {selectedCompany.address.state}
                         {selectedCompany.address.zipCode} */}
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
                              key={client._id}
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
                              {client.company && (
                                <div className="text-sm text-gray-400">
                                  {client.company}
                                </div>
                              )}
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
                  </div>

                  {selectedClient && (
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {selectedClient.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {selectedClient.email}
                      </p>
                      {selectedClient.company ? (
                        <p className="text-sm text-gray-600">
                          {selectedClient?.company}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-600">
                          Company Data not Found
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
                      value={formData.invoiceNumber || ""}
                      onChange={(e) =>
                        updateFormField("invoiceNumber", e.target.value)
                      }
                      className={`flex-1 px-3 py-2 border ${
                        validationErrors?.invoiceNumber
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      } rounded-l-lg focus:ring-2 focus:border-transparent`}
                      placeholder="Enter invoice number"
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
                  {validationErrors?.invoiceNumber && (
                    <p className="text-red-500 text-xs mt-1">
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
                      value={formData.invoiceDate || ""}
                      onChange={(e) =>
                        updateFormField("invoiceDate", e.target.value)
                      }
                      className={`w-full px-3 py-2 pl-10 border ${
                        validationErrors?.invoiceDate
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      } rounded-lg focus:ring-2 focus:border-transparent`}
                    />
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                  {validationErrors?.invoiceDate && (
                    <p className="text-red-500 text-xs mt-1">
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
                      value={formData.dueDate || ""}
                      onChange={(e) =>
                        updateFormField("dueDate", e.target.value)
                      }
                      className={`w-full px-3 py-2 pl-10 border ${
                        validationErrors?.dueDate
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      } rounded-lg focus:ring-2 focus:border-transparent`}
                    />
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                  {validationErrors?.dueDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.dueDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={formData.currency || "USD"}
                    onChange={(e) =>
                      updateFormField("currency", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {currencies?.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
