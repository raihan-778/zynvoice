// 7. API ROUTE FOR SERVER-SIDE EMAIL
// ===========================================

// app/api/send-email/route.ts
import { nodemailerService } from "@/lib/email/nodemailer";
import { emailTemplates } from "@/lib/email/template";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, toName, invoiceData, pdfBuffer, customMessage } = body;

    // Validate required fields
    if (!to || !invoiceData) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate email content
    const template = emailTemplates.invoiceEmail({
      clientName: toName,
      companyName: invoiceData.companyName,
      invoiceNumber: invoiceData.invoiceNumber,
      amount: invoiceData.total,
      dueDate: invoiceData.dueDate,
    });

    const emailData = {
      to,
      toName,
      subject: template.subject,
      message: customMessage || template.html,
      invoiceNumber: invoiceData.invoiceNumber,
      companyName: invoiceData.companyName,
      pdfBuffer: pdfBuffer ? Buffer.from(pdfBuffer, "base64") : undefined,
    };

    // Send email
    const result = await nodemailerService.sendInvoiceEmail(emailData);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Email API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
