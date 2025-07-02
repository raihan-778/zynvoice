// app/api/invoices/next-number/route.ts

import DBConnect from "@/lib/database/connection";
import InvoiceModel from "@/models/Invoice";
import { z } from "zod";

const YearQuerySchema = z.object({
  year: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : new Date().getFullYear())),
});

export async function GET(request: Request) {
  await DBConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = { year: searchParams.get("year") };

    // Validate with zod
    const result = YearQuerySchema.safeParse(queryParam);
    console.log("result", result); // TODO: remove this line

    if (!result.success) {
      const yearErrors = result.error.format().year?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            yearErrors?.length > 0
              ? yearErrors.join(",")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { year } = result.data;
    const lastInvoiceNumber = await getLastInvoiceNumber(year);
    const nextNumber = generateNextInvoiceNumber(lastInvoiceNumber, year);

    return Response.json(
      {
        success: true,
        message: "Successfully generated next invoice number",
        data: { invoiceNumber: nextNumber },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating next invoice number:", error);

    return Response.json(
      {
        success: false,
        message: "Error generating next invoice number",
      },
      { status: 500 }
    );
  }
}

function generateNextInvoiceNumber(
  lastNumber: string | null,
  year: number
): string {
  const prefix = `INV-${year}-`;

  if (!lastNumber || !lastNumber.startsWith(prefix)) {
    return `${prefix}001`;
  }

  const lastSequence = parseInt(lastNumber.split("-")[2]) || 0;
  const nextSequence = (lastSequence + 1).toString().padStart(3, "0");

  return `${prefix}${nextSequence}`;
}

async function getLastInvoiceNumber(year: number): Promise<string | null> {
  try {
    const lastInvoice = await InvoiceModel.findOne({
      invoiceNumber: { $regex: `^INV-${year}-` },
    }).sort({ invoiceNumber: -1 });

    return lastInvoice?.invoiceNumber || null;
  } catch (error) {
    console.error("Error fetching last invoice number:", error);
    return null;
  }
}
