// # Step 6: Invoice Totals Calculator Component

// 📁 src/components/forms/invoice-totals.tsx
"use client";

import { motion } from "framer-motion";
import { Receipt } from "lucide-react";
import { useMemo } from "react";

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

import { formatCurrency } from "@/lib/utils";
import { ServiceItem } from "@/lib/validations/validation";

interface InvoiceTotalsProps {
  items: ServiceItem[];
  taxRate: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
  currency: string;
  onTaxRateChange: (rate: number) => void;
  onDiscountTypeChange: (type: "percentage" | "fixed") => void;
  onDiscountValueChange: (value: number) => void;
}

export function InvoiceTotals({
  items,
  taxRate,
  discountType,
  discountValue,
  currency,
  onTaxRateChange,
  onDiscountTypeChange,
  onDiscountValueChange,
}: InvoiceTotalsProps) {
  const calculations = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      return sum + (item.quantity || 0) * (item.rate || 0);
    }, 0);

    const discountAmount =
      discountType === "percentage"
        ? (subtotal * discountValue) / 100
        : discountValue;

    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * taxRate) / 100;
    const total = taxableAmount + taxAmount;

    return {
      subtotal,
      discountAmount,
      taxableAmount,
      taxAmount,
      total,
    };
  }, [items, taxRate, discountType, discountValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Invoice Totals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Discount Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Discount (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select
                  value={discountType}
                  onValueChange={onDiscountTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">
                      Fixed Amount ({currency})
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Discount Value</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max={discountType === "percentage" ? "100" : undefined}
                  value={discountValue}
                  onChange={(e) =>
                    onDiscountValueChange(parseFloat(e.target.value) || 0)
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Discount Amount</Label>
                <div className="h-10 flex items-center px-3 bg-muted rounded-md">
                  <span className="font-medium text-green-600">
                    -{formatCurrency(calculations.discountAmount, currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tax Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Tax</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tax Rate (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={taxRate}
                  onChange={(e) =>
                    onTaxRateChange(parseFloat(e.target.value) || 0)
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Tax Amount</Label>
                <div className="h-10 flex items-center px-3 bg-muted rounded-md">
                  <span className="font-medium">
                    {formatCurrency(calculations.taxAmount, currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Totals Summary */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Subtotal:</span>
              <span className="font-medium">
                {formatCurrency(calculations.subtotal, currency)}
              </span>
            </div>
            {calculations.discountAmount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Discount (
                  {discountType === "percentage"
                    ? `${discountValue}%`
                    : "Fixed"}
                  ):
                </span>
                <span className="font-medium text-green-600">
                  -{formatCurrency(calculations.discountAmount, currency)}
                </span>
              </div>
            )}
            {calculations.taxAmount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Tax ({taxRate}%):
                </span>
                <span className="font-medium">
                  {formatCurrency(calculations.taxAmount, currency)}
                </span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-primary">
                {formatCurrency(calculations.total, currency)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
