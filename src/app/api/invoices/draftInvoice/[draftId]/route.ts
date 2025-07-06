// app/api/invoices/drafts/[draftId]/route.ts
import { NextRequest, NextResponse } from "next/server";

// GET - Load specific draft
export async function GET(
  request: NextRequest,
  { params }: { params: { draftId: string } }
) {
  try {
    const { draftId } = params;
    const { db } = await connectToDatabase();

    const draft = await db.collection("invoiceDrafts").findOne({ draftId });

    if (!draft) {
      return NextResponse.json(
        { success: false, error: "Draft not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      draft,
      message: "Draft loaded successfully",
    });
  } catch (error) {
    console.error("Error loading draft:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load draft" },
      { status: 500 }
    );
  }
}

// DELETE - Delete specific draft
export async function DELETE(
  request: NextRequest,
  { params }: { params: { draftId: string } }
) {
  try {
    const { draftId } = params;
    const { db } = await connectToDatabase();

    const result = await db.collection("invoiceDrafts").deleteOne({ draftId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Draft not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Draft deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting draft:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete draft" },
      { status: 500 }
    );
  }
}
