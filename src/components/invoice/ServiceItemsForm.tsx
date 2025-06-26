"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Package } from "lucide-react";
import { ServiceItem } from "@/types/invoice";

interface ServiceItemsFormProps {
  items: ServiceItem[];
  onUpdateItem: (index: number, item: Partial<ServiceItem>) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  subtotal: number;
  tax: number;
  total: number;
}

export const ServiceItemsForm: React.FC<ServiceItemsFormProps> = ({
  items,
  onUpdateItem,
  onAddItem,
  onRemoveItem,
  subtotal,
  tax,
  total,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Service Items
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="p-4 border rounded-lg space-y-4 bg-gray-50"
              >
                {/* Item Header */}
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-semibold">
                    Item {index + 1}
                  </Label>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Textarea
                    value={item.description}
                    onChange={(e) =>
                      onUpdateItem(index, { description: e.target.value })
                    }
                    placeholder="Describe the service or product"
                    rows={2}
                    required
                  />
                </div>

                {/* Quantity, Rate, Amount Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Quantity *</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        onUpdateItem(index, {
                          quantity: Number(e.target.value),
                        })
                      }
                      placeholder="1"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rate ($) *</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) =>
                        onUpdateItem(index, { rate: Number(e.target.value) })
                      }
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount ($)</Label>
                    <Input
                      type="number"
                      value={item.amount.toFixed(2)}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Item Button */}
          <Button
            type="button"
            variant="outline"
            onClick={onAddItem}
            className="w-full flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </Button>

          {/* Total Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="border-t pt-4 space-y-2"
          >
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (10%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
