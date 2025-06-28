# Invoice Generator Web App - Complete Implementation Guide

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack & Architecture](#tech-stack--architecture)
3. [Project Structure](#project-structure)
4. [Section-by-Section Implementation](#section-by-section-implementation)
5. [API Routes & Database Integration](#api-routes--database-integration)
6. [Component Integration](#component-integration)
7. [State Management](#state-management)
8. [Deployment Guide](#deployment-guide)
9. [Future Scalability](#future-scalability)

## 🎯 Project Overview

A professional invoice generator web application that allows users to:

- Create, edit, and manage invoices
- Customize invoice templates
- Generate PDF/Image exports
- Send invoices via email
- Manage company information and clients
- Track invoice history with dashboard

## 🛠 Tech Stack & Architecture

### Frontend

- **Next.js 14** (App Router)
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **ShadCN UI** for components
- **Framer Motion** for animations
- **React Hook Form** for form management
- **Zustand** for state management

### Backend

- **Next.js API Routes**
- **MongoDB** with Mongoose
- **NextAuth.js** for authentication
- **Nodemailer** for email services
- **Puppeteer** for PDF generation

### Additional Libraries

- **react-pdf** for PDF handling
- **html-to-image** for image export
- **date-fns** for date manipulation
- **zod** for validation

## 📁 Project Structure

```
invoice-generator/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── invoices/
│   │   ├── templates/
│   │   ├── settings/
│   │   └── clients/
│   ├── api/
│   │   ├── auth/
│   │   ├── invoices/
│   │   ├── templates/
│   │   ├── clients/
│   │   ├── email/
│   │   └── upload/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/ (ShadCN components)
│   ├── forms/
│   │   ├── InvoiceForm.tsx
│   │   ├── CompanyDetailsForm.tsx
│   │   ├── ClientForm.tsx
│   │   └── ServiceItemsForm.tsx
│   ├── invoice/
│   │   ├── InvoicePreview.tsx
│   │   ├── InvoiceList.tsx
│   │   └── InvoiceActions.tsx
│   ├── templates/
│   │   ├── TemplateEditor.tsx
│   │   ├── TemplatePreview.tsx
│   │   └── TemplateSelector.tsx
│   ├── dashboard/
│   │   ├── StatsCards.tsx
│   │   ├── RecentInvoices.tsx
│   │   └── QuickActions.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   └── shared/
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       └── ConfirmDialog.tsx
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   ├── utils.ts
│   ├── validations.ts
│   ├── pdf-generator.ts
│   ├── email-service.ts
│   └── store.ts
├── models/
│   ├── Invoice.ts
│   ├── User.ts
│   ├── Client.ts
│   ├── Template.ts
│   └── Company.ts
├── types/
│   ├── invoice.ts
│   ├── user.ts
│   ├── client.ts
│   └── template.ts
├── hooks/
│   ├── useInvoices.ts
│   ├── useTemplates.ts
│   ├── useClients.ts
│   └── useAuth.ts
└── public/
    ├── templates/
    └── uploads/
```

## 🔧 Section-by-Section Implementation

### Section 1: Project Setup & Configuration

#### 1.1 Initialize Next.js Project

```bash
# Create new Next.js project
npx create-next-app@latest invoice-generator --typescript --tailwind --eslint --app

# Navigate to project
cd invoice-generator

# Install dependencies
npm install @radix-ui/react-* framer-motion mongoose nodemailer puppeteer
npm install @hookform/resolvers react-hook-form zod date-fns zustand
npm install @types/nodemailer @types/node

# Install ShadCN UI
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input label card form select textarea
```

#### 1.2 Environment Configuration

```env
# .env.local
MONGODB_URI=mongodb://localhost:27017/invoice-generator
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Upload Configuration
UPLOAD_DIR=./public/uploads
MAX_FILE_SIZE=5242880
```

#### 1.3 Database Connection

```typescript
// lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
```

### Section 2: Database Models & Schemas

#### 2.1 User Model

```typescript
// models/User.ts
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    company: {
      name: String,
      address: String,
      phone: String,
      email: String,
      logo: String,
      website: String,
    },
    preferences: {
      currency: { type: String, default: "USD" },
      taxRate: { type: Number, default: 0 },
      invoiceNumberPrefix: { type: String, default: "INV" },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
```

#### 2.2 Invoice Model

```typescript
// models/Invoice.ts
import mongoose from "mongoose";

const ServiceItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  rate: { type: Number, required: true, min: 0 },
  amount: { type: Number, required: true, min: 0 },
});

const InvoiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    invoiceNumber: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["draft", "sent", "paid", "overdue"],
      default: "draft",
    },
    date: { type: Date, required: true },
    dueDate: { type: Date, required: true },

    // Company Info
    company: {
      name: { type: String, required: true },
      address: String,
      phone: String,
      email: String,
      logo: String,
    },

    // Client Info
    client: {
      name: { type: String, required: true },
      email: String,
      phone: String,
      address: String,
    },

    // Items
    items: [ServiceItemSchema],

    // Calculations
    subtotal: { type: Number, required: true },
    taxRate: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },

    // Template & Notes
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: "Template" },
    notes: String,

    // Tracking
    sentAt: Date,
    paidAt: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Invoice ||
  mongoose.model("Invoice", InvoiceSchema);
```

#### 2.3 Template Model

```typescript
// models/Template.ts
import mongoose from "mongoose";

const TemplateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    description: String,
    isDefault: { type: Boolean, default: false },

    styles: {
      primaryColor: { type: String, default: "#3b82f6" },
      secondaryColor: { type: String, default: "#1e40af" },
      fontFamily: { type: String, default: "Inter" },
      layout: {
        type: String,
        enum: ["modern", "classic", "minimal", "corporate"],
        default: "modern",
      },
    },

    customFields: [
      {
        name: String,
        type: { type: String, enum: ["text", "number", "date"] },
        required: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Template ||
  mongoose.model("Template", TemplateSchema);
```

### Section 3: State Management

#### 3.1 Invoice Store

```typescript
// lib/store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
}

interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface InvoiceState {
  // Current invoice data
  invoiceNumber: string;
  date: string;
  dueDate: string;
  company: CompanyInfo;
  client: ClientInfo;
  items: InvoiceItem[];
  notes: string;
  templateId: string;

  // Calculations
  subtotal: number;
  taxRate: number;
  tax: number;
  total: number;

  // Actions
  setInvoiceNumber: (number: string) => void;
  setDates: (date: string, dueDate: string) => void;
  setCompany: (company: CompanyInfo) => void;
  setClient: (client: ClientInfo) => void;
  setItems: (items: InvoiceItem[]) => void;
  addItem: () => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, item: Partial<InvoiceItem>) => void;
  setTaxRate: (rate: number) => void;
  calculateTotals: () => void;
  resetInvoice: () => void;
}

export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set, get) => ({
      // Initial state
      invoiceNumber: "",
      date: new Date().toISOString().split("T")[0],
      dueDate: "",
      company: {
        name: "",
        address: "",
        phone: "",
        email: "",
      },
      client: {
        name: "",
        email: "",
        phone: "",
        address: "",
      },
      items: [],
      notes: "",
      templateId: "",
      subtotal: 0,
      taxRate: 0,
      tax: 0,
      total: 0,

      // Actions
      setInvoiceNumber: (number) => set({ invoiceNumber: number }),

      setDates: (date, dueDate) => set({ date, dueDate }),

      setCompany: (company) => set({ company }),

      setClient: (client) => set({ client }),

      setItems: (items) => {
        set({ items });
        get().calculateTotals();
      },

      addItem: () => {
        const newItem: InvoiceItem = {
          id: crypto.randomUUID(),
          description: "",
          quantity: 1,
          rate: 0,
          amount: 0,
        };
        set({ items: [...get().items, newItem] });
      },

      removeItem: (id) => {
        const items = get().items.filter((item) => item.id !== id);
        set({ items });
        get().calculateTotals();
      },

      updateItem: (id, updatedItem) => {
        const items = get().items.map((item) => {
          if (item.id === id) {
            const updated = { ...item, ...updatedItem };
            updated.amount = updated.quantity * updated.rate;
            return updated;
          }
          return item;
        });
        set({ items });
        get().calculateTotals();
      },

      setTaxRate: (rate) => {
        set({ taxRate: rate });
        get().calculateTotals();
      },

      calculateTotals: () => {
        const { items, taxRate } = get();
        const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
        const tax = subtotal * (taxRate / 100);
        const total = subtotal + tax;

        set({ subtotal, tax, total });
      },

      resetInvoice: () =>
        set({
          invoiceNumber: "",
          date: new Date().toISOString().split("T")[0],
          dueDate: "",
          client: { name: "", email: "", phone: "", address: "" },
          items: [],
          notes: "",
          subtotal: 0,
          tax: 0,
          total: 0,
        }),
    }),
    {
      name: "invoice-storage",
    }
  )
);
```

### Section 4: API Routes Implementation

#### 4.1 Invoice API Routes

```typescript
// app/api/invoices/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Invoice from "@/models/Invoice";
import { getServerSession } from "next-auth";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    const query = { userId: session.user.id };
    if (status) query.status = status;

    const invoices = await Invoice.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("templateId", "name styles");

    const total = await Invoice.countDocuments(query);

    return NextResponse.json({
      invoices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Generate invoice number if not provided
    if (!data.invoiceNumber) {
      const lastInvoice = await Invoice.findOne({
        userId: session.user.id,
      }).sort({ createdAt: -1 });

      const nextNumber = lastInvoice
        ? parseInt(lastInvoice.invoiceNumber.split("-")[2]) + 1
        : 1;

      data.invoiceNumber = `INV-${new Date().getFullYear()}-${nextNumber
        .toString()
        .padStart(3, "0")}`;
    }

    const invoice = new Invoice({
      ...data,
      userId: session.user.id,
    });

    await invoice.save();

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
```

#### 4.2 PDF Generation API

```typescript
// app/api/invoices/[id]/pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import dbConnect from "@/lib/db";
import Invoice from "@/models/Invoice";
import Template from "@/models/Template";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const invoice = await Invoice.findById(params.id).populate("templateId");
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Generate HTML for PDF
    const html = generateInvoiceHTML(invoice);

    // Create PDF using Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html);
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        bottom: "20px",
        left: "20px",
        right: "20px",
      },
    });

    await browser.close();

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

function generateInvoiceHTML(invoice: any): string {
  const template = invoice.templateId || {
    styles: { primaryColor: "#3b82f6" },
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 0; 
          padding: 20px;
          color: #333;
        }
        .header { 
          display: flex; 
          justify-content: space-between; 
          margin-bottom: 40px; 
        }
        .company-info h1 { 
          color: ${template.styles.primaryColor}; 
          margin: 0;
        }
        .invoice-title { 
          font-size: 32px; 
          font-weight: bold; 
          color: ${template.styles.primaryColor}; 
        }
        .invoice-details { 
          margin-top: 10px; 
        }
        .client-info { 
          margin-bottom: 30px; 
        }
        .client-info h3 { 
          color: ${template.styles.primaryColor}; 
          margin-bottom: 10px; 
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-bottom: 30px; 
        }
        th { 
          background-color: ${template.styles.primaryColor}; 
          color: white; 
          padding: 12px; 
          text-align: left; 
        }
        td { 
          padding: 12px; 
          border-bottom: 1px solid #eee; 
        }
        .totals { 
          margin-left: auto; 
          width: 300px; 
        }
        .total-row { 
          display: flex; 
          justify-content: space-between; 
          padding: 8px 0; 
        }
        .final-total { 
          background-color: ${
            template.styles.secondaryColor || template.styles.primaryColor
          }; 
          color: white; 
          padding: 15px; 
          font-weight: bold; 
          font-size: 18px; 
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-info">
          <h1>${invoice.company.name}</h1>
          <div>${invoice.company.address.replace(/\n/g, "<br>")}</div>
          <div>${invoice.company.email}</div>
          <div>${invoice.company.phone}</div>
        </div>
        <div class="invoice-info">
          <div class="invoice-title">INVOICE</div>
          <div class="invoice-details">
            <div><strong>Invoice #:</strong> ${invoice.invoiceNumber}</div>
            <div><strong>Date:</strong> ${new Date(
              invoice.date
            ).toLocaleDateString()}</div>
            <div><strong>Due Date:</strong> ${new Date(
              invoice.dueDate
            ).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
      
      <div class="client-info">
        <h3>Bill To:</h3>
        <div><strong>${invoice.client.name}</strong></div>
        <div>${invoice.client.address.replace(/\n/g, "<br>")}</div>
        <div>${invoice.client.email}</div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Rate</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items
            .map(
              (item) => `
            <tr>
              <td>${item.description}</td>
              <td style="text-align: center;">${item.quantity}</td>
              <td style="text-align: right;">$${item.rate.toFixed(2)}</td>
              <td style="text-align: right;">$${item.amount.toFixed(2)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      
      <div class="totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>$${invoice.subtotal.toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>Tax:</span>
          <span>$${invoice.tax.toFixed(2)}</span>
        </div>
        <div class="total-row final-total">
          <span>Total:</span>
          <span>$${invoice.total.toFixed(2)}</span>
        </div>
      </div>
      
      ${
        invoice.notes
          ? `
        <div style="margin-top: 40px;">
          <h3>Notes:</h3>
          <p>${invoice.notes}</p>
        </div>
      `
          : ""
      }
    </body>
    </html>
  `;
}
```

#### 4.3 Email Service API

```typescript
// app/api/invoices/[id]/send/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import dbConnect from "@/lib/db";
import Invoice from "@/models/Invoice";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { to, subject, message } = await request.json();

    const invoice = await Invoice.findById(params.id);
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Generate PDF (reuse the PDF generation logic)
    const pdfBuffer = await generateInvoicePDF(invoice);

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: to || invoice.client.email,
      subject: subject || `Invoice ${invoice.invoiceNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Invoice ${invoice.invoiceNumber}</h2>
          <p>${message || "Please find attached your invoice."}</p>
          <p>Thank you for your business!</p>
          <hr>
          <p><small>This is an automated message from ${
            invoice.company.name
          }</small></p>
        </div>
      `,
      attachments: [
        {
          filename: `${invoice.invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    // Update invoice status
    await Invoice.findByIdAndUpdate(params.id, {
      status: "sent",
      sentAt: new Date(),
    });

    return NextResponse.json({ message: "Invoice sent successfully" });
  } catch (error) {
    console.error("Email sending failed:", error);
    return NextResponse.json(
      { error: "Failed to send invoice" },
      { status: 500 }
    );
  }
}
```

### Section 5: Main Components Integration

#### 5.1 Dashboard Layout

```typescript
// app/(dashboard)/layout.tsx
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
```

#### 5.2 Invoice Creation Page

```typescript
// app/(dashboard)/invoices/new/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { InvoiceForm } from '@/components/forms/InvoiceForm';
import { InvoicePreview } from '@/components/invoice/InvoicePreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Send, Download, Eye } from 'lucide-react';
import { useInvoiceStore } from '@/lib/store';

export default function NewInvoicePage() {
  const [activeTab, setActiveTab] = useState('form');
  const [isLoading, setIsLoading] = useState(false);
  const invoiceData = useInvoiceStore();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData),
      });

      if (response.ok) {
        const invoice = await response.json();
        // Handle success (redirect, toast, etc.)
      }
    } catch (error) {
      console.error('Failed to save invoice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    // Implement PDF download
  };

  const handleSend = async () => {
    // Implement email sending
  };

  return (
    <div className="container mx-auto py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Create New Invoice</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" onClick={handleSend}>
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Invoice'}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Invoice Form</TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-
```
