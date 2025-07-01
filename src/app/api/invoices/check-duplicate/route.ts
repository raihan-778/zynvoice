// app/api/invoices/check-duplicate/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types/invoice";

interface DuplicateCheckResponse {
  exists: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoiceNumber } = body;

    if (!invoiceNumber || typeof invoiceNumber !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Invoice number is required",
        } as ApiResponse<DuplicateCheckResponse>,
        { status: 400 }
      );
    }

    const exists = await checkInvoiceExists(invoiceNumber);

    const response: ApiResponse<DuplicateCheckResponse> = {
      success: true,
      data: { exists },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Duplicate Check Error:", error);

    const errorResponse: ApiResponse<DuplicateCheckResponse> = {
      success: false,
      message: "Internal server error",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

async function checkInvoiceExists(invoiceNumber: string): Promise<boolean> {
  // Replace with your database query
  // Example with Prisma:
  // const count = await prisma.invoice.count({
  //   where: { invoiceNumber }
  // });
  // return count > 0;

  const mockExistingNumbers = ["INV-2025-001", "INV-2025-002", "INV-2025-003"];
  return mockExistingNumbers.includes(invoiceNumber);
}

/
