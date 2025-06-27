// 📁 src/components/forms/template-picker.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Check } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  color: string;
  features: string[];
}

interface TemplatePickerProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
}

const templates: InvoiceTemplate[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and minimalist design with blue accents",
    preview: "/templates/modern-preview.png",
    color: "bg-blue-500",
    features: ["Clean Layout", "Professional", "Blue Theme"],
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional business invoice with formal styling",
    preview: "/templates/classic-preview.png",
    color: "bg-gray-600",
    features: ["Traditional", "Formal", "Black & White"],
  },
  {
    id: "colorful",
    name: "Colorful",
    description: "Vibrant design with gradient backgrounds",
    preview: "/templates/colorful-preview.png",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    features: ["Vibrant", "Gradient", "Creative"],
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Ultra-clean design with lots of white space",
    preview: "/templates/minimal-preview.png",
    color: "bg-green-500",
    features: ["Minimal", "Clean", "Simple"],
  },
];

export function TemplatePicker({
  selectedTemplate,
  onTemplateChange,
}: TemplatePickerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Choose Template
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <Card
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedTemplate === template.id
                    ? "ring-2 ring-primary shadow-lg"
                    : "hover:shadow-md"
                }`}
                onClick={() => onTemplateChange(template.id)}
              >
                {/* Template Preview */}
                <div className="relative h-32 overflow-hidden rounded-t-lg">
                  <div
                    className={`w-full h-full ${template.color} opacity-20`}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-20 bg-white rounded shadow-sm mx-auto mb-2 flex items-center justify-center">
                        <div className="space-y-1">
                          <div className="h-2 bg-gray-300 rounded w-10" />
                          <div className="h-1 bg-gray-200 rounded w-8" />
                          <div className="h-1 bg-gray-200 rounded w-12" />
                          <div className="h-1 bg-gray-200 rounded w-6" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {selectedTemplate === template.id && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                <CardContent className="p-3">
                  <h3 className="font-semibold text-sm mb-1">
                    {template.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {template.features.map((feature) => (
                      <Badge
                        key={feature}
                        variant="secondary"
                        className="text-xs px-1.5 py-0.5"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
