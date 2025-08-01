// components/InvoiceFormBuilder.tsx
import React, { useCallback, useEffect } from "react";

import { EmailState, useInvoiceStore } from "@/stors/invoiceStore";
import { pdf } from "@react-pdf/renderer";
import { RefreshCw } from "lucide-react";
import { InvoicePDF } from "../pdf/InvoicePDFTemplate";

export const InvoiceFormBuilder: React.FC = () => {
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
  } = useInvoiceStore();

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load companies
        const companiesResponse = await fetch("/api/companies/get-company");
        const companyData = await companiesResponse.json();
        const companies = await companyData.data.companies;

        // console.log(companies);
        setCompanies(companies);
        // console.log(companies);

        // Load clients
        const clientsResponse = await fetch("/api/clients/get-client");
        const data = await clientsResponse.json();
        // console.log(data);
        const clientsData = await data.data;
        setClients(clientsData);

        // console.log("Companies:", companies, "Clients:", clients);
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

  // Add these to your store implementation
  const emailInitialState: EmailState = {
    isEmailSending: false,
    emailError: null,
    emailSuccess: false,
    emailHistory: [],
    emailTemplates: [],
    selectedEmailTemplate: null,
  };

  // // Recalculate totals when items change
  // useEffect(() => {
  //   calculateTotals();
  // }, [
  //   invoiceData.items,
  //   invoiceData.taxRate,
  //   invoiceData.discountType,
  //   invoiceData.discountValue,
  //   calculateTotals,
  // ]);

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
          templates={pdfProps.templates}
          invoiceData={pdfProps.invoiceData}
          selectedCompany={pdfProps.selectedCompany}
          selectedClient={pdfProps.selectedClient}
          generatePDF={generatePDF}
          downloadPDF={downloadPDF}
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
        const item = invoiceData?.items?.find((item) => item.id === id);
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

  // Check if all required data is available
  const canGeneratePDF =
    selectedCompany && selectedClient && invoiceData.items.length > 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Invoice Generator</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Company Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Company
          </label>
          <select
            value={selectedCompany?._id || ""}
            onChange={(e) => {
              const company =
                companies && companies.find((c) => c._id === e.target.value);
              setSelectedCompany(company || null);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a company...</option>

            {companies &&
              companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.name}
                </option>
              ))}
          </select>
        </div>

        {/* Client Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Client
          </label>
          <select
            value={selectedClient?._id || ""}
            onChange={(e) => {
              const client =
                clients && clients.find((c) => c._id === e.target.value);
              setSelectedClient(client || null);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a client...</option>
            {clients &&
              clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
          </select>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invoice Number
            </label>
            <div className="flex">
              {" "}
              <input
                type="text"
                value={invoiceNumber}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="INV-001"
              />{" "}
              <button
                type="button"
                onClick={generateInvoiceNumber}
                className="px-3 py-2 bg-gray-200 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-300 transition-colors"
                title="Generate new invoice number"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invoice Date
            </label>
            <input
              type="date"
              value={
                invoiceData.invoiceDate instanceof Date
                  ? invoiceData.invoiceDate.toISOString().split("T")[0]
                  : invoiceData.invoiceDate
              }
              onChange={(e) => setInvoiceData({ invoiceDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Invoice Items */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Invoice Items</h2>
            <button
              onClick={handleAddItem}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Item
            </button>
          </div>

          <div className="space-y-4">
            {invoiceData.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 items-center bg-gray-50 p-4 rounded-md"
              >
                <div className="flex-1">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      handleUpdateItem(item.id, "description", e.target.value)
                    }
                    placeholder="Item description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-20">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleUpdateItem(
                        item.id,
                        "quantity",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="Qty"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-24">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      handleUpdateItem(
                        item.id,
                        "rate",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="Rate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-24">
                  <input
                    type="number"
                    value={item.amount}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
                <button
                  onClick={() => removeItem(item?.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tax and Discount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Rate (%)
            </label>
            <input
              type="number"
              value={invoiceData.taxRate}
              onChange={(e) =>
                setInvoiceData({ taxRate: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Value
            </label>
            <input
              type="number"
              value={invoiceData.discountValue}
              onChange={(e) =>
                setInvoiceData({
                  discountValue: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
        </div>

        {/* Totals Display */}
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <div className="flex justify-between items-center mb-2">
            <span>Subtotal:</span>
            <span>${calculations.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span>Discount:</span>
            <span>-${calculations.discountAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span>Tax:</span>
            <span>${calculations.taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span>${calculations.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={previewPDF}
            disabled={!canGeneratePDF || isGenerating}
            className={`px-6 py-3 rounded-md font-medium ${
              canGeneratePDF && !isGenerating
                ? "bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isGenerating ? "Generating..." : "Preview PDF"}
          </button>

          <button
            onClick={downloadPDF}
            disabled={!canGeneratePDF || isGenerating}
            className={`px-6 py-3 rounded-md font-medium ${
              canGeneratePDF && !isGenerating
                ? "bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isGenerating ? "Generating..." : "Download PDF"}
          </button>

          <button
            onClick={resetInvoice}
            className="px-6 py-3 rounded-md font-medium bg-gray-500 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Reset
          </button>
        </div>

        {/* Status Messages */}
        {!selectedCompany && (
          <div className="mt-4 text-amber-600">
            ⚠️ Please select a company to continue
          </div>
        )}
        {!selectedClient && (
          <div className="mt-4 text-amber-600">
            ⚠️ Please select a client to continue
          </div>
        )}
        {invoiceData.items.length === 0 && (
          <div className="mt-4 text-amber-600">
            ⚠️ Please add at least one item to the invoice
          </div>
        )}
      </div>
    </div>
  );
};
