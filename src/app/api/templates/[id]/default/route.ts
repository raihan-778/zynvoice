// app/api/templates/[id]/default/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { InvoiceTemplate } from "@/models/InvoiceTemplate";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Remove default from all templates
    await InvoiceTemplate.updateMany({}, { isDefault: false });

    // Set new default
    const template = await InvoiceTemplate.findByIdAndUpdate(
      params.id,
      { isDefault: true },
      { new: true }
    );

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to set default template" },
      { status: 500 }
    );
  }
}

// app/api/templates/[id]/duplicate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { InvoiceTemplate } from "@/models/InvoiceTemplate";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const originalTemplate = await InvoiceTemplate.findById(params.id);
    if (!originalTemplate) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    const duplicatedTemplate = new InvoiceTemplate({
      name: `${originalTemplate.name} (Copy)`,
      description: originalTemplate.description,
      previewImage: originalTemplate.previewImage,
      styles: originalTemplate.styles,
      isDefault: false,
      createdAt: new Date(),
    });

    await duplicatedTemplate.save();
    return NextResponse.json(duplicatedTemplate);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to duplicate template" },
      { status: 500 }
    );
  }
}
