// Section 4: Main POST Handler Function
// File: /api/invoices/route.ts (continuation)
// Section 1: Types and Interfaces for Invoice POST API
// File: /api/invoices/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import mongoose, { Types } from "mongoose";

// Request body interface

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  taxRate?: number;
}

// Response interfaces
interface SuccessResponse {
  success: true;
  message: string;
  data: {
    invoiceId: string;
    invoiceNumber: string;
    status: "draft" | "sent" | "paid" | "overdue";
    total: number;
    dueDate: string;
    createdAt: string;
  };
}

interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string>;
}

// Validation error type
interface ValidationError {
  field: string;
  message: string;
}

// Request body interface
interface InvoiceRequestBody {
  companyId: string;
  clientId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceItem[];
  taxRate: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
  currency: string;
  notes?: string;
  terms?: string;
  paymentTerms: number;
  recurring: {
    isRecurring: boolean;
    frequency?: "weekly" | "monthly" | "quarterly" | "yearly";
    nextDate?: string;
    endDate?: string;
  };
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  taxRate?: number;
}

// Database models (assuming you have these)
interface IInvoice {
  _id?: Types.ObjectId;
  companyId: Types.ObjectId;
  clientId: Types.ObjectId;
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
    frequency?: string;
    nextDate?: Date;
    endDate?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Section 2: Input Validation Functions
function validateInvoiceData(data: InvoiceRequestBody): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields validation
  if (!data.companyId?.trim()) {
    errors.push({ field: "companyId", message: "Company ID is required" });
  }

  if (!data.clientId?.trim()) {
    errors.push({ field: "clientId", message: "Client ID is required" });
  }

  if (!data.invoiceNumber?.trim()) {
    errors.push({
      field: "invoiceNumber",
      message: "Invoice number is required",
    });
  }

  if (!data.invoiceDate) {
    errors.push({ field: "invoiceDate", message: "Invoice date is required" });
  }

  if (!data.dueDate) {
    errors.push({ field: "dueDate", message: "Due date is required" });
  }

  // Validate ObjectId format
  if (data.companyId && !mongoose.Types.ObjectId.isValid(data.companyId)) {
    errors.push({ field: "companyId", message: "Invalid company ID format" });
  }

  if (data.clientId && !mongoose.Types.ObjectId.isValid(data.clientId)) {
    errors.push({ field: "clientId", message: "Invalid client ID format" });
  }

  // Validate dates
  if (data.invoiceDate && isNaN(Date.parse(data.invoiceDate))) {
    errors.push({
      field: "invoiceDate",
      message: "Invalid invoice date format",
    });
  }

  if (data.dueDate && isNaN(Date.parse(data.dueDate))) {
    errors.push({ field: "dueDate", message: "Invalid due date format" });
  }

  // Validate due date is after invoice date
  if (data.invoiceDate && data.dueDate) {
    const invoiceDate = new Date(data.invoiceDate);
    const dueDate = new Date(data.dueDate);
    if (dueDate <= invoiceDate) {
      errors.push({
        field: "dueDate",
        message: "Due date must be after invoice date",
      });
    }
  }

  // Validate items array
  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    errors.push({ field: "items", message: "At least one item is required" });
  } else {
    data.items.forEach((item, index) => {
      if (!item.description?.trim()) {
        errors.push({
          field: `items[${index}].description`,
          message: "Item description is required",
        });
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push({
          field: `items[${index}].quantity`,
          message: "Item quantity must be greater than 0",
        });
      }
      if (item.rate < 0) {
        errors.push({
          field: `items[${index}].rate`,
          message: "Item rate cannot be negative",
        });
      }
    });
  }

  // Validate numeric fields
  if (data.taxRate < 0 || data.taxRate > 100) {
    errors.push({
      field: "taxRate",
      message: "Tax rate must be between 0 and 100",
    });
  }

  if (data.discountValue < 0) {
    errors.push({
      field: "discountValue",
      message: "Discount value cannot be negative",
    });
  }

  if (data.discountType === "percentage" && data.discountValue > 100) {
    errors.push({
      field: "discountValue",
      message: "Percentage discount cannot exceed 100%",
    });
  }

  if (data.paymentTerms < 0) {
    errors.push({
      field: "paymentTerms",
      message: "Payment terms cannot be negative",
    });
  }

  if (data.total < 0) {
    errors.push({ field: "total", message: "Total amount cannot be negative" });
  }

  // Validate recurring settings
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
    if (data.recurring.nextDate && isNaN(Date.parse(data.recurring.nextDate))) {
      errors.push({
        field: "recurring.nextDate",
        message: "Invalid next date format",
      });
    }
    if (data.recurring.endDate && isNaN(Date.parse(data.recurring.endDate))) {
      errors.push({
        field: "recurring.endDate",
        message: "Invalid end date format",
      });
    }
  }

  return errors;
}

