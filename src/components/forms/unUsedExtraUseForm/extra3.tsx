// 📁 src/components/forms/invoice-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  DollarSign,
  Download,
  Eye,
  FileText,
  Send,
  Plus,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import { formatDate } from "@/lib/utils";
import {
  ClientInfo,
  CompanyInfo,
  InvoiceFormData,
  InvoiceFormDataSchema,
  InvoiceItem,
} from "@/lib/validations/validation";

// Helper function to calculate totals
function calculateInvoiceTotals(
  items: InvoiceItem[],
  taxRate: number,
  discountValue: number,
  discountType: "percentage" | "fixed"
) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );

  let discount = 0;
  if (discountType === "percentage") {
    discount = (subtotal * discountValue) / 100;
  } else {
    discount = discountValue;
  }

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const tax = (discountedSubtotal * taxRate) / 100;
  const total = discountedSubtotal + tax;

  return { subtotal, tax, total, discount };
}

interface InvoiceFormProps {
  initialData?: Partial<InvoiceFormData>;
  onSubmit: (data: InvoiceFormData) => void;
  onPreview: (data: InvoiceFormData) => void;
  onDownload: (data: InvoiceFormData) => void;
  onSendEmail: (data: InvoiceFormData) => void;
  isLoading?: boolean;
  clientList: ClientInfo[];
  companyList: CompanyInfo[];
}

