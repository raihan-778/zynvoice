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
    data.items.forEach(
      (
        item: { description: string; quantity: number; rate: number },
        index: unknown
      ) => {
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
      }
    );
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
// GET Handler - Enhanced Invoice Retrieval with Filtering
export async function GET(request: NextRequest) {
  await DBConnect();
  const session = await getServerSession(authOptions);
  const _user = session?.user as User;

  if (!session || !_user) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(_user._id as string);

  try {
    const { searchParams } = new URL(request.url);

    // Pagination parameters
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10"))
    );
    const skip = (page - 1) * limit;

    // Build query filter
    const filter: Record<string, unknown> = { userId };

    // Status filter - supports multiple statuses
    const status = searchParams.get("status");
    if (status) {
      const statusArray = status
        .split(",")
        .map((s) => s.trim())
        .filter((s) => ["draft", "sent", "paid", "overdue"].includes(s));
      if (statusArray.length === 1) {
        filter.status = statusArray[0];
      } else if (statusArray.length > 1) {
        filter.status = { $in: statusArray };
      }
    }

    // Invoice number search (partial match)
    const invoiceNumber = searchParams.get("invoiceNumber");
    if (invoiceNumber) {
      filter.invoiceNumber = { $regex: invoiceNumber, $options: "i" };
    }

    // Date range filter
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const dateField = searchParams.get("dateField") || "invoiceDate"; // invoiceDate, dueDate, createdAt

    if (startDate || endDate) {
      filter[dateField] = {};
      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) {
          (filter[dateField] as Record<string, unknown>).$gte = start;
        }
      }
      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) {
          // Set end date to end of day
          end.setHours(23, 59, 59, 999);
          (filter[dateField] as Record<string, unknown>).$lte = end;
        }
      }
    }

    // Amount range filter
    const minAmount = searchParams.get("minAmount");
    const maxAmount = searchParams.get("maxAmount");
    if (minAmount || maxAmount) {
      filter.total = {};
      if (minAmount && !isNaN(parseFloat(minAmount))) {
        (filter.total as Record<string, unknown>).$gte = parseFloat(minAmount);
      }
      if (maxAmount && !isNaN(parseFloat(maxAmount))) {
        (filter.total as Record<string, unknown>).$lte = parseFloat(maxAmount);
      }
    }

    // Recurring filter
    const isRecurring = searchParams.get("isRecurring");
    if (
      isRecurring !== null &&
      (isRecurring === "true" || isRecurring === "false")
    ) {
      filter["recurring.isRecurring"] = isRecurring === "true";
    }

    // Search in multiple fields
    const search = searchParams.get("search");
    if (search) {
      filter.$or = [
        { invoiceNumber: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } },
        { terms: { $regex: search, $options: "i" } },
        { "items.description": { $regex: search, $options: "i" } },
      ];
    }

    // Currency filter
    const currency = searchParams.get("currency");
    if (currency) {
      filter.currency = currency.toUpperCase();
    }

    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const allowedSortFields = [
      "createdAt",
      "invoiceDate",
      "dueDate",
      "total",
      "status",
      "invoiceNumber",
      "updatedAt",
    ];

    const sort: Record<string, 1 | -1> = {};
    if (allowedSortFields.includes(sortBy)) {
      sort[sortBy] = sortOrder as 1 | -1;
    } else {
      sort.createdAt = -1; // Default sort
    }

    // Include/exclude fields
    const includeFields = searchParams.get("fields");
    const projection: Record<string, number> = {};
    if (includeFields) {
      const fields = includeFields.split(",").map((f) => f.trim());
      fields.forEach((field) => {
        projection[field] = 1;
      });
      // Always include essential fields
      projection._id = 1;
      projection.userId = 1;
    }

    // Execute main query
    const invoiceQuery = InvoiceModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    if (Object.keys(projection).length > 0) {
      invoiceQuery.select(projection);
    }

    // Execute parallel queries
    const [invoices, total, summaryStats] = await Promise.all([
      invoiceQuery.lean(),
      InvoiceModel.countDocuments(filter),
      // Get summary statistics
      InvoiceModel.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$total" },
            totalPaid: { $sum: "$paidAmount" },
            totalOutstanding: {
              $sum: { $subtract: ["$total", "$paidAmount"] },
            },
            statusCounts: {
              $push: {
                status: "$status",
                count: 1,
                amount: "$total",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            totalAmount: 1,
            totalPaid: 1,
            totalOutstanding: 1,
            statusBreakdown: {
              $reduce: {
                input: "$statusCounts",
                initialValue: {},
                in: {
                  $mergeObjects: [
                    "$$value",
                    {
                      $arrayToObject: [
                        [
                          {
                            k: "$$this.status",
                            v: {
                              $add: [
                                {
                                  $ifNull: [
                                    {
                                      $getField: {
                                        field: "$$this.status",
                                        input: "$$value",
                                      },
                                    },
                                    0,
                                  ],
                                },
                                1,
                              ],
                            },
                          },
                        ],
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      ]),
    ]);

    // Format response
    const response = {
      success: true,
      data: {
        invoices,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
        summary: summaryStats[0] || {
          totalAmount: 0,
          totalPaid: 0,
          totalOutstanding: 0,
          statusBreakdown: {},
        },
        filters: {
          status: status?.split(",") || [],
          invoiceNumber,
          startDate,
          endDate,
          dateField,
          minAmount: minAmount ? parseFloat(minAmount) : null,
          maxAmount: maxAmount ? parseFloat(maxAmount) : null,
          isRecurring:
            isRecurring === "true"
              ? true
              : isRecurring === "false"
              ? false
              : null,
          search,
          currency,
          sortBy,
          sortOrder: sortOrder === 1 ? "asc" : "desc",
        },
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Get Invoices Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
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

// POST Handler - Create Invoice
export async function POST(request: NextRequest) {
  await DBConnect();
  const session = await getServerSession(authOptions);
  const _user = session?.user as User;

  if (!session || !_user) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

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

    // Check for duplicate invoice number for the same user
    const existing = await InvoiceModel.findOne({
      invoiceNumber: invoiceData.invoiceNumber,
      userId: _user._id,
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
      invoiceData,
      _user._id as string
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
      userId: new mongoose.Types.ObjectId(_user._id as string),
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
