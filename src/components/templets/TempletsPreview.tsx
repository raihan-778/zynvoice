// components/templates/TemplatePreview.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Eye, Palette } from "lucide-react";
import { useState } from "react";
import { InvoiceFullPreview } from "./InvoiceFullPreview";

interface TemplatePreviewProps {
  template: {
    _id: string;
    name: string;
    description: string;
    previewImage: string;
    styles: {
      primaryColor: string;
      secondaryColor: string;
      fontFamily: string;
      layout: "modern" | "classic" | "minimal" | "corporate";
    };
  };
  isSelected?: boolean;
  onSelect?: (templateId: string) => void;
}

export function TemplatePreview({
  template,
  isSelected,
  onSelect,
}: TemplatePreviewProps) {
  const [isHovered, setIsHovered] = useState(false);

  const mockInvoiceData = {
    invoiceNumber: "INV-2025-001",
    date: "2025-06-28",
    dueDate: "2025-07-28",
    company: {
      name: "Your Company",
      address: "123 Business Street\nCity, State 12345",
      email: "hello@company.com",
      phone: "+1 (555) 123-4567",
    },
    client: {
      name: "Client Name",
      address: "456 Client Ave\nClient City, State 67890",
      email: "client@email.com",
    },
    items: [
      {
        description: "Web Design Services",
        quantity: 1,
        rate: 2500,
        amount: 2500,
      },
      {
        description: "Development Hours",
        quantity: 40,
        rate: 75,
        amount: 3000,
      },
    ],
    subtotal: 5500,
    tax: 495,
    total: 5995,
  };

  const getLayoutStyles = () => {
    const { layout, primaryColor, secondaryColor, fontFamily } =
      template.styles;

    const baseStyles = {
      fontFamily:
        fontFamily === "Inter"
          ? "Inter, sans-serif"
          : fontFamily === "Roboto"
          ? "Roboto, sans-serif"
          : "Arial, sans-serif",
      "--primary-color": primaryColor,
      "--secondary-color": secondaryColor,
    } as React.CSSProperties;

    switch (layout) {
      case "modern":
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${primaryColor}15, ${secondaryColor}15)`,
        };
      case "classic":
        return {
          ...baseStyles,
          background: "#fff",
          border: `2px solid ${primaryColor}`,
        };
      case "minimal":
        return {
          ...baseStyles,
          background: "#fff",
          borderLeft: `4px solid ${primaryColor}`,
        };
      case "corporate":
        return {
          ...baseStyles,
          background: "#fff",
          borderTop: `8px solid ${primaryColor}`,
        };
      default:
        return baseStyles;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: isSelected ? 1.02 : 1.05 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className={`relative overflow-hidden cursor-pointer transition-all duration-200 ${
          isSelected ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"
        }`}
        onClick={() => onSelect?.(template._id)}
      >
        {isSelected && (
          <Badge className="absolute top-2 right-2 z-10">Selected</Badge>
        )}

        <div className="aspect-[3/4] relative p-4" style={getLayoutStyles()}>
          {/* Invoice Preview */}
          <div className="h-full text-xs space-y-2 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3
                  className="font-bold text-sm"
                  style={{ color: "var(--primary-color)" }}
                >
                  {mockInvoiceData.company.name}
                </h3>
                <p className="text-xs opacity-75 whitespace-pre-line">
                  {mockInvoiceData.company.address}
                </p>
              </div>
              <div
                className="text-right"
                style={{ color: "var(--primary-color)" }}
              >
                <h4 className="font-bold">INVOICE</h4>
                <p className="text-xs">{mockInvoiceData.invoiceNumber}</p>
              </div>
            </div>

            {/* Client Info */}
            <div className="pt-2">
              <p className="font-semibold text-xs">Bill To:</p>
              <p className="text-xs">{mockInvoiceData.client.name}</p>
              <p className="text-xs opacity-75 whitespace-pre-line">
                {mockInvoiceData.client.address}
              </p>
            </div>

            {/* Items Table */}
            <div className="pt-2">
              <div
                className="text-xs font-semibold p-1 rounded-t"
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "white",
                }}
              >
                <div className="grid grid-cols-12 gap-1">
                  <div className="col-span-6">Description</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-2 text-right">Rate</div>
                  <div className="col-span-2 text-right">Amount</div>
                </div>
              </div>

              {mockInvoiceData.items.map((item, index) => (
                <div
                  key={index}
                  className="text-xs p-1 border-b border-opacity-20"
                >
                  <div className="grid grid-cols-12 gap-1">
                    <div className="col-span-6 truncate">
                      {item.description}
                    </div>
                    <div className="col-span-2 text-center">
                      {item.quantity}
                    </div>
                    <div className="col-span-2 text-right">${item.rate}</div>
                    <div className="col-span-2 text-right">${item.amount}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="pt-2 text-right space-y-1">
              <div className="flex justify-between text-xs">
                <span>Subtotal:</span>
                <span>${mockInvoiceData.subtotal}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Tax:</span>
                <span>${mockInvoiceData.tax}</span>
              </div>
              <div
                className="flex justify-between font-bold text-sm p-1 rounded"
                style={{
                  backgroundColor: "var(--secondary-color)",
                  color: "white",
                }}
              >
                <span>Total:</span>
                <span>${mockInvoiceData.total}</span>
              </div>
            </div>
          </div>

          {/* Hover Overlay */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
            >
              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>
                        Template Preview - {template.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div
                      className="aspect-[8.5/11] bg-white p-8"
                      style={getLayoutStyles()}
                    >
                      {/* Full Invoice Preview */}
                      <InvoiceFullPreview
                        template={template}
                        data={mockInvoiceData}
                      />
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="secondary" size="sm">
                  <Palette className="h-4 w-4 mr-1" />
                  Customize
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-sm">{template.name}</h4>
              <p className="text-xs text-muted-foreground">
                {template.description}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <div
                className="w-3 h-3 rounded-full border"
                style={{ backgroundColor: template.styles.primaryColor }}
              />
              <div
                className="w-3 h-3 rounded-full border"
                style={{ backgroundColor: template.styles.secondaryColor }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <Badge variant="outline" className="text-xs">
              {template.styles.layout}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {template.styles.fontFamily}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
