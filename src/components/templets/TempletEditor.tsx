// components/templates/TemplateEditor.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
// import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { Eye, Layout, Palette, Save, Type } from "lucide-react";
import { toast } from "sonner";

interface TemplateEditorProps {
  templateId?: string;
  onSave?: (template: unknown) => void;
  onCancel?: () => void;
}

interface TemplateData {
  name: string;
  description: string;
  styles: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    layout: "modern" | "classic" | "minimal" | "corporate";
  };
}

export function TemplateEditor({
  templateId,
  onSave,
  onCancel,
}: TemplateEditorProps) {
  const [templateData, setTemplateData] = useState<TemplateData>({
    name: "",
    description: "",
    styles: {
      primaryColor: "#3b82f6",
      secondaryColor: "#1e40af",
      fontFamily: "Inter",
      layout: "modern",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const loadTemplate = useCallback(async () => {
    if (!templateId) return;

    try {
      const response = await fetch(`/api/templates/${templateId}`);
      if (response.ok) {
        const data = await response.json();
        setTemplateData(data);
      }
    } catch (error) {
      console.error("Failed to load template:", error);
    }
  }, [templateId]);

  useEffect(() => {
    loadTemplate();
  }, [loadTemplate]);

  const handleSave = async () => {
    if (!templateData.name.trim()) {
      toast("Error", {
        description: `Template name is required`,
      });
      return;
    }

    setIsLoading(true);
    try {
      const url = templateId
        ? `/api/templates/${templateId}`
        : "/api/templates";
      const method = templateId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateData),
      });

      if (response.ok) {
        const savedTemplate = await response.json();
        toast("Success", {
          description: `Template ${
            templateId ? "updated" : "created"
          } successfully`,
        });
        onSave?.(savedTemplate);
      } else {
        throw new Error("Failed to save template");
      }
    } catch (error) {
      toast("Error", {
        description: `Failed to ${
          templateId ? "update" : "create"
        } template  ${error}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateTemplateData = (field: string, value: unknown) => {
    if (field.startsWith("styles.")) {
      const styleField = field.replace("styles.", "");
      setTemplateData((prev) => ({
        ...prev,
        styles: {
          ...prev.styles,
          [styleField]: value,
        },
      }));
    } else {
      setTemplateData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const colorPresets = [
    { name: "Blue", primary: "#3b82f6", secondary: "#1e40af" },
    { name: "Green", primary: "#10b981", secondary: "#059669" },
    { name: "Purple", primary: "#8b5cf6", secondary: "#7c3aed" },
    { name: "Red", primary: "#ef4444", secondary: "#dc2626" },
    { name: "Orange", primary: "#f59e0b", secondary: "#d97706" },
    { name: "Pink", primary: "#ec4899", secondary: "#db2777" },
    { name: "Indigo", primary: "#6366f1", secondary: "#4f46e5" },
    { name: "Gray", primary: "#6b7280", secondary: "#4b5563" },
  ];

  const fontOptions = [
    { value: "Inter", label: "Inter (Modern)" },
    { value: "Roboto", label: "Roboto (Clean)" },
    { value: "Arial", label: "Arial (Classic)" },
    { value: "Times New Roman", label: "Times New Roman (Traditional)" },
    { value: "Helvetica", label: "Helvetica (Professional)" },
  ];

  const layoutOptions = [
    {
      value: "modern",
      label: "Modern",
      description: "Clean lines with gradients",
    },
    {
      value: "classic",
      label: "Classic",
      description: "Traditional bordered layout",
    },
    { value: "minimal", label: "Minimal", description: "Simple and clean" },
    {
      value: "corporate",
      label: "Corporate",
      description: "Professional business style",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Editor Panel */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Type className="h-5 w-5 mr-2" />
              Template Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="templateName">Template Name</Label>
              <Input
                id="templateName"
                value={templateData.name}
                onChange={(e) => updateTemplateData("name", e.target.value)}
                placeholder="Enter template name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="templateDescription">Description</Label>
              <Textarea
                id="templateDescription"
                value={templateData.description}
                onChange={(e) =>
                  updateTemplateData("description", e.target.value)
                }
                placeholder="Describe this template..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Color Scheme
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Color Presets */}
            <div>
              <Label className="text-sm font-medium">Quick Presets</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {colorPresets.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    className="h-12 p-2"
                    onClick={() => {
                      updateTemplateData("styles.primaryColor", preset.primary);
                      updateTemplateData(
                        "styles.secondaryColor",
                        preset.secondary
                      );
                    }}
                  >
                    <div className="flex space-x-1">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: preset.secondary }}
                      />
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Custom Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={templateData.styles.primaryColor}
                    onChange={(e) =>
                      updateTemplateData("styles.primaryColor", e.target.value)
                    }
                    className="w-16 h-10 p-1 rounded"
                  />
                  <Input
                    value={templateData.styles.primaryColor}
                    onChange={(e) =>
                      updateTemplateData("styles.primaryColor", e.target.value)
                    }
                    placeholder="#3b82f6"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={templateData.styles.secondaryColor}
                    onChange={(e) =>
                      updateTemplateData(
                        "styles.secondaryColor",
                        e.target.value
                      )
                    }
                    className="w-16 h-10 p-1 rounded"
                  />
                  <Input
                    value={templateData.styles.secondaryColor}
                    onChange={(e) =>
                      updateTemplateData(
                        "styles.secondaryColor",
                        e.target.value
                      )
                    }
                    placeholder="#1e40af"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Layout className="h-5 w-5 mr-2" />
              Layout & Typography
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select
                value={templateData.styles.fontFamily}
                onValueChange={(value) =>
                  updateTemplateData("styles.fontFamily", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Layout Style</Label>
              <div className="grid grid-cols-1 gap-2">
                {layoutOptions.map((layout) => (
                  <Card
                    key={layout.value}
                    className={`cursor-pointer transition-all ${
                      templateData.styles.layout === layout.value
                        ? "ring-2 ring-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() =>
                      updateTemplateData("styles.layout", layout.value)
                    }
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{layout.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {layout.description}
                          </p>
                        </div>
                        <div className="w-3 h-3 rounded-full border-2 border-primary">
                          {templateData.styles.layout === layout.value && (
                            <div className="w-full h-full rounded-full bg-primary" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>

          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? "Edit" : "Preview"}
            </Button>

            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save Template"}
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="lg:sticky lg:top-6">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-[8.5/11] border rounded-lg overflow-hidden">
              <TemplatePreviewRenderer template={templateData} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Template Preview Renderer Component
interface TemplatePreviewRendererProps {
  template: TemplateData;
}

function TemplatePreviewRenderer({ template }: TemplatePreviewRendererProps) {
  const mockData = {
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
      name: "Sample Client",
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
      fontFamily: fontFamily,
      "--primary-color": primaryColor,
      "--secondary-color": secondaryColor,
    } as React.CSSProperties;

    switch (layout) {
      case "modern":
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10)`,
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
    <div
      className="h-full p-4 text-xs overflow-hidden"
      style={getLayoutStyles()}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1
            className="text-lg font-bold"
            style={{ color: "var(--primary-color)" }}
          >
            {mockData.company.name}
          </h1>
          <div className="text-xs text-gray-600 whitespace-pre-line">
            {mockData.company.address}
          </div>
        </div>

        <div className="text-right">
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--primary-color)" }}
          >
            INVOICE
          </h2>
          <div className="text-xs">
            <p>{mockData.invoiceNumber}</p>
            <p>{mockData.date}</p>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-4">
        <h3
          className="font-semibold text-sm mb-1"
          style={{ color: "var(--primary-color)" }}
        >
          Bill To:
        </h3>
        <div className="text-xs">
          <p className="font-medium">{mockData.client.name}</p>
          <div className="text-gray-600 whitespace-pre-line">
            {mockData.client.address}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mb-4">
        <div
          className="text-xs font-semibold p-2 text-white rounded-t"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <div className="grid grid-cols-12 gap-1">
            <div className="col-span-6">Description</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-2 text-right">Rate</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>
        </div>

        {mockData.items.map((item, index) => (
          <div key={index} className="text-xs p-2 border-b">
            <div className="grid grid-cols-12 gap-1">
              <div className="col-span-6 truncate">{item.description}</div>
              <div className="col-span-2 text-center">{item.quantity}</div>
              <div className="col-span-2 text-right">${item.rate}</div>
              <div className="col-span-2 text-right">${item.amount}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="text-right space-y-1">
        <div className="flex justify-between text-xs">
          <span>Subtotal:</span>
          <span>${mockData.subtotal}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>Tax:</span>
          <span>${mockData.tax}</span>
        </div>
        <div
          className="flex justify-between font-bold text-sm p-2 text-white rounded"
          style={{ backgroundColor: "var(--secondary-color)" }}
        >
          <span>Total:</span>
          <span>${mockData.total}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-2 border-t border-gray-200 text-center text-xs text-gray-500">
        <p>Thank you for your business!</p>
        <p className="mt-1">
          Questions? Contact us at {mockData.company.email}
        </p>
      </div>
    </div>
  );
}
