import { Download, Eye, EyeOff, FileText, Palette } from "lucide-react";
import React, { useState } from "react";

import { InvoicePdfProps } from "@/types/database";

export const InvoicePreviewSection: React.FC<InvoicePdfProps> = ({
  invoiceData,
  selectedCompany,
  selectedClient,
  calculations,
  template,
  templates,
  generatePDF,
  downloadPDF,
}) => {
  const [showPreview, setShowPreview] = useState(true);
  const [previewSize, setPreviewSize] = useState("normal");
  const [isGenerating, setisGenerating] = useState(false); // small, normal, large

  // Default templates if none provided from store
  const defaultTemplates = [
    {
      id: "classic",
      name: "Classic Blue",
      primary: "#2563eb",
      secondary: "#f8fafc",
    },
    {
      id: "modern",
      name: "Modern Green",
      primary: "#059669",
      secondary: "#f0fdf4",
    },
    {
      id: "elegant",
      name: "Elegant Purple",
      primary: "#7c3aed",
      secondary: "#faf5ff",
    },
    {
      id: "minimal",
      name: "Minimal Gray",
      primary: "#374151",
      secondary: "#f9fafb",
    },
  ];

  // Use store templates or fallback to defaults
  const availableTemplates =
    templates && templates.length > 0 ? templates : defaultTemplates;

  // Current template - improved logic
  const currentTemplate = React.useMemo(() => {
    if (!template) {
      return availableTemplates[0];
    }
    // Find template by ID if template is an object with id, otherwise use template directly
    if (typeof template === "object" && template.id) {
      return availableTemplates.find((t) => t.id === template.id) || template;
    }
    return template;
  }, [template, availableTemplates]);

  // Use store calculations or fallback calculations
  const subtotal =
    calculations?.subtotal ||
    invoiceData?.items?.reduce((sum, item) => sum + (item.amount || 0), 0) ||
    0;
  const discountAmount =
    calculations?.discountAmount || invoiceData?.discountValue || 0;
  const taxAmount = calculations?.taxAmount || 0;
  const total = calculations?.total || subtotal - discountAmount + taxAmount;

  // Handle template change with proper error handling
  const handleTemplateChange = (templateOption) => {
    try {
      console.log("Changing template to:", templateOption);
      if (setTemplate) {
        setTemplate(templateOption);
      } else {
        console.error("setTemplate function not provided");
      }
    } catch (err) {
      console.error("Error changing template:", err);
    }
  };

  const InvoicePreview = () => (
    <div
      className="bg-white border rounded-lg shadow-lg overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: currentTemplate?.secondary || "#f8fafc",
        transform:
          previewSize === "small"
            ? "scale(0.7)"
            : previewSize === "large"
            ? "scale(1.1)"
            : "scale(1)",
        transformOrigin: "top center",
      }}
    >
      {/* Header */}
      <div
        className="px-8 py-6 text-white"
        style={{ backgroundColor: currentTemplate?.primary || "#2563eb" }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">INVOICE</h1>
            <p className="text-lg opacity-90">
              #{invoiceData?.invoiceNumber || "INV-000"}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-semibold">
              {selectedCompany?.name || "Company Name"}
            </h2>

            <p className="opacity-90">
              {selectedCompany?.address.country || "Country"}
            </p>
            <p className="opacity-90">
              {selectedCompany?.address.city || "City"}
            </p>
            <p className="opacity-90">{selectedCompany?.phone || "Phone"}</p>
            <p className="opacity-90">{selectedCompany?.email || "Email"}</p>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Bill To:</h3>
            <div className="text-gray-600">
              <p className="font-medium">
                {selectedClient?.name || "Client Name"}
              </p>

              <p>
                {selectedClient?.address.city || "City"},{" "}
                {selectedClient?.address.country || "State"}{" "}
                {selectedClient?.address.street || "ZIP"}
              </p>
              <p>{selectedClient?.email || "client@email.com"}</p>
            </div>
          </div>
          <div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Invoice Date:</span>
                <span className="font-medium">
                  {invoiceData?.invoiceDate ||
                    new Date().toISOString().split("T")[0]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Due Date:</span>
                <span className="font-medium">
                  {invoiceData?.dueDate ||
                    new Date().toISOString().split("T")[0]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr
                className="border-b-2"
                style={{ borderColor: currentTemplate?.primary || "#2563eb" }}
              >
                <th className="text-left py-3 font-semibold text-gray-700">
                  Description
                </th>
                <th className="text-right py-3 font-semibold text-gray-700">
                  Qty
                </th>
                <th className="text-right py-3 font-semibold text-gray-700">
                  Rate
                </th>
                <th className="text-right py-3 font-semibold text-gray-700">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {invoiceData?.items?.length > 0 ? (
                invoiceData.items.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className="border-b border-gray-200"
                  >
                    <td className="py-3">
                      {item.description || "Item description"}
                    </td>
                    <td className="text-right py-3">{item.quantity || 1}</td>
                    <td className="text-right py-3">
                      ${(item.rate || 0).toFixed(2)}
                    </td>
                    <td className="text-right py-3">
                      ${(item.amount || 0).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b border-gray-200">
                  <td className="py-3 text-gray-500" colSpan="4">
                    No items added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount:</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Tax ({invoiceData?.taxRate || 0}%):
                </span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div
                className="flex justify-between font-bold text-lg border-t-2 pt-2"
                style={{ borderColor: currentTemplate?.primary || "#2563eb" }}
              >
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoiceData?.notes && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-700 mb-2">Notes:</h4>
            <p className="text-gray-600">{invoiceData.notes}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Invoice Preview
              </h2>
              <p className="text-gray-600">Live preview of your invoice</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Preview Toggle */}
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {showPreview ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                <span>{showPreview ? "Hide Preview" : "Show Preview"}</span>
              </button>

              {/* Size Controls */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Size:</span>
                <select
                  value={previewSize}
                  onChange={(e) => setPreviewSize(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="small">Small</option>
                  <option value="normal">Normal</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Template Selector Sidebar */}
          <div className="w-80 border-r border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Choose Template
            </h3>

            {/* Debug info - remove in production */}
            {process.env.NODE_ENV === "development" && (
              <div className="mb-4 p-2 bg-gray-100 text-xs rounded">
                <p>Current template ID: {currentTemplate?.id || "none"}</p>
                <p>Template function: {typeof setTemplate}</p>
              </div>
            )}

            <div className="space-y-3">
              {availableTemplates.map((templateOption) => {
                const isSelected = currentTemplate?.id === templateOption.id;
                return (
                  <div
                    key={templateOption.id}
                    onClick={() => handleTemplateChange(templateOption)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{templateOption.name}</h4>
                        <div className="flex items-center mt-2">
                          <div
                            className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                            style={{ backgroundColor: templateOption.primary }}
                          ></div>
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{
                              backgroundColor: templateOption.secondary,
                            }}
                          ></div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="w-4 h-4" />
                <span>{isGenerating ? "Generating..." : "Generate PDF"}</span>
              </button>
              <button
                onClick={downloadPDF}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Invoice</span>
              </button>
            </div>

            {/* Error Display */}
            {/* {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )} */}
          </div>

          {/* Preview Area */}
          <div className="flex-1 p-6">
            {showPreview ? (
              <div className="overflow-auto max-h-screen">
                <InvoicePreview />
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-500">
                <div className="text-center">
                  <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Preview is hidden</p>
                  <p className="text-sm">
                    Click &quot;Show Preview&quot; to see your invoice
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
