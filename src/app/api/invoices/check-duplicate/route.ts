import DBConnect from "@/lib/database/connection";
import InvoiceModel from "@/models/Invoice";
// app/api/invoices/check-duplicate/route.ts

// Assuming you have an Invoice model
import { z } from "zod";

const InvoiceNumberSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
});

export async function POST(request: Request) {
  await DBConnect();

  try {
    const body = await request.json();

    // Validate with zod
    const result = InvoiceNumberSchema.safeParse(body);
    console.log("result", result); // TODO: remove this line

    if (!result.success) {
      const invoiceNumberErrors =
        result.error.format().invoiceNumber?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            invoiceNumberErrors?.length > 0
              ? invoiceNumberErrors.join(",")
              : "Invalid request body",
        },
        { status: 400 }
      );
    }

    const { invoiceNumber } = result.data;
    const exists = await checkInvoiceExists(invoiceNumber);

    return Response.json(
      {
        success: true,
        message: "Duplicate check completed successfully",
        data: { exists },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking invoice duplicate:", error);

    return Response.json(
      {
        success: false,
        message: "Error checking invoice duplicate",
      },
      { status: 500 }
    );
  }
}

async function checkInvoiceExists(invoiceNumber: string): Promise<boolean> {
  try {
    const existingInvoice = await InvoiceModel.findOne({
      invoiceNumber: invoiceNumber,
    });

    return existingInvoice !== null;
  } catch (error) {
    console.error("Error checking invoice existence:", error);
    throw error; // Re-throw to be handled by the main try-catch
  }
}
