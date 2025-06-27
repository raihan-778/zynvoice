// 4. EMAIL TEMPLATES
// ===========================================

import { EmailTemplate } from "./config";

// lib/email/templates.ts
export const emailTemplates = {
  invoiceEmail: (data: {
    clientName: string;
    companyName: string;
    invoiceNumber: string;
    amount: number;
    dueDate?: string;
  }): EmailTemplate => ({
    subject: `Invoice ${data.invoiceNumber} from ${data.companyName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
.container { max-width: 600px; margin: 0 auto; padding: 20px; }
.header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
.content { margin-bottom: 20px; }
.footer { background: #f8f9fa; padding: 15px; border-radius: 8px; font-size: 12px; color: #666; }
.highlight { color: #007bff; font-weight: bold; }
.amount { font-size: 18px; font-weight: bold; color: #28a745; }
</style>
</head>
<body>
<div class="container">
<div class="header">
<h2>Invoice from ${data.companyName}</h2>
</div>

            <div class="content">
              <p>Dear ${data.clientName || "Valued Client"},</p>

              <p>Please find attached your invoice <span class="highlight">#${
                data.invoiceNumber
              }</span>.</p>

              <p><strong>Invoice Details:</strong></p>
              <ul>
                <li>Invoice Number: <span class="highlight">${
                  data.invoiceNumber
                }</span></li>
                <li>Total Amount: <span class="amount">$${data.amount.toFixed(
                  2
                )}</span></li>
                ${data.dueDate ? `<li>Due Date: ${data.dueDate}</li>` : ""}
              </ul>

              <p>If you have any questions regarding this invoice, please don't hesitate to contact us.</p>

              <p>Thank you for your business!</p>

              <p>Best regards,<br>${data.companyName}</p>
            </div>

            <div class="footer">
              <p>This is an automated email. Please do not reply directly to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `

Invoice from ${data.companyName}

Dear ${data.clientName || "Valued Client"},

Please find attached your invoice #${data.invoiceNumber}.

Invoice Details:

- Invoice Number: ${data.invoiceNumber}
- Total Amount: $${data.amount.toFixed(2)}
${data.dueDate ? `- Due Date: ${data.dueDate}` : ""}

If you have any questions regarding this invoice, please don't hesitate to contact us.

Thank you for your business!

Best regards,
${data.companyName}
`,
  }),
};
