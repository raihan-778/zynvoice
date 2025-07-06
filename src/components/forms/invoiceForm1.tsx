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
  Trash2,
  User,
} from "lucide-react";
import { InvoicePDF } from "../pdf/InvoicePDFTemplate";
import { Label } from "../ui/label";
import { useInvoiceFormStore } from "@/stors/invoiceFormStore";
import { CompanyInfo } from "@/lib/validations/validation";

// Form data interface matching your invoice schema

export default function InvoiceForm1() {
  // Get state and actions from store

  const {
    // State
    invoiceForm,
    formErrors,
    selectedClient,
    selectedCompany,

    clientSearch,
    showClientDropdown,
    isLoading,
    previewMode,

    // Actions
    updateInvoiceField,
    updateNestedField,
    updateItem,
    addItem,
    removeItem,
    setClientSearch,
    setShowClientDropdown,
    setSelectedClient,
    setSelectedCompany,
    validateForm,
    resetForm,
    setPreviewMode,
  } = useInvoiceFormStore();

  const [clients, setClients] = useState([]);
  const [companies, setCompanies] = useState([]);

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

  // Helper functions
  const handleInputChange = (field, value) => {
    updateInvoiceField(field, value);
  };

  const handleNestedChange = (path, value) => {
    updateNestedField(path, value);
  };

  const handleItemChange = (index, field, value) => {
    updateItem(index, field, value);
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    updateInvoiceField("clientId", client._id.toString());
    setClientSearch(client.name);
    setShowClientDropdown(false);

    // Auto-fill due date based on payment terms
    if (client.paymentTerms) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + client.paymentTerms);
      updateInvoiceField("dueDate", dueDate.toISOString().split("T")[0]);
    }
  };

  const handleCompanySelect = (companyId) => {
    const company = companies.find((c) => c._id.toString() === companyId);
    setSelectedCompany(company);
    updateInvoiceField("companyId", companyId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Your submit logic here
    console.log("Form submitted:", invoiceForm);
  };

  const handlePreview = () => {
    if (validateForm()) {
      setPreviewMode(true);
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
            invoiceData={invoiceForm}
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

                {/* // Company Selection Form - Updated for Zustand */}
                <div className="space-y-4">
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Company *
                    </Label>
                    <select
                      value={invoiceForm.companyId}
                      onChange={(e) =>
                        handleInputChange("companyId", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      required
                    >
                      <option value="">Choose your company...</option>
                      {companies.map((company: CompanyInfo) => (
                        <option
                          key={company?._id?.toString()}
                          value={company?._id?.toString()}
                        >
                          {company.name}
                        </option>
                      ))}
                    </select>
                    {apiErrors.companyId && (
                      <p className="text-red-500 text-sm mt-1">
                        {apiErrors.companyId}
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
                        {selectedCompany.address.street},{" "}
                        {selectedCompany.address.city},{" "}
                        {selectedCompany.address.state}{" "}
                        {selectedCompany.address.zipCode}
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
                    {form.formState.errors.clientId && (
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
                      {selectedClient.address.street && (
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
                      {...form.register("invoiceNumber", {
                        required: "Invoice number is required",
                      })}
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      {...form.register("invoiceDate", {
                        required: "Invoice date is required",
                      })}
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      {...form.register("dueDate", {
                        required: "Due date is required",
                      })}
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    {...form.register("currency")}
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
                    {...form.register("recurring.isRecurring")}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Make this a recurring invoice
                  </label>
                </div>

                {watchedRecurring?.isRecurring && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency
                      </label>
                      <select
                        {...form.register("recurring.frequency")}
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
                        {...form.register("recurring.nextDate")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date (Optional)
                      </label>
                      <input
                        type="date"
                        {...form.register("recurring.endDate")}
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
                  onClick={addItems}
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

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="px-6 py-4 grid grid-cols-12 gap-4 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="col-span-5">
                      <textarea
                        {...form.register(`items.${index}.description`, {
                          required: "Description is required",
                        })}
                        placeholder="Describe your service or product..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      />
                      {form.formState.errors.items?.[index]?.description && (
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
                        {...form.register(`items.${index}.quantity`, {
                          required: "Quantity is required",
                          min: {
                            value: 0.01,
                            message: "Quantity must be greater than 0",
                          },
                          valueAsNumber: true, // Added this line
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center"
                      />
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
                          {...form.register(`items.${index}.rate`, {
                            required: "Rate is required",
                            min: {
                              value: 0,
                              message: "Rate cannot be negative",
                            },
                            valueAsNumber: true,
                          })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center"
                        />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center justify-center h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 font-medium">
                        {selectedCurrency?.symbol || "$"}
                        {form.watch(`items.${index}.amount`)?.toFixed(2) ||
                          "0.00"}
                      </div>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={fields.length === 1}
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
                        {...form.register("taxRate", { valueAsNumber: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Discount Type
                        </label>
                        <select
                          {...form.register("discountType")}
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
                            {form.watch("discountType") === "percentage"
                              ? "%"
                              : selectedCurrency?.symbol || "$"}
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            {...form.register("discountValue", {
                              valueAsNumber: true,
                            })}
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
                      {...form.register("notes")}
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
                      {...form.register("terms")}
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
                        {form.watch("discountType") === "percentage"
                          ? `${form.watch("discountValue")}%`
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
                        Tax ({form.watch("taxRate")}%):
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
                        Payment Terms: {form.watch("paymentTerms")} days
                      </p>
                      <p className="text-sm text-gray-600">
                        Due Date:{" "}
                        {new Date(form.watch("dueDate")).toLocaleDateString()}
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
                disabled={isLoading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handlePreview()}
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                Preview Invoice
              </button>
              <button
                type="submit"
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
            {Object.keys(form.formState.errors).length > 0 && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-red-800 font-medium mb-2">
                  Please fix the following errors:
                </h4>
                <ul className="text-sm text-red-600 space-y-1">
                  {form.formState.errors.companyId && (
                    <li>• Company selection is required</li>
                  )}
                  {form.formState.errors.clientId && (
                    <li>• Client selection is required</li>
                  )}
                  {form.formState.errors.invoiceNumber && (
                    <li>• Invoice number is required</li>
                  )}
                  {form.formState.errors.invoiceDate && (
                    <li>• Invoice date is required</li>
                  )}
                  {form.formState.errors.dueDate && (
                    <li>• Due date is required</li>
                  )}
                  {form.formState.errors.items && (
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
