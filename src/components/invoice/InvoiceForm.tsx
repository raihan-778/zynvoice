// 7. MAIN INVOICE FORM COMPONENT
// ==========================================

// components/invoice/InvoiceForm.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInvoiceForm } from "@/hooks/UseInvoiceForm";

import { ClientDetailsForm } from "./ClientDetailsForm";
import { ServiceItemsForm } from "./ServiceItemsForm";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, FileText } from "lucide-react";

import { InvoiceActions } from "./InvoiceActions";


export const InvoiceForm: React.FC = () => {
  const {
    invoice,
    updateCompany,
    updateClient,
    updateItem,
    addItem,
    removeItem,
    setInvoice,
  } = useInvoiceForm();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleGenerateInvoice = async () => {
    setIsGenerating(true);
    try {
      // TODO: Implement invoice generation logic
      console.log("Generating invoice...", invoice);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
    } catch (error) {
      console.error("Error generating invoice:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      // TODO: Implement PDF download logic
      console.log("Downloading PDF...");
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error) {
      console.error("Error downloading PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadImage = async () => {
    setIsDownloading(true);
    try {
      // TODO: Implement image download logic
      console.log("Downloading image...");
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error) {
      console.error("Error downloading image:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    try {
      // TODO: Implement email sending logic
      console.log("Sending email...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-3xl font-bold text-gray-900">Invoice Generator</h1>
        <p className="text-gray-600">Create professional invoices in minutes</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Invoice Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Invoice Number</Label>
                    <Input
                      value={invoice.invoiceNumber}
                      onChange={(e) =>
                        setInvoice((prev) => ({
                          ...prev,
                          invoiceNumber: e.target.value,
                        }))
                      }
                      placeholder="INV-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={invoice.date}
                      onChange={(e) =>
                        setInvoice((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={invoice.dueDate}
                      onChange={(e) =>
                        setInvoice((prev) => ({
                          ...prev,
                          dueDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Textarea
                    value={invoice.notes || ""}
                    onChange={(e) =>
                      setInvoice((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    placeholder="Additional notes or terms..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Company Details */}
          <CompanyDetailsForm
            company={invoice.company}
            onUpdate={updateCompany}
          />

          {/* Client Details */}
          <ClientDetailsForm client={invoice.client} onUpdate={updateClient} />

          {/* Service Items */}
          <ServiceItemsForm
            items={invoice.items}
            onUpdateItem={updateItem}
            onAddItem={addItem}
            onRemoveItem={removeItem}
            subtotal={invoice.subtotal}
            tax={invoice.tax}
            total={invoice.total}
          />
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          <InvoiceActions
            selectedTemplate={invoice.template}
            onTemplateChange={(template) =>
              setInvoice((prev) => ({ ...prev, template }))
            }
            onGenerateInvoice={handleGenerateInvoice}
            onDownloadPDF={handleDownloadPDF}
            onDownloadImage={handleDownloadImage}
            onSendEmail={handleSendEmail}
            isGenerating={isGenerating}
            isDownloading={isDownloading}
            isSending={isSending}
          />
        </div>
      </div>
    </div>
  );
};