export function InvoiceForm({
  initialData,
  onSubmit,
  onPreview,
  onDownload,
  onSendEmail,
  isLoading,
  clientList,
  companyList,
}: InvoiceFormProps) {
  const [currentTab, setCurrentTab] = useState("details");
  const [totals, setTotals] = useState({
    subtotal: 0,
    tax: 0,
    total: 0,
    discount: 0,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
    control,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(InvoiceFormDataSchema),
    defaultValues: {
      invoiceNumber: initialData?.invoiceNumber || `INV-${Date.now()}`,
      companyInfo:
        initialData?.companyInfo ||
        (companyList.length > 0 ? companyList[0] : undefined),
      client:
        initialData?.client ||
        (clientList.length > 0 ? clientList[0] : undefined),
      items: initialData?.items || [
        {
          id: Date.now().toString(),
          description: "",
          quantity: 1,
          rate: 0,
        },
      ],
      dates: {
        issued: initialData?.dates?.issued || new Date(),
        due:
          initialData?.dates?.due ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      currency: initialData?.currency || "USD",
      discountType: initialData?.discountType || "percentage",
      discountValue: initialData?.discountValue || 0,
      taxRate: initialData?.taxRate || 0,
      notes: initialData?.notes || "",
      terms: initialData?.terms || "",
      paymentInstructions: initialData?.paymentInstructions || "",
      template: initialData?.template || "modern",
      status: initialData?.status || "draft",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Watch form values for real-time updates
  const watchedItems = watch("items");
  const watchedTaxRate = watch("taxRate");
  const watchedDiscountValue = watch("discountValue");
  const watchedDiscountType = watch("discountType");

  // Calculate totals whenever items or rates change
  useEffect(() => {
    const newTotals = calculateInvoiceTotals(
      watchedItems || [],
      watchedTaxRate || 0,
      watchedDiscountValue || 0,
      watchedDiscountType || "percentage"
    );
    setTotals(newTotals);
  }, [watchedItems, watchedTaxRate, watchedDiscountValue, watchedDiscountType]);

  const handleFormSubmit = (formData: InvoiceFormData) => {
    const finalData = {
      ...formData,
      ...totals,
      id: initialData?.id,
    };
    onSubmit(finalData);
  };

  const handlePreview = () => {
    const formData = getValues();
    const finalData = {
      ...formData,
      ...totals,
      id: initialData?.id,
    };
    onPreview(finalData);
  };

  const handleDownload = () => {
    const formData = getValues();
    const finalData = {
      ...formData,
      ...totals,
      id: initialData?.id,
    };
    onDownload(finalData);
  };

  const handleSendEmail = () => {
    const formData = getValues();
    const finalData = {
      ...formData,
      ...totals,
      id: initialData?.id,
    };
    onSendEmail(finalData);
  };

  const addNewItem = () => {
    append({
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
    });
  };

  const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "INR"];
  const templates = [
    { id: "modern", name: "Modern", description: "Clean and professional" },
    { id: "classic", name: "Classic", description: "Traditional layout" },
    { id: "minimal", name: "Minimal", description: "Simple and elegant" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Create Invoice
            <Badge variant="secondary" className="ml-auto">
              Total: {totals.total.toFixed(2)} {watch("currency")}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="items">Items ({fields.length})</TabsTrigger>
              <TabsTrigger value="totals">Totals</TabsTrigger>
              <TabsTrigger value="template">Template</TabsTrigger>
            </TabsList>

            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-6"
            >
              {/* Details Tab */}
              <TabsContent value="details" className="space-y-6">
                {/* Invoice Number */}
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                  <Input
                    id="invoiceNumber"
                    placeholder="INV-001"
                    {...register("invoiceNumber")}
                  />
                  {errors.invoiceNumber && (
                    <p className="text-sm text-red-500">
                      {errors.invoiceNumber.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Client Selection */}
                  <div className="space-y-2">
                    <Label>Select Client *</Label>
                    <Select
                      value={watch("client")?.id || ""}
                      onValueChange={(clientId) => {
                        const client = clientList.find(
                          (c) => c.id === clientId
                        );
                        setValue("client", client);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientList.map((client) => (
                          <SelectItem key={client.id} value={client.id || ""}>
                            {client.name} ({client.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.client && (
                      <p className="text-sm text-red-500">
                        {errors.client.message}
                      </p>
                    )}
                  </div>

                  {/* Company Selection */}
                  <div className="space-y-2">
                    <Label>Select Company Info *</Label>
                    <Select
                      value={watch("companyInfo")?.id || ""}
                      onValueChange={(companyId) => {
                        const company = companyList.find(
                          (c) => c.id === companyId
                        );
                        setValue("companyInfo", company);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose company info" />
                      </SelectTrigger>
                      <SelectContent>
                        {companyList.map((company) => (
                          <SelectItem key={company.id} value={company.id || ""}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.companyInfo && (
                      <p className="text-sm text-red-500">
                        {errors.companyInfo.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Currency */}
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select
                      value={watch("currency")}
                      onValueChange={(value) => setValue("currency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((curr) => (
                          <SelectItem key={curr} value={curr}>
                            {curr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Issue Date */}
                  <div className="space-y-2">
                    <Label>Issue Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {formatDate(watch("dates.issued"))}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={watch("dates.issued")}
                          onSelect={(date) =>
                            date && setValue("dates.issued", date)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Due Date */}
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {formatDate(watch("dates.due"))}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={watch("dates.due")}
                          onSelect={(date) =>
                            date && setValue("dates.due", date)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <Separator />

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Additional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any additional notes..."
                        rows={3}
                        {...register("notes")}
                      />
                      {errors.notes && (
                        <p className="text-sm text-red-500">
                          {errors.notes.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="terms">Terms & Conditions</Label>
                      <Textarea
                        id="terms"
                        placeholder="Payment terms and conditions..."
                        rows={3}
                        {...register("terms")}
                      />
                      {errors.terms && (
                        <p className="text-sm text-red-500">
                          {errors.terms.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentInstructions">
                      Payment Instructions
                    </Label>
                    <Textarea
                      id="paymentInstructions"
                      placeholder="How should clients pay this invoice..."
                      rows={2}
                      {...register("paymentInstructions")}
                    />
                    {errors.paymentInstructions && (
                      <p className="text-sm text-red-500">
                        {errors.paymentInstructions.message}
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Items Tab */}
              <TabsContent value="items" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Service Items</h3>
                  <Button
                    type="button"
                    onClick={addNewItem}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <Card key={field.id}>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                          <div className="md:col-span-5 space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              placeholder="Service description..."
                              rows={2}
                              {...register(`items.${index}.description`)}
                            />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <Label>Quantity</Label>
                            <Input
                              type="number"
                              min="1"
                              {...register(`items.${index}.quantity`, {
                                valueAsNumber: true,
                              })}
                            />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <Label>Rate</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              {...register(`items.${index}.rate`, {
                                valueAsNumber: true,
                              })}
                            />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <Label>Total</Label>
                            <div className="h-10 px-3 py-2 bg-muted rounded-md flex items-center">
                              {(
                                (watchedItems?.[index]?.quantity || 0) *
                                (watchedItems?.[index]?.rate || 0)
                              ).toFixed(2)}
                            </div>
                          </div>
                          <div className="md:col-span-1">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => remove(index)}
                              disabled={fields.length === 1}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Totals Tab */}
              <TabsContent value="totals" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Tax & Discount</h3>

                    <div className="space-y-2">
                      <Label>Tax Rate (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        {...register("taxRate", { valueAsNumber: true })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Discount Type</Label>
                      <Select
                        value={watch("discountType")}
                        onValueChange={(value) =>
                          setValue(
                            "discountType",
                            value as "percentage" | "fixed"
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">
                            Percentage (%)
                          </SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>
                        Discount Value{" "}
                        {watch("discountType") === "percentage"
                          ? "(%)"
                          : `(${watch("currency")})`}
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        {...register("discountValue", { valueAsNumber: true })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Invoice Summary</h3>
                    <Card>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>
                            {totals.subtotal.toFixed(2)} {watch("currency")}
                          </span>
                        </div>
                        {totals.discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount:</span>
                            <span>
                              -{totals.discount.toFixed(2)} {watch("currency")}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Tax ({watch("taxRate")}%):</span>
                          <span>
                            {totals.tax.toFixed(2)} {watch("currency")}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total:</span>
                          <span>
                            {totals.total.toFixed(2)} {watch("currency")}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Template Tab */}
              <TabsContent value="template" className="space-y-4">
                <h3 className="text-lg font-semibold">Choose Template</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-colors ${
                        watch("template") === template.id
                          ? "ring-2 ring-primary"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => setValue("template", template.id)}
                    >
                      <CardContent className="p-4 text-center">
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Form Actions */}
              <div className="flex flex-wrap gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreview}
                  className="flex items-center gap-2"
                  disabled={isLoading}
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownload}
                  className="flex items-center gap-2"
                  disabled={isLoading}
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendEmail}
                  className="flex items-center gap-2"
                  disabled={isLoading}
                >
                  <Send className="w-4 h-4" />
                  Send Email
                </Button>

                <Button
                  type="submit"
                  className="flex items-center gap-2 ml-auto"
                  disabled={isLoading}
                >
                  <DollarSign className="w-4 h-4" />
                  {isLoading ? "Saving..." : "Save Invoice"}
                </Button>
              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
