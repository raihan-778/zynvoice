import { NextRequest, NextResponse } from "next/server";

import { ClientInfo, ClientSearchSchema } from "@/lib/validations/validation";
import { ApiResponse } from "@/types/apiResponse";

interface ClientsResponse {
  clients: ClientInfo[];
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
    const allClients: ClientInfo[] = [
      {
        _id: "1",
        name: "John Doe",
        email: "john@example.com",
        address: {
          street: "789 Client Rd",
          city: "Boston",
          state: "MA",
          zipCode: "02101",
          country: "USA",
        },
      },
      {
        _id: "2",
        name: "Jane Smith",
        email: "jane@business.com",
        address: {
          street: "321 Business Blvd",
          city: "Chicago",
          state: "IL",
          zipCode: "60601",
          country: "USA",
        },
      },
      {
        _id: "3",
        name: "Bob Johnson",
        email: "bob@startup.com",
        address: {
          street: "654 Startup St",
          city: "Austin",
          state: "TX",
          zipCode: "73301",
          country: "USA",
        },
      },
    ];

    const filteredClients = allClients
      .filter(
        (client) =>
          client.name.toLowerCase().includes(search.toLowerCase()) ||
          client.email?.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, limit);

    const response: ApiResponse<ClientsResponse> = {
      success: true,
      message: "Client Data Retrived Successfully",
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
