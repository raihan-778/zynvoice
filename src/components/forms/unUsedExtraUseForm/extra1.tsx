// // 📁 src/components/forms/invoice-form.tsx
// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { motion } from "framer-motion";
// import { DollarSign, Download, Eye, FileText, Send } from "lucide-react";
// import { useState } from "react";
// import { useForm } from "react-hook-form";

// import { Button } from "@/components/ui/button";

// import { Calendar } from "@/components/ui/calendar";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Separator } from "@/components/ui/separator";
// import { Textarea } from "@/components/ui/textarea";

// import { InvoiceTotals } from "./invoice-totals";
// import { ServiceItemsForm } from "./service-items-form";
// import { TemplatePicker } from "./template-picker";

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { formatDate } from "@/lib/utils";
// import {
//   Client,
//   CompanyInfo,
//   InvoiceFormData,
//   invoiceSchema,
// } from "@/lib/validations/validation";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@radix-ui/react-popover";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

// interface InvoiceFormProps {
//   initialData?: Partial<InvoiceFormData>;
//   onSubmit: (data: InvoiceFormData) => void;
//   onPreview: (data: InvoiceFormData) => void;
//   onDownload: (data: InvoiceFormData) => void;
//   onSendEmail: (data: InvoiceFormData) => void;
//   isLoading?: boolean;
//   clientList: Client[];
//   companyList: CompanyInfo[];
// }

// export function InvoiceForm({
//   initialData,
//   onSubmit,
//   onPreview,
//   onDownload,
//   onSendEmail,
//   isLoading,
//   clientList,
//   companyList,
// }: InvoiceFormProps) {
//   const [currentTab, setCurrentTab] = useState("details");
//   const [selectedClient, setSelectedClient] = useState<Client>(
//     initialData?.client || clientList[0]
//   );
//   const [selectedCompany, setSelectedCompany] = useState<CompanyInfo>(
//     initialData?.companyInfo || companyList[0]
//   );
//   const [items, setItems] = useState(initialData?.items || []);
//   const [taxRate, setTaxRate] = useState(initialData?.taxRate || 0);
//   const [discountType, setDiscountType] = useState<"percentage" | "fixed">(
//     initialData?.discountType || "percentage"
//   );
//   const [discountValue, setDiscountValue] = useState(
//     initialData?.discountValue || 0
//   );
//   const [currency, setCurrency] = useState(initialData?.currency || "USD");
//   const [template, setTemplate] = useState(initialData?.template || "modern");
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     watch,
//   } = useForm<InvoiceFormData>({
//     resolver: zodResolver(invoiceSchema),
//     defaultValues: {
//       ...initialData,
//       client: selectedClient!,
//       companyInfo: selectedCompany!,
//       items: initialData?.items?.map((i) => ({ ...i })) || [
//         {
//           id: Date.now().toString(),
//           description: "",
//           quantity: 1,
//           rate: 0,
//           amount: 0,
//           category: "Other",
//           unit: "hour",
//           taxable: false,
//           taxRate: 0,
//         },
//       ],
//       dates: {
//         issued: initialData?.dates?.issued ?? new Date(),
//         due:
//           initialData?.dates?.due ??
//           new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//       },
//       subtotal: initialData?.subtotal ?? 0,
//       tax: initialData?.tax ?? 0,
//       total: initialData?.total ?? 0,
//     },
//   });

//   const values = watch();

//   const handleFormSubmit = (data: InvoiceFormData) => {
//     const formData = {
//       ...data,
//       client: selectedClient,
//       companyInfo: selectedCompany,
//       template: selectedTemplate,
//       items: serviceItems,
//       taxRate,
//       discountType,
//       discountValue,
//       currency,
//       dates: {
//         issued: issuedDate,
//         due: dueDate,
//       },
//     };
//     onSubmit(formData);
//   };
//   //
//   const handlePreview = () => {
//     const formData = getFormData();
//     onPreview(formData);
//   };

//   const handleDownload = () => {
//     const formData = getFormData();
//     onDownload(formData);
//   };

//   const handleSendEmail = () => {
//     const formData = getFormData();
//     onSendEmail(formData);
//   };

//   const getFormData = (): InvoiceFormData => {
//     const { subtotal, tax, total } = calculateInvoiceTotals(
//       serviceItems,
//       taxRate,
//       discountValue,
//       discountType
//     );

//     return {
//       id: initialData?.id,
//       invoiceNumber: initialData?.invoiceNumber || `INV-${Date.now()}`,
//       client: selectedClient,
//       companyInfo: selectedCompany,
//       template: selectedTemplate,
//       items: serviceItems,
//       taxRate,
//       discountType,
//       discountValue,
//       currency,
//       dates: {
//         issued: issuedDate,
//         due: dueDate,
//       },
//       notes: getValues("notes"),
//       terms: getValues("terms"),
//       paymentInstructions: getValues("paymentInstructions"),
//       subtotal,
//       tax,
//       total,
//       status: initialData?.status || "draft",
//     };
//   };

//   const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "INR"];

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="space-y-6"
//     >
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <FileText className="w-5 h-5" />
//             Create Invoice
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Tabs value={currentTab} onValueChange={setCurrentTab}>
//             <TabsList className="grid w-full grid-cols-4">
//               <TabsTrigger value="details">Details</TabsTrigger>
//               <TabsTrigger value="items">Items</TabsTrigger>
//               <TabsTrigger value="totals">Totals</TabsTrigger>
//               <TabsTrigger value="template">Template</TabsTrigger>
//             </TabsList>

