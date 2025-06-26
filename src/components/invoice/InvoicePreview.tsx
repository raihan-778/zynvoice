// components/invoice/InvoicePreview.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Invoice } from "@/types/invoice";
import { motion } from "framer-motion";
import React from "react";

interface InvoicePreviewProps {
  invoice: Invoice;
  template?: string;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoice,
  template = "modern",
}) => {
  const getTemplateStyles = (template: string) => {
    switch (template) {
      case "modern":
        return {
          primary: "#3B82F6",
          secondary: "#1E40AF",
          accent: "#EFF6FF",
          text: "#1F2937",
        };
      case "classic":
        return {
          primary: "#374151",
          secondary: "#111827",
          accent: "#F9FAFB",
          text: "#374151",
        };
      case "minimal":
        return {
          primary: "#10B981",
          secondary: "#059669",
          accent: "#ECFDF5",
          text: "#1F2937",
        };
      case "elegant":
        return {
          primary: "#7C3AED",
          secondary: "#5B21B6",
          accent: "#F3E8FF",
          text: "#1F2937",
        };
      default:
        return {
          primary: "#3B82F6",
          secondary: "#1E40AF",
          accent: "#EFF6FF",
          text: "#1F2937",
        };
    }
  };

  const styles = getTemplateStyles(template);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="shadow-lg">
        <CardContent className="p-8">
          <div
            className="min-h-[800px] bg-white"
            style={{ color: styles.text }}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                {invoice.company.logo && (
                  <img
                    src={invoice.company.logo}
                    alt="Company Logo"
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <h1
                    className="text-2xl font-bold"
                    style={{ color: styles.primary }}
                  >
                    {invoice.company.name}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {invoice.company.address}
                  </p>
                  <p className="text-sm text-gray-600">
                    {invoice.company.phone} • {invoice.company.email}
                  </p>
                  {invoice.company.website && (
                    <p className="text-sm text-gray-600">
                      {invoice.company.website}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <h2
                  className="text-3xl font-bold"
                  style={{ color: styles.primary }}
                >
                  INVOICE
                </h2>
                <p className="text-sm text-gray-600">{invoice.invoiceNumber}</p>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3
                  className="font-semibold mb-2"
                  style={{ color: styles.secondary }}
                >
                  Bill To:
                </h3>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{invoice.client.name}</p>
                  <p>{invoice.client.address}</p>
                  <p>{invoice.client.phone}</p>
                  <p>{invoice.client.email}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">Invoice Date:</span>
                    <span>{new Date(invoice.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Due Date:</span>
                    <span>
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <div
                className="grid grid-cols-4 gap-4 p-3 font-semibold text-white text-sm"
                style={{ backgroundColor: styles.primary }}
              >
                <div>Description</div>
                <div className="text-center">Quantity</div>
                <div className="text-center">Rate</div>
                <div className="text-right">Amount</div>
              </div>
              {invoice.items.map((item, index) => (
                <div
                  key={item.id}
                  className={`grid grid-cols-4 gap-4 p-3 text-sm border-b ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <div>{item.description}</div>
                  <div className="text-center">{item.quantity}</div>
                  <div className="text-center">${item.rate.toFixed(2)}</div>
                  <div className="text-right font-medium">
                    ${item.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (10%):</span>
                  <span>${invoice.tax.toFixed(2)}</span>
                </div>
                <div
                  className="flex justify-between text-lg font-bold p-3 text-white"
                  style={{ backgroundColor: styles.primary }}
                >
                  <span>Total:</span>
                  <span>${invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-8">
                <h3
                  className="font-semibold mb-2"
                  style={{ color: styles.secondary }}
                >
                  Notes:
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {invoice.notes}
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 border-t pt-4">
              <p>Thank you for your business!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
