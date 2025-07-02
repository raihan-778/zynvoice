import { InvoiceCreateResponse } from "@/types/custom";
import { authOptions } from "@/lib/auth/auth.config";
import DBConnect from "@/lib/database/connection";
import { InvoiceSchema } from "@/lib/validations/validation";
import InvoiceModel from "@/models/Invoice";
import { ApiResponse } from "@/types/apiResponse";

// Assuming you have a Mongoose model for invoices
import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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

  const userId = new mongoose.Types.ObjectId(_user._id);

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [invoices, total] = await Promise.all([
      InvoiceModel.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      InvoiceModel.countDocuments({ userId }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          invoices,
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
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
    const validation = InvoiceSchema.safeParse(body);

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

    // Calculate invoice totals
    const processedInvoice = processInvoiceCalculations(invoiceData);

    // Save to DB
    const savedInvoice = await saveInvoice({
      ...processedInvoice,
      userId: new mongoose.Types.ObjectId(_user._id),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Invoice created successfully",
        data: { invoice: savedInvoice },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Invoice Creation Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
