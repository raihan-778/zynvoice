import DBConnect from "@/lib/database/connection";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await DBConnect();
    const templates = await InvoiceTemplate.find().sort({
      isDefault: -1,
      createdAt: -1,
    });
    return NextResponse.json(templates);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    const template = new InvoiceTemplate({
      ...data,
      isDefault: false,
      createdAt: new Date(),
    });

    await template.save();
    return NextResponse.json(template);
  } catch {
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }
}
