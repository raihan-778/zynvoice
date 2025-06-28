"use client";

import MainLayout from "@/components/layout/Main-Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, FileText, Mail, Zap } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <MainLayout>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Professional Invoice Generator
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Create beautiful, professional invoices in minutes. Customize,
          download, and send with ease.
        </p>

        <div className="mb-12">
          <Link href="/invoice">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <FileText className="h-5 w-5 mr-2" />
              Create Your First Invoice
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Easy Creation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Simple form-based invoice creation with automatic calculations
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Download className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Multiple Formats</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Download as PDF or image formats for easy sharing
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Mail className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Email Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Send invoices directly to clients via email
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Zap className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle>Custom Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Choose from professional templates or create your own
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
