// components/invoice/InvoiceGenerator.tsx
"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import { InvoiceForm } from "./InvoiceForm";
import { InvoicePreview } from "./InvoicePreview";

import { Button } from "@/components/ui/button";
import { useInvoiceForm } from "@/hooks/UseInvoiceForm";
import { Eye, EyeOff, Split } from "lucide-react";

type ViewMode = "form" | "preview" | "split";

export const InvoiceGenerator: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("form");
  const { invoice } = useInvoiceForm();

  const renderContent = () => {
    switch (viewMode) {
      case "form":
        return <InvoiceForm />;
      case "preview":
        return (
          <div className="max-w-4xl mx-auto p-6">
            <InvoicePreview invoice={invoice} />
          </div>
        );
      case "split":
        return (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 p-6">
            <div className="order-2 xl:order-1">
              <InvoiceForm />
            </div>
            <div className="order-1 xl:order-2 sticky top-6">
              <InvoicePreview invoice={invoice} />
            </div>
          </div>
        );
      default:
        return <InvoiceForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* View Mode Toggle */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Invoice Generator
            </h1>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "form" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("form")}
                className="flex items-center gap-2"
              >
                <EyeOff className="h-4 w-4" />
                Form
              </Button>
              <Button
                variant={viewMode === "preview" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("preview")}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button
                variant={viewMode === "split" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("split")}
                className="flex items-center gap-2"
              >
                <Split className="h-4 w-4" />
                Split
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        key={viewMode}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="pb-8"
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};
