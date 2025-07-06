// app/api/invoices/drafts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb"; // Your MongoDB connection
import { InvoiceDraft } from "@/types/invoice";

// GET - Load all drafts
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();

    // Optional: Add user authentication here
    // const userId = await getUserId(request);
    // const drafts = await db.collection('invoiceDrafts').find({ userId }).toArray();

    const drafts = await db
      .collection("invoiceDrafts")
      .find({ isDraft: true })
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      drafts,
      message: "Drafts loaded successfully",
    });
  } catch (error) {
    console.error("Error loading drafts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load drafts" },
      { status: 500 }
    );
  }
}

// POST - Save/Update draft
export async function POST(request: NextRequest) {
  try {
    const draftData: InvoiceDraft = await request.json();

    if (!draftData.draftId) {
      return NextResponse.json(
        { success: false, error: "Draft ID is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Optional: Add user authentication
    // const userId = await getUserId(request);
    // draftData.userId = userId;

    const result = await db.collection("invoiceDrafts").findOneAndUpdate(
      { draftId: draftData.draftId },
      {
        $set: {
          ...draftData,
          updatedAt: new Date().toISOString(),
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    return NextResponse.json({
      success: true,
      draft: result.value,
      message: "Draft saved successfully",
    });
  } catch (error) {
    console.error("Error saving draft:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save draft" },
      { status: 500 }
    );
  }
}