// Section 3: Database Operations
async function verifyCompanyExists(companyId: string): Promise<boolean> {
  try {
    // Replace with your actual Company model
    const CompanyModel =
      mongoose.models.Company ||
      mongoose.model(
        "Company",
        new mongoose.Schema({
          name: String,
          email: String,
          status: String,
        })
      );

    const company = await CompanyModel.findById(companyId).exec();
    return company !== null;
  } catch (error) {
    console.error("Error verifying company:", error);
    return false;
  }
}

async function verifyClientExists(clientId: string): Promise<boolean> {
  try {
    // Replace with your actual Client model
    const ClientModel =
      mongoose.models.Client ||
      mongoose.model(
        "Client",
        new mongoose.Schema({
          name: String,
          email: String,
          status: String,
        })
      );

    const client = await ClientModel.findById(clientId).exec();
    return client !== null && client.status === "active";
  } catch (error) {
    console.error("Error verifying client:", error);
    return false;
  }
}

async function checkInvoiceNumberExists(
  invoiceNumber: string
): Promise<boolean> {
  try {
    // Replace with your actual Invoice model
    const InvoiceModel =
      mongoose.models.Invoice ||
      mongoose.model(
        "Invoice",
        new mongoose.Schema({
          invoiceNumber: String,
          companyId: mongoose.Schema.Types.ObjectId,
          clientId: mongoose.Schema.Types.ObjectId,
          status: String,
        })
      );

    const existingInvoice = await InvoiceModel.findOne({
      invoiceNumber,
    }).exec();
    return existingInvoice !== null;
  } catch (error) {
    console.error("Error checking invoice number:", error);
    return false;
  }
}

