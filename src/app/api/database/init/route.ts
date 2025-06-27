// / 📁 src/app/api/db/init/route.ts

import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/db-utils";

export async function POST(request: NextRequest) {
  try {
    await DatabaseService.seedDefaultData();

    return NextResponse.json(
      {
        message: "Database initialized successfully",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database initialization error:", error);

    return NextResponse.json(
      {
        error: "Failed to initialize database",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const stats = await DatabaseService.healthCheck();

    return NextResponse.json(
      {
        status: "healthy",
        stats,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database health check error:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
