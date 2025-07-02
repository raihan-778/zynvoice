// 7. MAIN INVOICE FORM COMPONENT
// ==========================================

// components/invoice/InvoiceForm.tsx
"use client";

import { useInvoiceForm } from "@/hooks/UseInvoiceForm";
import { motion } from "framer-motion";
import React, { useState } from "react";

import { ClientDetailsForm } from "./ClientDetailsForm";
import { ServiceItemsForm } from "./ServiceItemsForm";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";

import { CompanyDetailsForm } from "./ComponyDetailsForm";
import { InvoiceActions } from "./InvoiceActions";

export const InvoiceForm: React.FC = () => {
  const {
    formData,
    errors,
    isSubmitting,
    companies,
    clients,
    clientSearch,
    setClientSearch,
    updateFormData,
    updateItem,
    addItem,
    removeItem,
    validateForm,
    submitForm,
    resetForm,
    generateInvoiceNumber,
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
                      value={formData.invoiceNumber}
                      onChange={(e) =>
                        setInvoice((prev: any) => ({
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
                      value={
                        formData?.dueDate?.instanceof Date
                          ? invoice.dates.issued.toISOString().slice(0, 10)
                          : invoice.dates.issued || ""
                      }
                      onChange={(e) =>
                        setInvoice((prev: any) => ({
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
                      value={
                        invoice.dates.due instanceof Date
                          ? invoice.dates.due.toISOString().slice(0, 10)
                          : invoice.dates.due || ""
                      }
                      onChange={(e) =>
                        setInvoice((prev: any) => ({
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
                      setInvoice((prev: any) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
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
            company={
              invoice?.companyInfo ?? {
                name: "",
                logo: "",
                address: "",
                contact: { phone: "", email: "" },
              }
            }
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
            subtotal={invoice?.subtotal ?? 0}
            tax={invoice?.tax ?? 0}
            total={invoice?.total ?? 0}
          />
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          <InvoiceActions
            selectedTemplate={invoice.template ?? ""}
            onTemplateChange={(template) =>
              setInvoice((prev: any) => ({ ...prev, template }))
            }
            onGenerateInvoice={handleGenerateInvoice}
            onDownloadPDF={handleDownloadPDF}
            onDownloadImage={handleDownloadImage}
            onSendEmail={handleSendEmail}
            isGenerating={isGenerating}
            isDownloading={isDownloading}
            isSending={isSending}
            invoice={invoice}
          />
        </div>
      </div>
    </div>
  );
};
