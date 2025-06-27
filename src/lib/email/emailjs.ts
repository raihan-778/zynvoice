// // 6. EMAILJS SERVICE (CLIENT-SIDE)
// // ===========================================

// // lib/email/emailjs.ts

// import { emailConfig, EmailData, EmailResponse } from "./config";
// import emailjs from "emailjs-com";

// class EmailJSService {
//   private isInitialized = false;

//   private init() {
//     if (!this.isInitialized && emailConfig.emailjs.publicKey) {
//       emailjs.init(emailConfig.emailjs.publicKey);
//       this.isInitialized = true;
//     }
//   }

//   async sendInvoiceEmail(emailData: EmailData): Promise<EmailResponse> {
//     try {
//       this.init();

//       if (!emailConfig.emailjs.serviceId || !emailConfig.emailjs.templateId) {
//         throw new Error("EmailJS configuration is incomplete");
//       }

//       const templateParams = {
//         to_email: emailData.to,
//         to_name: emailData.toName || "Valued Client",
//         from_name: emailData.companyName,
//         subject: emailData.subject,
//         message: emailData.message,
//         invoice_number: emailData.invoiceNumber,
//         pdf_attachment: emailData.pdfBase64, // Base64 encoded PDF
//       };

//       const response = await emailjs.send(
//         emailConfig.emailjs.serviceId,
//         emailConfig.emailjs.templateId,
//         templateParams
//       );

//       return {
//         success: true,
//         message: "Email sent successfully",
//         messageId: response.text,
//       };
//     } catch (error) {
//       console.error("EmailJS sending failed:", error);
//       return {
//         success: false,
//         message: "Failed to send email",
//         error: error instanceof Error ? error.message : "Unknown error",
//       };
//     }
//   }
// }

// export const emailjsService = new EmailJSService();
