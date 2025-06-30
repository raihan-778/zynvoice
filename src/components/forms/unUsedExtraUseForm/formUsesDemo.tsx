import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Download,
  Eye,
  FileText,
  Send,
  Plus,
  Trash2,
  Calendar,
} from "lucide-react";

// Mock data for demonstration
const mockClientList = [
  {
    id: "1",
    name: "Acme Corporation",
    email: "contact@acme.com",
    address: "123 Business St, NY 10001",
    phone: "+1 (555) 123-4567",
  },
  {
    id: "2",
    name: "Tech Solutions Inc",
    email: "info@techsolutions.com",
    address: "456 Tech Ave, CA 94105",
    phone: "+1 (555) 987-6543",
  },
];

const mockCompanyList = [
  {
    id: "1",
    name: "Your Company Ltd",
    email: "hello@yourcompany.com",
    address: "789 Main St, TX 75001",
    phone: "+1 (555) 111-2222",
    website: "www.yourcompany.com",
  },
];

// Helper function to calculate totals
function calculateInvoiceTotals(items, taxRate, discountValue, discountType) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );

  let discount = 0;
  if (discountType === "percentage") {
    discount = (subtotal * discountValue) / 100;
  } else {
    discount = discountValue;
  }

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const tax = (discountedSubtotal * taxRate) / 100;
  const total = discountedSubtotal + tax;

  return { subtotal, tax, total, discount };
}

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

