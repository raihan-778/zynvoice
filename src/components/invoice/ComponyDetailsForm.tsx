"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CompanyInfo } from "@/types/invoice";
import { motion } from "framer-motion";
import { Building2, Upload } from "lucide-react";
import Image from "next/image";
import React, { useRef } from "react";

interface CompanyDetailsFormProps {
  company: CompanyInfo;
  onUpdate: (company: Partial<CompanyInfo>) => void;
}

export const CompanyDetailsForm: React.FC<CompanyDetailsFormProps> = ({
  company,
  onUpdate,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpdate({ logo: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Company Logo</Label>
            <div className="flex items-center gap-4">
              {company.logo && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
                >
                  <Image
                    src={company.logo}
                    alt="Logo"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Logo
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name *</Label>
            <Input
              id="company-name"
              value={company.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Enter company name"
              required
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="company-address">Address *</Label>
            <Textarea
              id="company-address"
              value={company.address}
              onChange={(e) => onUpdate({ address: e.target.value })}
              placeholder="Enter company address"
              rows={3}
              required
            />
          </div>

          {/* Contact Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-phone">Phone *</Label>
              <Input
                id="company-phone"
                value={company.phone}
                onChange={(e) => onUpdate({ phone: e.target.value })}
                placeholder="Enter phone number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-email">Email *</Label>
              <Input
                id="company-email"
                type="email"
                value={company.email}
                onChange={(e) => onUpdate({ email: e.target.value })}
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="company-website">Website</Label>
            <Input
              id="company-website"
              value={company.website || ""}
              onChange={(e) => onUpdate({ website: e.target.value })}
              placeholder="Enter website URL"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
