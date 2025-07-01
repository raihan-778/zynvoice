// app/api/invoices/next-number/route.ts
import { NextRequest, NextResponse } from "next/server";

interface NextNumberResponse {
  invoiceNumber: string;
}

export async function GET(request: NextRequest) {
  try {
    const currentYear = new Date().getFullYear();
    const lastInvoiceNumber = await getLastInvoiceNumber(currentYear);
    const nextNumber = generateNextInvoiceNumber(
      lastInvoiceNumber,
      currentYear
    );

    const response: ApiResponse<NextNumberResponse> = {
      success: true,
      data: { invoiceNumber: nextNumber },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Next Invoice Number Error:", error);

    const errorResponse: ApiResponse<NextNumberResponse> = {
      success: false,
      message: "Internal server error",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

function generateNextInvoiceNumber(
  lastNumber: string | null,
  year: number
): string {
  const prefix = `INV-${year}-`;

  if (!lastNumber || !lastNumber.startsWith(prefix)) {
    return `${prefix}001`;
  }

  const lastSequence = parseInt(lastNumber.split("-")[2]) || 0;
  const nextSequence = (lastSequence + 1).toString().padStart(3, "0");

  return `${prefix}${nextSequence}`;
}

async function getLastInvoiceNumber(year: number): Promise<string | null> {
  // Replace with your database query
  // Example with Prisma:
  // const lastInvoice = await prisma.invoice.findFirst({
  //   where: {
  //     invoiceNumber: { startsWith: `INV-${year}-` }
  //   },
  //   orderBy: { invoiceNumber: 'desc' }
  // });
  // return lastInvoice?.invoiceNumber || null;

  return `INV-${year}-005`; // Mock data
}
