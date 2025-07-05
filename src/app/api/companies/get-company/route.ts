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

// import { NextRequest, NextResponse } from "next/server";

// import { ClientInfo, ClientSearchSchema } from "@/lib/validations/validation";
// import { ApiResponse } from "@/types/apiResponse";
// import { ClientsResponse } from "@/types/database";
// import { promises as fs } from "fs";
// import path from "path";

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const queryParams = {
//       search: searchParams.get("search") || undefined,
//       limit: searchParams.get("limit")
//         ? parseInt(searchParams.get("limit")!)
//         : undefined,
//     };

//     const validation = CompanyInfoSchema.safeParse(queryParams);

//     if (!validation.success) {
//       const errors: Record<string, string> = {};
//       validation.error.errors.forEach((error) => {
//         const path = error.path.join(".");
//         errors[path] = error.message;
//       });

//       return NextResponse.json(
//         {
//           success: false,
//           message: "Invalid query parameters",
//           errors,
//         } as ApiResponse<ClientsResponse>,
//         { status: 400 }
//       );
//     }

//     const { search = "", limit = 50 } = validation.data;

//     // Read the JSON file from the public folder
//     const filePath = path.join(process.cwd(), "public", "clientInfo.json");
//     const fileContents = await fs.readFile(filePath, "utf-8");
//     const allClients = JSON.parse(fileContents);

//     // Filter clients based on the search query
//     const filteredClients = allClients.filter((client: ClientInfo) =>
//       client.name.toLowerCase().includes(search.toLowerCase())
//     );

//     // Limit the number of clients returned
//     const limitedClients = filteredClients.slice(0, limit);

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Clients retrieved successfully",
//         data: limitedClients,
//       } as ApiResponse<ClientsResponse>,
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to retrieve clients",
//         errors: { general: "An unexpected error occurred" },
//       } as ApiResponse<ClientsResponse>,
//       { status: 500 }
//     );
//   }
// }
