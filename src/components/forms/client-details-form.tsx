// 📁 src/components/forms/client-details-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { FileText, Mail, MapPin, User } from "lucide-react";
import { useForm } from "react-hook-form";

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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ClientFormData, clientSchema } from "@/lib/validations/validation";

interface ClientDetailsFormProps {
  initialData?: Partial<ClientFormData>;
  onSubmit: (data: ClientFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

export function ClientDetailsForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  isEditing,
}: ClientDetailsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      company: initialData?.company || "",
      address: {
        street: initialData?.address?.street || "",
        city: initialData?.address?.city || "",
        state: initialData?.address?.state || "",
        zipCode: initialData?.address?.zipCode || "",
        country: initialData?.address?.country || "United States",
      },
      notes: initialData?.notes || "",
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {isEditing ? "Edit Client" : "Add New Client"}
          </CardTitle>
          <CardDescription>
            Enter client information for invoicing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Client Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="ABC Corporation"
                    {...register("company")}
                  />
                  {errors.company && (
                    <p className="text-sm text-destructive">
                      {errors.company.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address.street">Street Address *</Label>
                  <Input
                    id="address.street"
                    placeholder="123 Client Street"
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
                    placeholder="Client City"
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

            {/* Additional Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Additional Notes
              </h3>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes about this client..."
                  rows={3}
                  {...register("notes")}
                />
                {errors.notes && (
                  <p className="text-sm text-destructive">
                    {errors.notes.message}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading
                  ? "Saving..."
                  : isEditing
                  ? "Update Client"
                  : "Add Client"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
