// 8. ENHANCED INVOICE FORM WITH ANIMATIONS
// ===========================================

// components/forms/AnimatedInvoiceForm.tsx
"use client";

import { AnimatedButton } from "@/components/animations/AnimatedButton";
import { AnimatedCard } from "@/components/animations/AnimatedCard";
import { AnimatedContainer } from "@/components/animations/AnimatedContainer";
import { AnimatedFormField } from "@/components/animations/AnimatedFormField";
import { ProgressBar } from "@/components/animations/ProgressBar";
import { StatusMessage } from "@/components/animations/StatusMessage";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "framer-motion";
import { Calculator, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface ServiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export function AnimatedInvoiceForm() {
  const [services, setServices] = useState<ServiceItem[]>([
    { id: "1", description: "", quantity: 1, rate: 0, amount: 0 },
  ]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  // Calculate form completion progress
  const calculateProgress = () => {
    const completed = 0;
    const totalFields = 6; // Adjust based on your form fields

    // Add your progress calculation logic here
    return (completed / totalFields) * 100;
  };

  const addService = () => {
    const newService: ServiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    setServices([...services, newService]);
  };

  const removeService = (id: string) => {
    setServices(services.filter((service) => service.id !== id));
  };

  const updateService = (
    id: string,
    field: keyof ServiceItem,
    value: string | number
  ) => {
    setServices(
      services.map((service) => {
        if (service.id === id) {
          const updated = { ...service, [field]: value };
          if (field === "quantity" || field === "rate") {
            updated.amount = updated.quantity * updated.rate;
          }
          return updated;
        }
        return service;
      })
    );
  };

  const totalAmount = services.reduce(
    (sum, service) => sum + service.amount,
    0
  );

  const handleGenerate = async () => {
    setIsGenerating(true);

    // Simulate generation process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsGenerating(false);
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <AnimatedContainer
      variant="slideUp"
      className="max-w-4xl mx-auto p-6 space-y-8"
    >
      {/* Progress Bar */}
      <ProgressBar progress={formProgress} />

      {/* Status Messages */}
      <StatusMessage
        type="success"
        message="Invoice generated successfully!"
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
      />

      {/* Company Information */}
      <AnimatedCard delay={0.1}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            >
              🏢
            </motion.div>
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <AnimatedFormField label="Company Name" delay={0.2}>
            <Input placeholder="Your Company Name" />
          </AnimatedFormField>

          <AnimatedFormField label="Email" delay={0.3}>
            <Input type="email" placeholder="company@example.com" />
          </AnimatedFormField>

          <AnimatedFormField label="Phone" delay={0.4} className="col-span-2">
            <Input placeholder="+1 (555) 123-4567" />
          </AnimatedFormField>

          <AnimatedFormField label="Address" delay={0.5} className="col-span-2">
            <Textarea placeholder="Company Address" rows={3} />
          </AnimatedFormField>
        </CardContent>
      </AnimatedCard>

      {/* Client Information */}
      <AnimatedCard delay={0.2}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            >
              👤
            </motion.div>
            Client Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <AnimatedFormField label="Client Name" delay={0.3}>
            <Input placeholder="Client Name" />
          </AnimatedFormField>

          <AnimatedFormField label="Client Email" delay={0.4}>
            <Input type="email" placeholder="client@example.com" />
          </AnimatedFormField>
        </CardContent>
      </AnimatedCard>

      {/* Services */}
      <AnimatedCard delay={0.3}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                📋
              </motion.div>
              Services
            </div>

            <AnimatedButton
              onClick={addService}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </AnimatedButton>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="popLayout">
            {services.map((service) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                }}
                className="grid grid-cols-12 gap-4 p-4 border rounded-lg mb-4"
              >
                <div className="col-span-5">
                  <Input
                    placeholder="Service description"
                    value={service.description}
                    onChange={(e) =>
                      updateService(service.id, "description", e.target.value)
                    }
                  />
                </div>

                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={service.quantity}
                    onChange={(e) =>
                      updateService(
                        service.id,
                        "quantity",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </div>

                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="Rate"
                    value={service.rate}
                    onChange={(e) =>
                      updateService(
                        service.id,
                        "rate",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>

                <div className="col-span-2">
                  <motion.div
                    className="flex items-center h-10 px-3 bg-gray-50 rounded-md"
                    animate={{ scale: service.amount > 0 ? [1, 1.05, 1] : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    ${service.amount.toFixed(2)}
                  </motion.div>
                </div>

                <div className="col-span-1 flex justify-end">
                  {services.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeService(service.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <Separator className="my-6" />

          {/* Total */}
          <motion.div
            className="flex justify-end items-center gap-4 text-lg font-semibold"
            animate={{ scale: totalAmount > 0 ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 0.5 }}
          >
            <Calculator className="w-5 h-5" />
            <span>Total: ${totalAmount.toFixed(2)}</span>
          </motion.div>
        </CardContent>
      </AnimatedCard>

      {/* Action Buttons */}
      <motion.div
        className="flex justify-end gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <AnimatedButton whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          Save Draft
        </AnimatedButton>

        <AnimatedButton
          onClick={handleGenerate}
          loading={isGenerating}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          {isGenerating ? "Generating..." : "Generate Invoice"}
        </AnimatedButton>
      </motion.div>
    </AnimatedContainer>
  );
}
