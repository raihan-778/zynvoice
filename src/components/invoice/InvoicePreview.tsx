// 📁 src/components/invoice/invoice-preview.tsx
"use client";

import { forwardRef } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ClientInfo,
  CompanyInfo,
  InvoiceFormData,
} from "@/lib/validations/validation";

import Image from "next/image";

interface InvoicePreviewProps {
  data: InvoiceFormData;
  companyInfo: CompanyInfo;
  clientInfo: ClientInfo;
  invoiceNumber?: string;
  className?: string;
  // Removed unused props: invoice and template
}

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  (
    { data, companyInfo, clientInfo, invoiceNumber = "INV-001", className },
    ref
  ) => {
    const calculateSubtotal = () => {
      return data.items.reduce(
        (sum: number, item: { quantity: number; rate: number }) =>
          sum + item.quantity * item.rate,
        0
      );
    };

    const calculateDiscount = () => {
      const subtotal = calculateSubtotal();
      if (data.discountType === "percentage") {
        return (subtotal * data.discountValue) / 100;
      }
      return data.discountValue;
    };

    const calculateTax = () => {
      const subtotal = calculateSubtotal();
      const discount = calculateDiscount();
      return ((subtotal - discount) * data.taxRate) / 100;
    };

    const calculateTotal = () => {
      const subtotal = calculateSubtotal();
      const discount = calculateDiscount();
      const tax = calculateTax();
      return subtotal - discount + tax;
    };

    return (
      <Card ref={ref} className={`max-w-4xl mx-auto bg-white ${className}`}>
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-start space-x-4">
              {companyInfo?.logo && (
                <div className="w-20 h-20 relative">
                  <Image
                    src={companyInfo.logo}
                    alt="Company Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {companyInfo?.name || "Your Company"}
                </h1>
                <div className="text-sm text-gray-600 space-y-1">
                  {companyInfo?.address && <div>{companyInfo.address}</div>}
                  {companyInfo?.contact?.phone && (
                    <div>Phone: {companyInfo.contact.phone}</div>
                  )}
                  {companyInfo?.contact?.email && (
                    <div>Email: {companyInfo.contact.email}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-4xl font-bold text-blue-600 mb-2">INVOICE</h2>
              <p className="text-gray-600">#{invoiceNumber}</p>
            </div>
          </div>

          {/* Bill To & Dates */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Bill To
              </h3>
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-gray-900">
                  {clientInfo?.name || "Client Name"}
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  {clientInfo?.email && <div>{clientInfo.email}</div>}
                  {clientInfo?.phone && <div>{clientInfo.phone}</div>}
                  {clientInfo?.address && (
                    <div>
                      {clientInfo.address.street}, {clientInfo.address.city},{" "}
                      {clientInfo.address.state} {clientInfo.address.zipCode},{" "}
                      {clientInfo.address.country}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Issue Date:</span>
                  <span className="font-semibold">
                    {formatDate(data.dates.issued)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Date:</span>
                  <span className="font-semibold">
                    {formatDate(data.dates.due)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <div className="bg-gray-50 px-4 py-3 grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700 uppercase tracking-wide">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Rate</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>
            {data.items.map((item, index) => (
              <div
                key={index}
                className="px-4 py-4 grid grid-cols-12 gap-4 border-b border-gray-200"
              >
                <div className="col-span-6 text-gray-900">
                  {item.description}
                </div>
                <div className="col-span-2 text-center text-gray-600">
                  {item.quantity}
                </div>
                <div className="col-span-2 text-right text-gray-600">
                  {formatCurrency(item.rate, data.currency)}
                </div>
                <div className="col-span-2 text-right font-semibold text-gray-900">
                  {formatCurrency(item.quantity * item.rate, data.currency)}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-80 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>
                  {formatCurrency(calculateSubtotal(), data.currency)}
                </span>
              </div>
              {data.discountValue > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>
                    Discount (
                    {data.discountType === "percentage"
                      ? `${data.discountValue}%`
                      : "Fixed"}
                    ):
                  </span>
                  <span>
                    -{formatCurrency(calculateDiscount(), data.currency)}
                  </span>
                </div>
              )}
              {data.taxRate > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Tax ({data.taxRate}%):</span>
                  <span>{formatCurrency(calculateTax(), data.currency)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total:</span>
                <span className="text-blue-600">
                  {formatCurrency(calculateTotal(), data.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {(data.notes || data.terms || data.paymentInstructions) && (
            <div className="mt-12 pt-8 border-t border-gray-200 space-y-6">
              {data.notes && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                    Notes
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {data.notes}
                  </p>
                </div>
              )}
              {data.terms && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                    Terms & Conditions
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {data.terms}
                  </p>
                </div>
              )}
              {data.paymentInstructions && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                    Payment Instructions
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {data.paymentInstructions}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
            Thank you for your business! • Generated on {formatDate(new Date())}
          </div>
        </CardContent>
      </Card>
    );
  }
);

InvoicePreview.displayName = "InvoicePreview";
