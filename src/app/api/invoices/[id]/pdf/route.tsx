// app/api/invoices/[id]/pdf/route.ts
import InvoicePDFTemplate from "@/components/pdf/InvoicePDFTemplate";
import DBConnect from "@/lib/database/connection";
import InvoiceModel from "@/models/Invoice";
import { IInvoice, PopulatedInvoice } from "@/types/database";
import { mapInvoiceDataForPDF } from "@/utils/InvoiceDataMapper";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to the database
    await DBConnect();

    const invoiceId = params.id;

    // Fetch invoice with related company and client
    const invoice = (await InvoiceModel.findById(invoiceId)
      .populate("companyId")
      .populate("clientId")
      .lean()) as PopulatedInvoice | null;

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const company = invoice.companyId;
    const client = invoice.clientId;

    // Create properly typed invoice object
    const invoiceForPDF = {
      ...(invoice as IInvoice),
      userId: invoice.userId,
      companyId: invoice.companyId,
      clientId: invoice.clientId,
      invoiceNumber: invoice.invoiceNumber,
    } as unknown as IInvoice;

    const pdfData = mapInvoiceDataForPDF(invoiceForPDF, company, client);

    // Generate PDF buffer - JSX syntax should work now
    const pdfBuffer = await renderToBuffer(
      <InvoicePDFTemplate data={pdfData} />
    );

    const filename = `invoice-${pdfData.invoice.invoiceNumber}.pdf`;

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.length.toString(),
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
