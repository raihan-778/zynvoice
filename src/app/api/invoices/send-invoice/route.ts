import { authOptions } from "@/lib/auth/auth.config";
import DBConnect from "@/lib/database/connection";
import {
  InvoiceFormData,
  InvoiceFormDataSchema,
} from "@/lib/validations/validation";

import InvoiceModel from "@/models/Invoice";
import { ApiResponse, InvoiceCreateResponse } from "@/types/apiResponse";

// Assuming you have a Mongoose model for invoices
import mongoose, { Types } from "mongoose";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Types and Interfaces
interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  taxRate?: number;
}

interface ProcessedInvoiceData {
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountAmount: number;
  total: number;
  currency: string;
  notes?: string;
  terms?: string;
  paymentTerms: number;
  status: "draft" | "sent" | "paid" | "overdue";
  paidAmount: number;
  recurring?: {
    isRecurring: boolean;
    frequency?: "weekly" | "monthly" | "quarterly" | "yearly";
    nextDate?: Date;
    endDate?: Date;
  };
  userId: mongoose.Types.ObjectId;
}

// Helper Functions
function processInvoiceCalculations(
  data: InvoiceFormData
): ProcessedInvoiceData {
  // Type assertion to ensure data is of the expected shape
  const invoiceData = data as unknown as Omit<
    ProcessedInvoiceData,
    | "subtotal"
    | "taxAmount"
    | "discountAmount"
    | "total"
    | "status"
    | "paidAmount"
  >;

  // Calculate subtotal from items
  const subtotal = invoiceData.items.reduce(
    (sum: number, item: InvoiceItem) => {
      const itemAmount = item.quantity * item.rate;
      return sum + itemAmount;
    },
    0
  );

  // Calculate discount amount
  let discountAmount = 0;
  const typedData = data as unknown as ProcessedInvoiceData;
  if (typedData.discountType === "percentage") {
    discountAmount = (subtotal * typedData.discountValue) / 100;
  } else {
    discountAmount = typedData.discountValue;
  }

  // Calculate tax amount (applied after discount)
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * typedData.taxRate) / 100;

  // Calculate total
  const total = taxableAmount + taxAmount;

  // Process items with calculated amounts
  const items = (data as { items: InvoiceItem[] }).items;
  const processedItems = items.map((item: InvoiceItem) => ({
    ...item,
    amount: item.quantity * item.rate,
  }));

  return {
    ...data,
    items: processedItems,
    subtotal: Math.round(subtotal * 100) / 100, // Round to 2 decimal places
    taxAmount: Math.round(taxAmount * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
    status: "draft" as const,
    paidAmount: 0,
    invoiceDate: new Date(data.invoiceDate),
    dueDate: new Date(data.dueDate),
    recurring: data.recurring?.isRecurring
      ? {
          isRecurring: data.recurring.isRecurring,
          frequency: data.recurring.frequency,
          nextDate: data.recurring.nextDate
            ? new Date(data.recurring.nextDate)
            : undefined,
          endDate: data.recurring.endDate
            ? new Date(data.recurring.endDate)
            : undefined,
        }
      : { isRecurring: false },
    userId: new Types.ObjectId(data.userId),
  };
}

async function saveInvoice(invoiceData: ProcessedInvoiceData) {
  try {
    const newInvoice = new InvoiceModel(invoiceData);
    const savedInvoice = await newInvoice.save();
    return savedInvoice;
  } catch (error) {
    console.error("Error saving invoice:", error);
    throw error;
  }
}

