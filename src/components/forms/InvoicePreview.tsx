"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useInvoiceStore } from "@/stors/invoiceStore";
import { pdf } from "@react-pdf/renderer";
import {
  Copy,
  Download,
  Eye,
  Layout,
  Palette,
  Send,
  Settings,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { InvoicePDF } from "../pdf/InvoicePDFTemplate";

// Sample data based on your database types

// Template configurations
const templates = {
  modern: {
    name: "Modern",
    description: "Clean, contemporary design with bold typography",
    layout: "modern" as const,
    primaryColor: "#3b82f6",
    secondaryColor: "#1e40af",
    fontFamily: "Inter",
    fontSize: 14,
    logoPosition: "left" as "left" | "center" | "right",
    showLogo: true,
    showCompanyAddress: true,
    showClientAddress: true,
    showInvoiceNumber: true,
    showDates: true,
    showPaymentTerms: true,
    showNotes: true,
    showTerms: true,
  },
  classic: {
    name: "Classic",
    description: "Traditional business invoice with formal styling",
    layout: "classic" as const,
    primaryColor: "#1f2937",
    secondaryColor: "#374151",
    fontFamily: "Georgia",
    fontSize: 13,
    logoPosition: "center" as "left" | "center" | "right",
    showLogo: true,
    showCompanyAddress: true,
    showClientAddress: true,
    showInvoiceNumber: true,
    showDates: true,
    showPaymentTerms: true,
    showNotes: true,
    showTerms: true,
  },
  minimal: {
    name: "Minimal",
    description: "Simple, distraction-free design",
    layout: "minimal" as const,
    primaryColor: "#000000",
    secondaryColor: "#6b7280",
    fontFamily: "Arial",
    fontSize: 12,
    logoPosition: "right" as "left" | "center" | "right",
    showLogo: false,
    showCompanyAddress: true,
    showClientAddress: true,
    showInvoiceNumber: true,
    showDates: true,
    showPaymentTerms: false,
    showNotes: false,
    showTerms: false,
  },
};

const {
  // State
  // invoiceData,
  // selectedCompany,
  // selectedClient,
  // calculations,
  // template,
  // companies,
  // clients,
  // isGenerating,
  // error,
  // invoiceNumber,
  // Actions
  // setInvoiceData,
  // setSelectedCompany,
  // setSelectedClient,
  // setTemplate,
  // setCompanies,
  // setClients,
  // addItem,
  // updateItem,
  // removeItem,
  // setIsGenerating,
  // setError,
  // generateInvoiceNumber,
  // calculateTotals,
  // getInvoicePDFProps,
  // resetInvoice,
} = useInvoiceStore;

export const InvoicePreview = ({
  invoiceData,
  calculations,
  selectedClient,
  selectedCompany,
  onBack,
  template,
}) => {
  const [selectedTemplate, setSelectedTemplate] =
    useState<keyof typeof templates>("modern");
  const [customization, setCustomization] = useState<
    (typeof templates)[keyof typeof templates]
  >(templates.modern);
  const [previewMode, setPreviewMode] = useState<"edit" | "preview">("preview");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const generatePDF = useCallback(async () => {
    setIsGenerating(true);
    setError("");

    try {
      // Get all required data from store
      const pdfProps = {
        invoiceData,
        selectedClient,
        selectedCompany,
        calculations,
        templates,
      };

      if (!pdfProps) {
        throw new Error(
          "Missing required data. Please ensure company and client are selected."
        );
      }

      console.log("Generating PDF with data:", pdfProps);

      const doc = (
        <InvoicePDF
          calculations={pdfProps.calculations}
          invoiceData={pdfProps.invoiceData}
          selectedCompany={pdfProps.selectedCompany}
          selectedClient={pdfProps.selectedClient}
          template={pdfProps.template.classic}
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
  }, [setIsGenerating, setError]);

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
  }, [generatePDF, invoiceData?.invoiceNumber]);

  useEffect(() => {
    return setCustomization(templates[selectedTemplate]);
  }, [selectedTemplate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: invoiceData?.currency,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "viewed":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderInvoicePreview = () => {
    const baseStyles = {
      fontFamily: customization.fontFamily,
      fontSize: `${customization.fontSize}px`,
      color:
        customization.layout === "minimal"
          ? "#000"
          : customization.secondaryColor,
    };

    const headerStyles = {
      color: customization.primaryColor,
      borderColor: customization.primaryColor,
    };

    return (
      <div
        className="bg-white p-8 shadow-lg min-h-[800px] max-w-4xl mx-auto"
        style={baseStyles}
      >
        {/* Header */}
        <div
          className={`flex ${
            customization.logoPosition === "center"
              ? "flex-col items-center"
              : customization.logoPosition === "right"
              ? "flex-row-reverse"
              : "flex-row"
          } justify-between items-start mb-8`}
        >
          {customization.showLogo && (
            <div className="mb-4">
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: customization.primaryColor }}
              >
                {customization.name.charAt(0)}
              </div>
            </div>
          )}

          <div
            className={`${
              customization.logoPosition === "center"
                ? "text-center"
                : customization.logoPosition === "right"
                ? "text-left"
                : "text-right"
            }`}
          >
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: customization.primaryColor }}
            >
              INVOICE
            </h1>
            {customization.showInvoiceNumber && (
              <p className="text-lg font-semibold">
                {invoiceData?.invoiceNumber}
              </p>
            )}
            <Badge
              className={`mt-2 ${getStatusColor(
                invoiceData?.status as string
              )}`}
            >
              {invoiceData?.status}
            </Badge>
          </div>
        </div>

        {/* Company & Client Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {customization.showCompanyAddress && (
            <div>
              <h3 className="font-semibold mb-3" style={headerStyles}>
                From:
              </h3>
              <div className="space-y-1">
                <p className="font-semibold">{selectedCompany?.name}</p>
                <p className="font-semibold">{selectedCompany.email}</p>
                <p>{selectedCompany.address.street}</p>
                <p>
                  {selectedCompany.address.city},{" "}
                  {selectedCompany.address.state}{" "}
                  {selectedCompany.address.zipCode}
                </p>
                <p>{selectedCompany.address.country}</p>
                <p>{selectedCompany.email}</p>
                <p>{selectedCompany.phone}</p>
                {selectedCompany.taxId && <p>{selectedCompany.taxId}</p>}
              </div>
            </div>
          )}

          {customization.showClientAddress && (
            <div>
              <h3
                className="font-semibold mb-3"
                style={{ color: customization.primaryColor }}
              >
                Bill To:
              </h3>
              <div className="space-y-1">
                <p className="font-semibold">{selectedClient.name}</p>
                <p>{selectedClient.email}</p>
                <p>{selectedClient.address.street}</p>
                <p>
                  {selectedClient.address.city}, {selectedClient.address.state}{" "}
                  {selectedClient.address.zipCode}
                </p>
                <p>{selectedClient.address.country}</p>
                <p>{selectedClient.email}</p>
                <p>{selectedClient.phone}</p>
              </div>
            </div>
          )}
        </div>

        {/* Invoice Details */}
        {customization.showDates && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div>
              <h4
                className="font-semibold mb-1"
                style={{ color: customization.primaryColor }}
              >
                Invoice Date:
              </h4>
              <p>{formatDate(new Date(invoiceData?.invoiceDate as string))}</p>
            </div>
            <div>
              <h4
                className="font-semibold mb-1"
                style={{ color: customization.primaryColor }}
              >
                Due Date:
              </h4>
              <p>{formatDate(new Date(invoiceData?.dueDate as string))}</p>
            </div>
            {customization.showPaymentTerms && (
              <div>
                <h4
                  className="font-semibold mb-1"
                  style={{ color: customization.primaryColor }}
                >
                  Payment Terms:
                </h4>
                <p>Net {invoiceData?.paymentTerms} days</p>
              </div>
            )}
          </div>
        )}

        {/* Items Table */}
        <div className="mb-8">
          <div className="border-b-2 pb-2 mb-4" style={headerStyles}>
            <div className="grid grid-cols-12 gap-4 font-semibold">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Rate</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>
          </div>

          {invoiceData?.items?.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-4 py-3 border-b border-gray-200"
            >
              <div className="col-span-6">{item.description}</div>
              <div className="col-span-2 text-center">{item.quantity}</div>
              <div className="col-span-2 text-right">
                {formatCurrency(item.rate)}
              </div>
              <div className="col-span-2 text-right font-semibold">
                {formatCurrency(item.amount)}
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal?:</span>
                <span>{calculations.subtotal}</span>
              </div>
              {invoiceData?.discountValue > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({invoiceData?.discountValue}%):</span>
                  <span>-{formatCurrency(calculations.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax ({invoiceData?.taxRate}%):</span>
                <span>{formatCurrency(calculations.taxAmount)}</span>
              </div>
              <Separator />
              <div
                className="flex justify-between text-xl font-bold border-t-2 pt-2"
                style={headerStyles}
              >
                <span>Total:</span>
                <span>{formatCurrency(calculations.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes & Terms */}
        {customization.showNotes && invoiceData?.notes && (
          <div className="mb-6">
            <h4
              className="font-semibold mb-2"
              style={{ color: customization.primaryColor }}
            >
              Notes:
            </h4>
            <p className="text-sm">{invoiceData.notes}</p>
          </div>
        )}

        {customization.showTerms && invoiceData?.terms && (
          <div>
            <h4
              className="font-semibold mb-2"
              style={{ color: customization.primaryColor }}
            >
              Terms & Conditions:
            </h4>
            <p className="text-sm">{invoiceData.terms}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoice Preview</h1>
          <p className="text-gray-600 mt-1">
            Customize your invoice template and see live changes
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() =>
              setPreviewMode(previewMode === "edit" ? "preview" : "edit")
            }
          >
            <Settings className="w-4 h-4 mr-2" />
            {previewMode === "edit" ? "Preview" : "Customize"}
          </Button>
          <Button variant="outline">
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </Button>
          <Button
            variant="outline"
            onClick={previewPDF}
            disabled={isGenerating}
          >
            <Eye className="w-4 h-4 mr-2" />
            {isGenerating ? "Generating..." : "Preview PDF"}
          </Button>
          <Button
            variant="outline"
            onClick={() => downloadPDF}
            disabled={isGenerating}
          >
            <Download className="w-4 h-4 mr-2" />
            <Eye className="w-4 h-4 mr-2" />
            {isGenerating ? "Generating..." : "Download PDF"}
          </Button>
          <Button>
            <Send className="w-4 h-4 mr-2" />
            Send Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Template Selection & Customization */}
        {previewMode === "edit" && (
          <div className="lg:col-span-1 space-y-4">
            {/* Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="w-5 h-5" />
                  Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(templates).map(([key, template]) => (
                  <div
                    key={key}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedTemplate === key
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() =>
                      setSelectedTemplate(key as keyof typeof templates)
                    }
                  >
                    <h4 className="font-semibold">{template.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {template.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Color Customization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Colors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={customization.primaryColor}
                      onChange={(e) =>
                        setCustomization((prev) => ({
                          ...prev,
                          primaryColor: e.target.value,
                        }))
                      }
                      className="w-12 h-10 border rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customization.primaryColor}
                      onChange={(e) =>
                        setCustomization((prev) => ({
                          ...prev,
                          primaryColor: e.target.value,
                        }))
                      }
                      className="flex-1 px-3 py-2 border rounded text-sm"
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Secondary Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={customization.secondaryColor}
                      onChange={(e) =>
                        setCustomization((prev) => ({
                          ...prev,
                          secondaryColor: e.target.value,
                        }))
                      }
                      className="w-12 h-10 border rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customization.secondaryColor}
                      onChange={(e) =>
                        setCustomization((prev) => ({
                          ...prev,
                          secondaryColor: e.target.value,
                        }))
                      }
                      className="flex-1 px-3 py-2 border rounded text-sm"
                      placeholder="#1e40af"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Display Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Display Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { key: "showLogo", label: "Show Logo" },
                  { key: "showCompanyAddress", label: "Company Address" },
                  { key: "showClientAddress", label: "Client Address" },
                  { key: "showInvoiceNumber", label: "Invoice Number" },
                  { key: "showDates", label: "Dates" },
                  { key: "showPaymentTerms", label: "Payment Terms" },
                  { key: "showNotes", label: "Notes" },
                  { key: "showTerms", label: "Terms & Conditions" },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={
                        customization[
                          key as keyof typeof customization
                        ] as boolean
                      }
                      onChange={(e) =>
                        setCustomization((prev) => ({
                          ...prev,
                          [key]: e.target.checked,
                        }))
                      }
                      className="rounded"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Preview Area */}
        <div
          className={previewMode === "edit" ? "lg:col-span-3" : "lg:col-span-4"}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gray-50 p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    Invoice Preview - {templates[selectedTemplate].name}{" "}
                    Template
                  </span>
                  <div className="w-20"></div>
                </div>
              </div>

              <div className="bg-gray-100 p-6 min-h-screen">
                {renderInvoicePreview()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
