// 3. API Route for Server-side PDF Generation - /app/api/invoice/pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      invoiceData,
      selectedCompany,
      selectedClient,
      calculations,
      template,
    } = body;

    // Validate required data
    if (
      !invoiceData ||
      !selectedCompany ||
      !selectedClient ||
      !calculations ||
      !template
    ) {
      return NextResponse.json(
        { error: "Missing required invoice data" },
        { status: 400 }
      );
    }

    // Generate PDF stream
    const stream = await renderToStream(
      <InvoiceP
        invoiceData={invoiceData}
        selectedCompany={selectedCompany}
        selectedClient={selectedClient}
        calculations={calculations}
        template={template}
      />
    );

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      if (typeof chunk === "string") {
        chunks.push(Buffer.from(chunk));
      } else {
        chunks.push(chunk);
      }
    }
    const buffer = Buffer.concat(chunks);

    // Return PDF as response
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${invoiceData.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
