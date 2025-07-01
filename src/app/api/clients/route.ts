import { NextRequest, NextResponse } from "next/server";
import type { Client, ApiResponse } from "@/types/invoice";
import { ClientSearchSchema } from "@/lib/validations/validation";

interface ClientsResponse {
  clients: Client[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      search: searchParams.get("search") || undefined,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : undefined,
    };

    const validation = ClientSearchSchema.safeParse(queryParams);

    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach((error) => {
        const path = error.path.join(".");
        errors[path] = error.message;
      });

      return NextResponse.json(
        {
          success: false,
          message: "Invalid query parameters",
          errors,
        } as ApiResponse<ClientsResponse>,
        { status: 400 }
      );
    }

    const { search = "", limit = 50 } = validation.data;

    // Replace with your database query
    const allClients: Client[] = [
      {
        id: 1,
        name: "John Smith",
        email: "john@example.com",
        company: "Smith LLC",
        phone: "+1-555-1001",
        address: "123 Client St, City, State 12345",
      },
      {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah@corp.com",
        company: "Johnson Corp",
        phone: "+1-555-1002",
        address: "456 Business Ave, City, State 67890",
      },
      {
        id: 3,
        name: "Mike Davis",
        email: "mike@startup.io",
        company: "Davis Startup",
        phone: "+1-555-1003",
        address: "789 Startup Blvd, Tech City, State 11111",
      },
      {
        id: 4,
        name: "Emily Wilson",
        email: "emily@design.com",
        company: "Wilson Design",
        phone: "+1-555-1004",
        address: "321 Design Ave, Creative City, State 22222",
      },
    ];

    const filteredClients = allClients
      .filter(
        (client) =>
          client.name.toLowerCase().includes(search.toLowerCase()) ||
          client.email.toLowerCase().includes(search.toLowerCase()) ||
          client.company.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, limit);

    const response: ApiResponse<ClientsResponse> = {
      success: true,
      data: { clients: filteredClients },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Clients API Error:", error);

    const errorResponse: ApiResponse<ClientsResponse> = {
      success: false,
      message: "Internal server error",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
