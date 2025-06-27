// 2. EMAIL CONFIGURATION
// ===========================================

// lib/email/config.ts
export const emailConfig = {
  // Nodemailer config
  smtp: {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  from: {
    email: process.env.FROM_EMAIL,
    name: process.env.FROM_NAME,
  },

  // EmailJS config
  emailjs: {
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
  },
};

// 3. EMAIL TYPES
// ===========================================

// types/email.ts
export interface EmailData {
  to: string;
  toName?: string;
  subject: string;
  message: string;
  invoiceNumber: string;
  companyName: string;
  pdfBuffer?: Buffer;
  pdfBase64?: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  messageId?: string;
  error?: string;
}
