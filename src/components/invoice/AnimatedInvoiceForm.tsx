// ===========================================
// 15. USAGE EXAMPLE - INVOICE FORM WITH ANIMATIONS
// ===========================================

// 📁 components/invoice/AnimatedInvoiceForm.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AnimatedForm } from "@/components/animations/AnimatedForm";
import { AnimatedFormField } from "@/components/animations/AnimatedFormField";
import { AnimatedButton } from "@/components/animations/AnimatedButton";
import { LoadingOverlay } from "@/components/animations/LoadingOverlay";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { AnimatedState } from "../animations/AnimatetStats";

export function AnimatedInvoiceForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serviceItems, setServiceItems] = useState([
    { description: "", quantity: 1, rate: 0, amount: 0 },
  ]);

  const addServiceItem = () => {
    setServiceItems([
      ...serviceItems,
      { description: "", quantity: 1, rate: 0, amount: 0 },
    ]);
  };

  const removeServiceItem = (index: number) => {
    if (serviceItems.length > 1) {
      setServiceItems(serviceItems.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <AnimatedState
        type="success"
        title="Invoice Generated Successfully!"
        message="Your invoice has been created and is ready to be sent."
        onAction={() => setIsSuccess(false)}
        actionLabel="Create Another"
      />
    );
  }

  return (
    <>
      <LoadingOverlay isLoading={isLoading} message="Generating invoice..." />

      <AnimatedForm onSubmit={handleSubmit} className="space-y-6">
        {/* Company Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold">Company Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatedFormField delay={0.2}>
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" placeholder="Your Company Name" />
            </AnimatedFormField>

            <AnimatedFormField delay={0.3}>
              <Label htmlFor="companyEmail">Email</Label>
              <Input
                id="companyEmail"
                type="email"
                placeholder="company@example.com"
              />
            </AnimatedFormField>
          </div>
        </motion.div>

        {/* Service Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Service Items</h3>
            <AnimatedButton onClick={addServiceItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </AnimatedButton>
          </div>

          {serviceItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-lg"
            >
              <div className="md:col-span-6">
                <Label>Description</Label>
                <Textarea
                  placeholder="Service description"
                  className="min-h-[60px]"
                />
              </div>

              <div className="md:col-span-2">
                <Label>Quantity</Label>
                <Input type="number" min="1" defaultValue="1" />
              </div>

              <div className="md:col-span-2">
                <Label>Rate</Label>
                <Input type="number" min="0" step="0.01" placeholder="0.00" />
              </div>

              <div className="md:col-span-1 flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeServiceItem(index)}
                  disabled={serviceItems.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-end space-x-4"
        >
          <Button variant="outline" type="button">
            Save Draft
          </Button>
          <AnimatedButton type="submit">Generate Invoice</AnimatedButton>
        </motion.div>
      </AnimatedForm>
    </>
  );
}