// Business Validation Functions
async function performBusinessValidations(
  data: InvoiceFormData,
  userId: string
): Promise<Array<{ field: string; message: string }>> {
  const errors: Array<{ field: string; message: string }> = [];

  try {
    // Validate dates
    const invoiceDate = new Date(data.invoiceDate);
    const dueDate = new Date(data.dueDate);

    if (dueDate <= invoiceDate) {
      errors.push({
        field: "dueDate",
        message: "Due date must be after invoice date",
      });
    }

    // Validate items calculations
    if (data.items && data.items.length > 0) {
      data.items.forEach((item, index) => {
        const calculatedAmount = item.quantity * item.rate;
        if (
          Math.abs(calculatedAmount - (item.amount || calculatedAmount)) > 0.01
        ) {
          errors.push({
            field: `items[${index}].amount`,
            message: "Item amount does not match quantity × rate",
          });
        }
      });
    }

    // Validate recurring invoice settings
    if (data.recurring?.isRecurring) {
      if (!data.recurring.frequency) {
        errors.push({
          field: "recurring.frequency",
          message: "Frequency is required for recurring invoices",
        });
      }
      if (!data.recurring.nextDate) {
        errors.push({
          field: "recurring.nextDate",
          message: "Next date is required for recurring invoices",
        });
      }
      if (
        data.recurring.nextDate &&
        new Date(data.recurring.nextDate) <= new Date()
      ) {
        errors.push({
          field: "recurring.nextDate",
          message: "Next date must be in the future",
        });
      }
    }

    // Validate discount settings
    if (data.discountType === "percentage" && data.discountValue > 100) {
      errors.push({
        field: "discountValue",
        message: "Percentage discount cannot exceed 100%",
      });
    }

    // Check for invoice number uniqueness within user's invoices
    const existingInvoice = await InvoiceModel.findOne({
      invoiceNumber: data.invoiceNumber,
      userId: userId,
    });

    if (existingInvoice) {
      errors.push({
        field: "invoiceNumber",
        message: "Invoice number already exists",
      });
    }
  } catch (error) {
    console.error("Business validation error:", error);
    errors.push({ field: "general", message: "Validation error occurred" });
  }

  return errors;
}
// POST Handler - Create Invoice
export async function POST(request: NextRequest) {
  await DBConnect();
  const session = await getServerSession(authOptions);
  const _user = session?.user as User;

  console.log("Session:", session ? "Found" : "Not found");

  // if (!session || !_user) {
  //   return NextResponse.json(
  //     { success: false, message: "Not authenticated" },
  //     { status: 401 }
  //   );
  // }

  try {
    const body = await request.json();
    const validation = InvoiceFormDataSchema.safeParse(body);

    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach((error) => {
        const path = error.path.join(".");
        errors[path] = error.message;
      });

      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors,
        } as ApiResponse<InvoiceCreateResponse>,
        { status: 400 }
      );
    }

    const invoiceData = validation.data;
    console.log("api", invoiceData);

    // Check for duplicate invoice number for the same user
    const existing = await InvoiceModel.findOne({
      invoiceNumber: invoiceData.invoiceNumber,
      // userId: _user._id,
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Invoice number already exists",
          errors: { invoiceNumber: "This invoice number is already in use" },
        },
        { status: 409 }
      );
    }

    // Additional business validations
    const businessValidationErrors = await performBusinessValidations(
      invoiceData
      // _user._id as string
    );
    if (businessValidationErrors.length > 0) {
      const errors: Record<string, string> = {};
      businessValidationErrors.forEach((error) => {
        errors[error.field] = error.message;
      });

      return NextResponse.json(
        {
          success: false,
          message: "Business validation failed",
          errors,
        },
        { status: 400 }
      );
    }

    // Calculate invoice totals and process data
    const processedInvoice = processInvoiceCalculations(invoiceData);

    // Save to DB
    const savedInvoice = await saveInvoice({
      ...processedInvoice,
      // userId: new mongoose.Types.ObjectId(_user._id as string),
    });

    // Format response data
    const responseData = {
      invoice: {
        id: savedInvoice._id.toString(),
        invoiceNumber: savedInvoice.invoiceNumber,
        status: savedInvoice.status,
        total: savedInvoice.total,
        dueDate: savedInvoice.dueDate.toISOString(),
        createdAt: savedInvoice.createdAt.toISOString(),
      },
    };

    return NextResponse.json(
      {
        success: true,
        message: "Invoice created successfully",
        data: responseData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Invoice Creation Error:", error);

    // Handle specific MongoDB errors
    if (error instanceof mongoose.Error.ValidationError) {
      const errors: Record<string, string> = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });

      return NextResponse.json(
        {
          success: false,
          message: "Database validation failed",
          errors,
        },
        { status: 400 }
      );
    }

    if (
      error instanceof mongoose.Error &&
      error.message.includes("duplicate key")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invoice number already exists",
          errors: { invoiceNumber: "This invoice number is already in use" },
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
