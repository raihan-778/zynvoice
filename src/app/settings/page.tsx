// app/settings/page.tsx
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { Copy, Edit3, Eye, Plus, Save, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface CompanyInfo {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
  website?: string;
  taxId?: string;
}

interface InvoiceTemplate {
  _id: string;
  name: string;
  description: string;
  previewImage: string;
  styles: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    layout: "modern" | "classic" | "minimal" | "corporate";
  };
  isDefault: boolean;
  createdAt: string;
}

export default function SettingsPage() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    taxId: "",
  });

  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  // Load company info and templates on mount
  useEffect(() => {
    loadCompanyInfo();
    loadTemplates();
  }, []);

  const loadCompanyInfo = async () => {
    try {
      const response = await fetch("/api/company");
      if (response.ok) {
        const data = await response.json();
        setCompanyInfo(data);
        if (data.logo) setLogoPreview(data.logo);
      }
    } catch (error) {
      console.error("Failed to load company info:", error);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await fetch("/api/templates");
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error("Failed to load templates:", error);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveCompanyInfo = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      // Append company data
      Object.entries(companyInfo).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      // Append logo file if exists
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const response = await fetch("/api/company", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast("Success", {
          description: "Company information updated successfully",
        });
        loadCompanyInfo();
      } else {
        throw new Error("Failed to save company info");
      }
    } catch (error) {
      toast("Error", {
        description: `Failed to save company information ${error}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setDefaultTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`/api/templates/${templateId}/default`, {
        method: "POST",
      });

      if (response.ok) {
        toast("Success", {
          description: "Default template updated",
        });
        loadTemplates();
      }
    } catch (error) {
      toast("Error", {
        description: `Failed to update default template,${error}`,
      });
    }
  };

  const duplicateTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`/api/templates/${templateId}/duplicate`, {
        method: "POST",
      });

      if (response.ok) {
        toast("Success", {
          description: "Template duplicated successfully",
        });
        loadTemplates();
      }
    } catch (error) {
      toast("Error", {
        description: `Failed to duplicate template ${error}`,
      });
    }
  };

  const deleteTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast("Success", {
          description: "Template deleted successfully",
        });
        loadTemplates();
      }
    } catch (error) {
      toast("Error", {
        description: `Failed to delete template,${error}`,
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your company information and invoice templates
          </p>
        </div>

        <Tabs defaultValue="company" className="space-y-6">
          <TabsList>
            <TabsTrigger value="company">Company Info</TabsTrigger>
            <TabsTrigger value="templates">Invoice Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Update your company details that will appear on invoices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo Upload */}
                <div className="space-y-4">
                  <Label>Company Logo</Label>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={logoPreview} />
                      <AvatarFallback className="text-lg">
                        {companyInfo.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <Label htmlFor="logo-upload" className="cursor-pointer">
                        <Button variant="outline" asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Logo
                          </span>
                        </Button>
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Recommended: 200x200px, PNG or JPG
                      </p>
                    </div>
                  </div>
                </div>

                {/* Company Details Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={companyInfo.name}
                      onChange={(e) =>
                        setCompanyInfo({ ...companyInfo, name: e.target.value })
                      }
                      placeholder="Your Company Name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Email Address *</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      value={companyInfo.email}
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          email: e.target.value,
                        })
                      }
                      placeholder="company@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Phone Number</Label>
                    <Input
                      id="companyPhone"
                      value={companyInfo.phone}
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          phone: e.target.value,
                        })
                      }
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyWebsite">Website</Label>
                    <Input
                      id="companyWebsite"
                      value={companyInfo.website}
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          website: e.target.value,
                        })
                      }
                      placeholder="https://yourcompany.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyTaxId">
                      Tax ID / Registration Number
                    </Label>
                    <Input
                      id="companyTaxId"
                      value={companyInfo.taxId}
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          taxId: e.target.value,
                        })
                      }
                      placeholder="123-45-6789"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Company Address</Label>
                  <Textarea
                    id="companyAddress"
                    value={companyInfo.address}
                    onChange={(e) =>
                      setCompanyInfo({
                        ...companyInfo,
                        address: e.target.value,
                      })
                    }
                    placeholder="123 Business Street&#10;City, State 12345&#10;Country"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={saveCompanyInfo} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Invoice Templates</h3>
                  <p className="text-muted-foreground">
                    Customize your invoice appearance
                  </p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <motion.div
                    key={template._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="relative overflow-hidden">
                      {template.isDefault && (
                        <Badge className="absolute top-2 right-2 z-10">
                          Default
                        </Badge>
                      )}

                      <Image
                        src={template.previewImage}
                        alt={template.name}
                        className="w-full h-full object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: "cover" }}
                        priority={template.isDefault}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm opacity-90">
                          {template.description}
                        </p>
                      </div>

                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-4 h-4 rounded-full border"
                              style={{
                                backgroundColor: template.styles.primaryColor,
                              }}
                            />
                            <div
                              className="w-4 h-4 rounded-full border"
                              style={{
                                backgroundColor: template.styles.secondaryColor,
                              }}
                            />
                            <span className="text-sm text-muted-foreground capitalize">
                              {template.styles.layout}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => duplicateTemplate(template._id)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="flex space-x-1">
                            {!template.isDefault && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDefaultTemplate(template._id)}
                              >
                                Set Default
                              </Button>
                            )}

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={template.isDefault}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Template
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete &quot;
                                    {template.name}&quot;? This action cannot be
                                    undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteTemplate(template._id)}
                                    className="bg-destructive text-destructive-foreground"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
