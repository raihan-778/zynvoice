// app/api/templates/[id]/route.ts
import { connectDB } from "@/lib/mongodb";
import { InvoiceTemplate } from "@/models/InvoiceTemplate";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const template = await InvoiceTemplate.findById(params.id);
    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    if (template.isDefault) {
      return NextResponse.json(
        { error: "Cannot delete default template" },
        { status: 400 }
      );
    }

    await InvoiceTemplate.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Template deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete template" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const data = await request.json();

    const template = await InvoiceTemplate.findByIdAndUpdate(params.id, data, {
      new: true,
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update template" },
      { status: 500 }
    );
  }
}
