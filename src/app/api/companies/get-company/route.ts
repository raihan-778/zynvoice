import { CompanyInfo } from "@/lib/validations/validation";
import { ApiResponse } from "@/types/apiResponse";
import { NextRequest, NextResponse } from "next/server";

interface CompaniesResponse {
  companies: CompanyInfo[];
}

export async function GET(request: NextRequest) {
  try {
    // Replace with your database query
    const companies: CompanyInfo[] = [
      {
        _id: "1",
        name: "Acme Corp",
        address: "123 Business St, City, State 12345",
        contact: {
          email: "billing@acme.com",
          phone: "+1-555-0123",
        },
      },
      {
        _id: "2",
        name: "Tech Solutions",
        address: "456 Tech Ave, Tech City, State 67890",

        contact: {
          phone: "+1-555-0456",
          email: "accounts@techsol.com",
        },
      },
      {
        _id: "3",
        name: "Global Industries",
        address: "789 Global Blvd, Global City, State 11111",
        contact: {
          email: "finance@global.com",
          phone: "+1-555-0789",
        },
      },
    ];

    const response: ApiResponse<CompaniesResponse> = {
      success: true,
      message: "Company Data Retrived Successfully",
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