export default function InvoiceForm() {
  const [currentTab, setCurrentTab] = useState("details");
  const [totals, setTotals] = useState({
    subtotal: 0,
    tax: 0,
    total: 0,
    discount: 0,
  });

  // Form state
  const [formData, setFormData] = useState({
    invoiceNumber: `INV-${Date.now()}`,
    client: mockClientList[0],
    companyInfo: mockCompanyList[0],
    items: [
      {
        id: Date.now().toString(),
        description: "",
        quantity: 1,
        rate: 0,
      },
    ],
    dates: {
      issued: new Date(),
      due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    currency: "USD",
    discountType: "percentage",
    discountValue: 0,
    taxRate: 0,
    notes: "",
    terms: "",
    paymentInstructions: "",
    template: "modern",
    status: "draft",
  });

  // Calculate totals whenever items or rates change
  useEffect(() => {
    const newTotals = calculateInvoiceTotals(
      formData.items || [],
      formData.taxRate || 0,
      formData.discountValue || 0,
      formData.discountType || "percentage"
    );
    setTotals(newTotals);
  }, [
    formData.items,
    formData.taxRate,
    formData.discountValue,
    formData.discountType,
  ]);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateNestedFormData = (field, subfield, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [subfield]: value },
    }));
  };

  const updateItemData = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addNewItem = () => {
    const newItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
    };
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, items: newItems }));
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", { ...formData, ...totals });
    alert("Invoice saved successfully!");
  };

  const handlePreview = () => {
    console.log("Preview:", { ...formData, ...totals });
    alert("Preview functionality would open here");
  };

  const handleDownload = () => {
    console.log("Download:", { ...formData, ...totals });
    alert("PDF download would start here");
  };

  const handleSendEmail = () => {
    console.log("Send Email:", { ...formData, ...totals });
    alert("Email sending functionality would trigger here");
  };

  const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "INR"];
  const templates = [
    { id: "modern", name: "Modern", description: "Clean and professional" },
    { id: "classic", name: "Classic", description: "Traditional layout" },
    { id: "minimal", name: "Minimal", description: "Simple and elegant" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold">Create Invoice</h1>
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Total: {totals.total.toFixed(2)} {formData.currency}
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Tab Navigation */}
          <div className="flex border-b mb-6">
            {[
              { id: "details", label: "Details" },
              { id: "items", label: `Items (${formData.items.length})` },
              { id: "totals", label: "Totals" },
              { id: "template", label: "Template" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  currentTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {/* Details Tab */}
            {currentTab === "details" && (
              <div className="space-y-6">
                {/* Invoice Number */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Invoice Number *
                  </label>
                  <input
                    type="text"
                    value={formData.invoiceNumber}
                    onChange={(e) =>
                      updateFormData("invoiceNumber", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="INV-001"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Client Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Select Client *
                    </label>
                    <select
                      value={formData.client?.id || ""}
                      onChange={(e) => {
                        const client = mockClientList.find(
                          (c) => c.id === e.target.value
                        );
                        updateFormData("client", client);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Choose a client</option>
                      {mockClientList.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name} ({client.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Company Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Select Company Info *
                    </label>
                    <select
                      value={formData.companyInfo?.id || ""}
                      onChange={(e) => {
                        const company = mockCompanyList.find(
                          (c) => c.id === e.target.value
                        );
                        updateFormData("companyInfo", company);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Choose company info</option>
                      {mockCompanyList.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Currency */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) =>
                        updateFormData("currency", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {currencies.map((curr) => (
                        <option key={curr} value={curr}>
                          {curr}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Issue Date */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Issue Date
                    </label>
                    <input
                      type="date"
                      value={formData.dates.issued.toISOString().split("T")[0]}
                      onChange={(e) =>
                        updateNestedFormData(
                          "dates",
                          "issued",
                          new Date(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.dates.due.toISOString().split("T")[0]}
                      onChange={(e) =>
                        updateNestedFormData(
                          "dates",
                          "due",
                          new Date(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <hr className="my-6" />

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Additional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Notes
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) =>
                          updateFormData("notes", e.target.value)
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Any additional notes..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Terms & Conditions
                      </label>
                      <textarea
                        value={formData.terms}
                        onChange={(e) =>
                          updateFormData("terms", e.target.value)
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Payment terms and conditions..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Payment Instructions
                    </label>
                    <textarea
                      value={formData.paymentInstructions}
                      onChange={(e) =>
                        updateFormData("paymentInstructions", e.target.value)
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="How should clients pay this invoice..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Items Tab */}
            {currentTab === "items" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Service Items</h3>
                  <button
                    type="button"
                    onClick={addNewItem}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.items.map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-gray-50 p-4 rounded-lg border"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="md:col-span-5">
                          <label className="block text-sm font-medium mb-2">
                            Description
                          </label>
                          <textarea
                            value={item.description}
                            onChange={(e) =>
                              updateItemData(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Service description..."
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-2">
                            Quantity
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItemData(
                                index,
                                "quantity",
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-2">
                            Rate
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) =>
                              updateItemData(
                                index,
                                "rate",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-2">
                            Total
                          </label>
                          <div className="h-10 px-3 py-2 bg-gray-100 rounded-lg flex items-center font-medium">
                            {(item.quantity * item.rate).toFixed(2)}
                          </div>
                        </div>
                        <div className="md:col-span-1">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            disabled={formData.items.length === 1}
                            className="w-full h-10 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                          >
                            <Trash2 className="w-4 h-4 mx-auto" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Totals Tab */}
            {currentTab === "totals" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tax & Discount</h3>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={formData.taxRate}
                      onChange={(e) =>
                        updateFormData(
                          "taxRate",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Discount Type
                    </label>
                    <select
                      value={formData.discountType}
                      onChange={(e) =>
                        updateFormData("discountType", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Discount Value{" "}
                      {formData.discountType === "percentage"
                        ? "(%)"
                        : `(${formData.currency})`}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.discountValue}
                      onChange={(e) =>
                        updateFormData(
                          "discountValue",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Invoice Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>
                        {totals.subtotal.toFixed(2)} {formData.currency}
                      </span>
                    </div>
                    {totals.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>
                          -{totals.discount.toFixed(2)} {formData.currency}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Tax ({formData.taxRate}%):</span>
                      <span>
                        {totals.tax.toFixed(2)} {formData.currency}
                      </span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>
                        {totals.total.toFixed(2)} {formData.currency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Template Tab */}
            {currentTab === "template" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Choose Template</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => updateFormData("template", template.id)}
                      className={`cursor-pointer p-4 border rounded-lg text-center transition-colors ${
                        formData.template === template.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <h4 className="font-semibold">{template.name}</h4>
                      <p className="text-sm text-gray-600">
                        {template.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="border-t pt-6">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handlePreview}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>

                <button
                  type="button"
                  onClick={handleSendEmail}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Send Email
                </button>

                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-auto"
                >
                  <DollarSign className="w-4 h-4" />
                  Save Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