//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleFormSubmit(getFormData());
//               }}
//               className="space-y-6"
//             >
//               {/* Details Tab */}
//               <TabsContent value="details" className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Client Selection */}
//                   <div className="space-y-2">
//                     <Label>Select Client *</Label>
//                     <Select
//                       value={selectedClient}
//                       onValueChange={setSelectedClient}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Choose a client" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {clients.map((client) => (
//                           <SelectItem key={client.id} value={client.id}>
//                             {client.name} ({client.email})
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     {errors.client && (
//                       <p className="text-sm text-red-500">
//                         {errors.client.message}
//                       </p>
//                     )}
//                   </div>

//                   {/* Company Selection */}
//                   <div className="space-y-2">
//                     <Label>Select Company Info *</Label>
//                     <Select
//                       value={selectedCompany}
//                       onValueChange={setSelectedCompany}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Choose company info" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {companyInfos.map((company) => (
//                           <SelectItem key={company.id} value={company.id}>
//                             {company.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     {errors.companyInfo && (
//                       <p className="text-sm text-red-500">
//                         {errors.companyInfo.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   {/* Currency */}
//                   <div className="space-y-2">
//                     <Label>Currency</Label>
//                     <Select
//                       value={currency}
//                       onValueChange={(val) =>
//                         setCurrency(val as typeof currency)
//                       }
//                     >
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {currencies.map((curr) => (
//                           <SelectItem key={curr} value={curr}>
//                             {curr}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   {/* Issue Date */}
//                   <div className="space-y-2">
//                     <Label>Issue Date</Label>
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <Button
//                           variant="outline"
//                           className="w-full justify-start text-left"
//                         >
//                           <Calendar className="mr-2 h-4 w-4" />
//                           {formatDate(issuedDate)}
//                         </Button>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-auto p-0">
//                         <Calendar
//                           mode="single"
//                           selected={issuedDate}
//                           onSelect={(date: Date | undefined) =>
//                             date && setIssuedDate(date)
//                           }
//                         />
//                       </PopoverContent>
//                     </Popover>
//                   </div>

//                   {/* Due Date */}
//                   <div className="space-y-2">
//                     <Label>Due Date</Label>
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <Button
//                           variant="outline"
//                           className="w-full justify-start text-left"
//                         >
//                           <Calendar className="mr-2 h-4 w-4" />
//                           {formatDate(dueDate)}
//                         </Button>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-auto p-0">
//                         <Calendar
//                           mode="single"
//                           selected={dueDate}
//                           onSelect={(date: Date | undefined) =>
//                             date && setDueDate(date)
//                           }
//                           initialFocus
//                         />
//                       </PopoverContent>
//                     </Popover>
//                   </div>
//                 </div>

//                 <Separator />

//                 {/* Additional Information */}
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold">
//                     Additional Information
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="notes">Notes</Label>
//                       <Textarea
//                         id="notes"
//                         placeholder="Any additional notes..."
//                         rows={3}
//                         {...register("notes")}
//                       />
//                       {errors.notes && (
//                         <p className="text-sm text-red-500">
//                           {errors.notes.message}
//                         </p>
//                       )}
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="terms">Terms & Conditions</Label>
//                       <Textarea
//                         id="terms"
//                         placeholder="Payment terms and conditions..."
//                         rows={3}
//                         {...register("terms")}
//                       />
//                       {errors.terms && (
//                         <p className="text-sm text-red-500">
//                           {errors.terms.message}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="paymentInstructions">
//                       Payment Instructions
//                     </Label>
//                     <Textarea
//                       id="paymentInstructions"
//                       placeholder="How should clients pay this invoice..."
//                       rows={2}
//                       {...register("paymentInstructions")}
//                     />
//                     {errors.paymentInstructions && (
//                       <p className="text-sm text-red-500">
//                         {errors.paymentInstructions.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </TabsContent>

//               {/* Items Tab */}
//               <TabsContent value="items">
//                 <ServiceItemsForm
//                   items={serviceItems}
//                   onChange={setServiceItems}
//                   currency={currency}
//                 />
//               </TabsContent>

//               {/* Totals Tab */}
//               <TabsContent value="totals">
//                 <InvoiceTotals
//                   items={serviceItems}
//                   taxRate={taxRate}
//                   discountType={discountType}
//                   discountValue={discountValue}
//                   currency={currency}
//                   onTaxRateChange={setTaxRate}
//                   onDiscountTypeChange={setDiscountType}
//                   onDiscountValueChange={setDiscountValue}
//                 />
//               </TabsContent>

//               {/* Template Tab */}
//               <TabsContent value="template">
//                 <TemplatePicker
//                   selectedTemplate={selectedTemplate}
//                   onTemplateChange={setSelectedTemplate}
//                 />
//               </TabsContent>

//               {/* Form Actions */}
//               <div className="flex flex-wrap gap-3 pt-6 border-t">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={handlePreview}
//                   className="flex items-center gap-2"
//                   disabled={isLoading}
//                 >
//                   <Eye className="w-4 h-4" />
//                   Preview
//                 </Button>

//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={handleDownload}
//                   className="flex items-center gap-2"
//                   disabled={isLoading}
//                 >
//                   <Download className="w-4 h-4" />
//                   Download PDF
//                 </Button>

//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={handleSendEmail}
//                   className="flex items-center gap-2"
//                   disabled={isLoading}
//                 >
//                   <Send className="w-4 h-4" />
//                   Send Email
//                 </Button>

//                 <Button
//                   type="submit"
//                   className="flex items-center gap-2 ml-auto"
//                   disabled={isLoading}
//                 >
//                   <DollarSign className="w-4 h-4" />
//                   {isLoading ? "Saving..." : "Save Invoice"}
//                 </Button>
//               </div>
//             </form>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// }
