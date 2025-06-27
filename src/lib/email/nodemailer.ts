// 5. NODEMAILER SERVICE (SERVER-SIDE)
// ===========================================

// lib/email/nodemailer.ts
import nodemailer from "nodemailer";
import { emailConfig, EmailData, EmailResponse } from "./config";

class NodemailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(emailConfig.smtp);
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error("Email connection verification failed:", error);
      return false;
    }
  }

  async sendInvoiceEmail(emailData: EmailData): Promise<EmailResponse> {
    try {
      const { to, toName, subject, message, invoiceNumber, pdfBuffer } =
        emailData;

      const mailOptions: nodemailer.SendMailOptions = {
        from: {
          name: emailConfig.from.name || "Invoice System",
          address: emailConfig.from.email!,
        },
        to: toName ? `${toName} <${to}>` : to,
        subject,
        html: message,
        text: message.replace(/<[^>]*>/g, ""), // Strip HTML for plain text
        attachments: pdfBuffer
          ? [
              {
                filename: `invoice-${invoiceNumber}.pdf`,
                content: pdfBuffer,
                contentType: "application/pdf",
              },
            ]
          : [],
      };

      const result = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        message: "Email sent successfully",
        messageId: result.messageId,
      };
    } catch (error) {
      console.error("Email sending failed:", error);
      return {
        success: false,
        message: "Failed to send email",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

export const nodemailerService = new NodemailerService();
