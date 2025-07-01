import { NextRequest, NextResponse } from "next/server";
import type { Company, ApiResponse } from "@/types/invoice";

interface CompaniesResponse {
  companies: Company[];
}

export async function GET(request: NextRequest) {
  try {
    // Replace with your database query
    const companies: Company[] = [
      {
        id: 1,
        name: "Acme Corp",
        address: "123 Business St, City, State 12345",
        email: "billing@acme.com",
        phone: "+1-555-0123",
        taxId: "TAX123456",
      },
      {
        id: 2,
        name: "Tech Solutions",
        address: "456 Tech Ave, Tech City, State 67890",
        email: "accounts@techsol.com",
        phone: "+1-555-0456",
        taxId: "TAX789012",
      },
      {
        id: 3,
        name: "Global Industries",
        address: "789 Global Blvd, Global City, State 11111",
        email: "finance@global.com",
        phone: "+1-555-0789",
        taxId: "TAX345678",
      },
    ];

    const response: ApiResponse<CompaniesResponse> = {
      success: true,
      data: { companies },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Companies API Error:", error);

    const errorResponse: ApiResponse<CompaniesResponse> = {
      success: false,
      message: "Internal server error",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
