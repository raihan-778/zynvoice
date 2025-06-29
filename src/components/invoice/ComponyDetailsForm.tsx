"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CompanyInfo } from "@/lib/validations/validation";

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
            <Label>Address *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-street">Street</Label>
                <Input
                  id="company-street"
                  value={company.address.street}
                  onChange={(e) =>
                    onUpdate({
                      address: {
                        ...company.address,
                        street: e.target.value,
                      },
                    })
                  }
                  placeholder="Enter street"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-city">City</Label>
                <Input
                  id="company-city"
                  value={company.address.city}
                  onChange={(e) =>
                    onUpdate({
                      address: {
                        ...company.address,
                        city: e.target.value,
                      },
                    })
                  }
                  placeholder="Enter city"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-state">State</Label>
                <Input
                  id="company-state"
                  value={company.address.state}
                  onChange={(e) =>
                    onUpdate({
                      address: {
                        ...company.address,
                        state: e.target.value,
                      },
                    })
                  }
                  placeholder="Enter state"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-zip">Zip Code</Label>
                <Input
                  id="company-zip"
                  value={company.address.zipCode}
                  onChange={(e) =>
                    onUpdate({
                      address: {
                        ...company.address,
                        zipCode: e.target.value,
                      },
                    })
                  }
                  placeholder="Enter zip code"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="company-country">Country</Label>
                <Input
                  id="company-country"
                  value={company.address.country}
                  onChange={(e) =>
                    onUpdate({
                      address: {
                        ...company.address,
                        country: e.target.value,
                      },
                    })
                  }
                  placeholder="Enter country"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-phone">Phone *</Label>
              <Input
                id="company-phone"
                value={company.contact.phone}
                onChange={(e) =>
                  onUpdate({
                    contact: {
                      ...company.contact,
                      phone: e.target.value,
                    },
                  })
                }
                placeholder="Enter phone number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-email">Email *</Label>
              <Input
                id="company-email"
                type="email"
                value={company.contact.email}
                onChange={(e) =>
                  onUpdate({
                    contact: {
                      ...company.contact,
                      email: e.target.value,
                    },
                  })
                }
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
              value={company.contact.website || ""}
              onChange={(e) =>
                onUpdate({
                  contact: {
                    ...company.contact,
                    website: e.target.value,
                  },
                })
              }
              placeholder="Enter website URL"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
