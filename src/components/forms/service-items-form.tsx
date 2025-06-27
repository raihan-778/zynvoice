// ## Step 5: Dynamic Service Items Component

// 📁 src/components/forms/service-items-form.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Calculator, Package, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { ServiceItemFormData } from "@/lib/validations/validation";

interface ServiceItemsFormProps {
  items: ServiceItemFormData[];
  onChange: (items: ServiceItemFormData[]) => void;
  currency?: string;
}

export function ServiceItemsForm({
  items,
  onChange,
  currency = "USD",
}: ServiceItemsFormProps) {
  const [totalAmount, setTotalAmount] = useState(0);

  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { items },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = watch("items");

  // Calculate totals whenever items change
  useEffect(() => {
    const total = watchedItems.reduce((sum, item) => {
      const amount = (item.quantity || 0) * (item.rate || 0);
      return sum + amount;
    }, 0);
    setTotalAmount(total);

    // Update parent with calculated amounts
    const updatedItems = watchedItems.map((item) => ({
      ...item,
      amount: (item.quantity || 0) * (item.rate || 0),
    }));
    onChange(updatedItems);
  }, [watchedItems, onChange]);

  const addServiceItem = () => {
    append({
      description: "",
      quantity: 1,
      rate: 0,
      category: "Other",
      unit: "hour",
      taxable: true,
      taxRate: 0,
    });
  };

  const removeServiceItem = (index: number) => {
    remove(index);
  };

  const categories = [
    "Design",
    "Development",
    "Consulting",
    "Marketing",
    "Other",
  ];
  const units = ["hour", "day", "week", "month", "project", "piece"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Service Items
        </CardTitle>
        <CardDescription>
          Add services or products to include in this invoice
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <AnimatePresence>
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border rounded-lg p-4 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Item {index + 1}</Badge>
                  <Select
                    value={watchedItems[index]?.category}
                    onValueChange={(value) =>
                      setValue(
                        `items.${index}.category`,
                        value as
                          | "Design"
                          | "Development"
                          | "Consulting"
                          | "Marketing"
                          | "Other"
                      )
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeServiceItem(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor={`items.${index}.description`}>
                    Description *
                  </Label>
                  <Input
                    id={`items.${index}.description`}
                    placeholder="Service description..."
                    {...register(`items.${index}.description`)}
                  />
                  {errors.items?.[index]?.description && (
                    <p className="text-sm text-destructive">
                      {errors.items[index]?.description?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`items.${index}.quantity`}>Quantity *</Label>
                  <Input
                    id={`items.${index}.quantity`}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="1"
                    {...register(`items.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.items?.[index]?.quantity && (
                    <p className="text-sm text-destructive">
                      {errors.items[index]?.quantity?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`items.${index}.unit`}>Unit</Label>
                  <Select
                    value={watchedItems[index]?.unit}
                    onValueChange={(value) =>
                      setValue(
                        `items.${index}.unit`,
                        value as
                          | "hour"
                          | "day"
                          | "week"
                          | "month"
                          | "project"
                          | "piece"
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`items.${index}.rate`}>
                    Rate ({currency}) *
                  </Label>
                  <Input
                    id={`items.${index}.rate`}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...register(`items.${index}.rate`, {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.items?.[index]?.rate && (
                    <p className="text-sm text-destructive">
                      {errors.items[index]?.rate?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Amount ({currency})</Label>
                  <div className="h-10 flex items-center px-3 bg-muted rounded-md">
                    <span className="font-medium">
                      {formatCurrency(
                        (watchedItems[index]?.quantity || 0) *
                          (watchedItems[index]?.rate || 0),
                        currency
                      )}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`items.${index}.taxRate`}>Tax Rate (%)</Label>
                  <Input
                    id={`items.${index}.taxRate`}
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="0"
                    {...register(`items.${index}.taxRate`, {
                      valueAsNumber: true,
                    })}
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
          onClick={addServiceItem}
          className="w-full border-dashed"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Service Item
        </Button>

        <Separator />

        {/* Total Summary */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              <span className="font-semibold">Subtotal</span>
            </div>
            <span className="text-lg font-bold">
              {formatCurrency(totalAmount, currency)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
