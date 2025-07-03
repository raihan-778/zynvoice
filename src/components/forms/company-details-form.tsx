"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Building2, CreditCard, Mail, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ICompany } from "@/types/database";

interface CompanyDetailsFormProps {
  initialData?: Partial<ICompany>;
  onSubmit: (data: ICompany) => void;
  isLoading?: boolean;
}

export function CompanyDetailsForm({
  initialData,
  onSubmit,
  isLoading,
}: CompanyDetailsFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(
    initialData?.logo || null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ICompany>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      name: initialData?.name || "",
      logo: initialData?.logo || "",
      address: {
        street: initialData?.address?.street || "",
        city: initialData?.address?.city || "",
        state: initialData?.address?.state || "",
        zipCode: initialData?.address?.zipCode || "",
        country: initialData?.address?.country || "United States",
      },
      contact: {
        email: initialData?.contact?.email || "",
        phone: initialData?.contact?.phone || "",
        website: initialData?.contact?.website || "",
      },
      bankDetails: {
        bankName: initialData?.bankDetails?.bankName || "",
        accountNumber: initialData?.bankDetails?.accountNumber || "",
        routingNumber: initialData?.bankDetails?.routingNumber || "",
        accountHolderName: initialData?.bankDetails?.accountHolderName || "",
      },
      taxInfo: {
        taxId: initialData?.taxInfo?.taxId || "",
        vatNumber: initialData?.taxInfo?.vatNumber || "",
      },
    },
  });

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setLogoPreview(url);
    setValue("logo", url);
  };

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
            <Building2 className="w-5 h-5" />
            Company Information
          </CardTitle>
          <CardDescription>
            Enter your company details that will appear on invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Logo Section */}
            <div className="space-y-4">
              <Label htmlFor="logo">Company Logo</Label>
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={logoPreview || ""} alt="Company Logo" />
                  <AvatarFallback>
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Input
                    id="logo"
                    placeholder="Enter logo URL (https://...)"
                    {...register("logo")}
                    onChange={handleLogoChange}
                  />
                  {errors.logo && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.logo.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  placeholder="Your Company Name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* Address Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Business Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address.street">Street Address *</Label>
                  <Input
                    id="address.street"
                    placeholder="123 Business Street"
                    {...register("address.street")}
                  />
                  {errors.address?.street && (
                    <p className="text-sm text-destructive">
                      {errors.address.street.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address.city">City *</Label>
                  <Input
                    id="address.city"
                    placeholder="Business City"
                    {...register("address.city")}
                  />
                  {errors.address?.city && (
                    <p className="text-sm text-destructive">
                      {errors.address.city.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address.state">State *</Label>
                  <Input
                    id="address.state"
                    placeholder="State"
                    {...register("address.state")}
                  />
                  {errors.address?.state && (
                    <p className="text-sm text-destructive">
                      {errors.address.state.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address.zipCode">Zip Code *</Label>
                  <Input
                    id="address.zipCode"
                    placeholder="12345"
                    {...register("address.zipCode")}
                  />
                  {errors.address?.zipCode && (
                    <p className="text-sm text-destructive">
                      {errors.address.zipCode.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address.country">Country *</Label>
                  <Input
                    id="address.country"
                    placeholder="United States"
                    {...register("address.country")}
                  />
                  {errors.address?.country && (
                    <p className="text-sm text-destructive">
                      {errors.address.country.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact.email">Email Address *</Label>
                  <Input
                    id="contact.email"
                    type="email"
                    placeholder="info@company.com"
                    {...register("contact.email")}
                  />
                  {errors.contact?.email && (
                    <p className="text-sm text-destructive">
                      {errors.contact.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact.phone">Phone Number *</Label>
                  <Input
                    id="contact.phone"
                    placeholder="+1 (555) 123-4567"
                    {...register("contact.phone")}
                  />
                  {errors.contact?.phone && (
                    <p className="text-sm text-destructive">
                      {errors.contact.phone.message}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="contact.website">Website</Label>
                  <Input
                    id="contact.website"
                    placeholder="https://yourcompany.com"
                    {...register("contact.website")}
                  />
                  {errors.contact?.website && (
                    <p className="text-sm text-destructive">
                      {errors.contact.website.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Bank Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Bank Details (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankDetails.bankName">Bank Name</Label>
                  <Input
                    id="bankDetails.bankName"
                    placeholder="Bank of America"
                    {...register("bankDetails.bankName")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankDetails.accountHolderName">
                    Account Holder Name
                  </Label>
                  <Input
                    id="bankDetails.accountHolderName"
                    placeholder="Your Company Name"
                    {...register("bankDetails.accountHolderName")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankDetails.accountNumber">
                    Account Number
                  </Label>
                  <Input
                    id="bankDetails.accountNumber"
                    placeholder="1234567890"
                    {...register("bankDetails.accountNumber")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankDetails.routingNumber">
                    Routing Number
                  </Label>
                  <Input
                    id="bankDetails.routingNumber"
                    placeholder="123456789"
                    {...register("bankDetails.routingNumber")}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Tax Info Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Tax Information (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxInfo.taxId">Tax ID / EIN</Label>
                  <Input
                    id="taxInfo.taxId"
                    placeholder="12-3456789"
                    {...register("taxInfo.taxId")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxInfo.vatNumber">VAT Number</Label>
                  <Input
                    id="taxInfo.vatNumber"
                    placeholder="VAT123456789"
                    {...register("taxInfo.vatNumber")}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? "Saving..." : "Save Company Info"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