async function createInvoice(data: InvoiceRequestBody): Promise<IInvoice> {
  try {
    // Replace with your actual Invoice model
    const InvoiceModel =
      mongoose.models.Invoice ||
      mongoose.model(
        "Invoice",
        new mongoose.Schema(
          {
            companyId: { type: mongoose.Schema.Types.ObjectId, required: true },
            clientId: { type: mongoose.Schema.Types.ObjectId, required: true },
            invoiceNumber: { type: String, required: true, unique: true },
            invoiceDate: { type: Date, required: true },
            dueDate: { type: Date, required: true },
            items: [
              {
                description: String,
                quantity: Number,
                rate: Number,
                amount: Number,
                taxRate: Number,
              },
            ],
            subtotal: { type: Number, required: true },
            taxRate: { type: Number, default: 0 },
            taxAmount: { type: Number, default: 0 },
            discountType: {
              type: String,
              enum: ["percentage", "fixed"],
              default: "percentage",
            },
            discountValue: { type: Number, default: 0 },
            discountAmount: { type: Number, default: 0 },
            total: { type: Number, required: true },
            currency: { type: String, default: "USD" },
            notes: String,
            terms: String,
            paymentTerms: { type: Number, required: true },
            status: {
              type: String,
              enum: ["draft", "sent", "paid", "overdue"],
              default: "draft",
            },
            paidAmount: { type: Number, default: 0 },
            recurring: {
              isRecurring: { type: Boolean, default: false },
              frequency: String,
              nextDate: Date,
              endDate: Date,
            },
          },
          { timestamps: true }
        )
      );

    const invoiceData = {
      companyId: new mongoose.Types.ObjectId(data.companyId),
      clientId: new mongoose.Types.ObjectId(data.clientId),
      invoiceNumber: data.invoiceNumber,
      invoiceDate: new Date(data.invoiceDate),
      dueDate: new Date(data.dueDate),
      items: data.items,
      subtotal: data.subtotal,
      taxRate: data.taxRate,
      taxAmount: data.taxAmount,
      discountType: data.discountType,
      discountValue: data.discountValue,
      discountAmount: data.discountAmount,
      total: data.total,
      currency: data.currency,
      notes: data.notes,
      terms: data.terms,
      paymentTerms: data.paymentTerms,
      status: "draft" as const,
      paidAmount: 0,
      recurring: data.recurring.isRecurring
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
    };

    const newInvoice = new InvoiceModel(invoiceData);
    const savedInvoice = await newInvoice.save();

    return savedInvoice;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    // Connect to database
    await dbConnect();

    // Parse request body
    let requestBody: InvoiceRequestBody;
    try {
      requestBody = await request.json();
    } catch (error) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          message: "Invalid JSON in request body",
        },
        { status: 400 }
      );
    }

    // Validate input data
    const validationErrors = validateInvoiceData(requestBody);
    if (validationErrors.length > 0) {
      const errorMap = validationErrors.reduce((acc, error) => {
        acc[error.field] = error.message;
        return acc;
      }, {} as Record<string, string>);

      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          message: "Validation failed",
          errors: errorMap,
        },
        { status: 400 }
      );
    }

    // Check if company exists
    const companyExists = await verifyCompanyExists(requestBody.companyId);
    if (!companyExists) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          message: "Company not found",
        },
        { status: 404 }
      );
    }

    // Check if client exists and is active
    const clientExists = await verifyClientExists(requestBody.clientId);
    if (!clientExists) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          message: "Client not found or inactive",
        },
        { status: 404 }
      );
    }

    // Check if invoice number already exists
    const invoiceNumberExists = await checkInvoiceNumberExists(
      requestBody.invoiceNumber
    );
    if (invoiceNumberExists) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          message: "Invoice number already exists",
        },
        { status: 409 }
      );
    }

    // Create the invoice
    const newInvoice = await createInvoice(requestBody);

    // Prepare success response
    const successResponse: SuccessResponse = {
      success: true,
      message: "Invoice created successfully",
      data: {
        invoiceId: newInvoice._id!.toString(),
        invoiceNumber: newInvoice.invoiceNumber,
        status: newInvoice.status,
        total: newInvoice.total,
        dueDate: newInvoice.dueDate.toISOString(),
        createdAt: newInvoice.createdAt.toISOString(),
      },
    };

    return NextResponse.json<SuccessResponse>(successResponse, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/invoices:", error);

    // Handle specific database errors
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          message: "Database validation error",
          errors: Object.keys(error.errors).reduce((acc, key) => {
            acc[key] = error.errors[key].message;
            return acc;
          }, {} as Record<string, string>),
        },
        { status: 400 }
      );
    }

    if (error instanceof mongoose.Error.CastError) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          message: "Invalid ID format",
        },
        { status: 400 }
      );
    }

    // Handle duplicate key error (invoice number)
    if (error.code === 11000) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          message: "Invoice number already exists",
        },
        { status: 409 }
      );
    }

    // Generic server error
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// Optional: GET handler for fetching invoices
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const companyId = searchParams.get("companyId");

    // Build query
    const query: any = {};
    if (status) query.status = status;
    if (companyId) query.companyId = companyId;

    // Replace with your actual Invoice model
    const InvoiceModel = mongoose.models.Invoice;

    if (!InvoiceModel) {
      return NextResponse.json(
        { success: false, message: "Invoice model not found" },
        { status: 500 }
      );
    }

    const invoices = await InvoiceModel.find(query)
      .populate("companyId", "name email")
      .populate("clientId", "name email company")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const total = await InvoiceModel.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        invoices,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error in GET /api/invoices:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
