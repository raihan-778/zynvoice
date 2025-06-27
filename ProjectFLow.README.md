// ===========================================
// SECTION 5: EMAIL INTEGRATION
// ===========================================

// 1. ENVIRONMENT VARIABLES (.env.local)
// ===========================================
/\*

# For Nodemailer (Server-side)

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
FROM_NAME=Your Company Name

# For EmailJS (Client-side)

NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
\*/

// 2. EMAIL CONFIGURATION
// ===========================================

// lib/email/config.ts
export const emailConfig = {
// Nodemailer config
smtp: {
host: process.env.SMTP_HOST || 'smtp.gmail.com',
port: parseInt(process.env.SMTP_PORT || '587'),
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

// 4. EMAIL TEMPLATES
// ===========================================

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
              <p>Dear ${data.clientName || 'Valued Client'},</p>

              <p>Please find attached your invoice <span class="highlight">#${data.invoiceNumber}</span>.</p>

              <p><strong>Invoice Details:</strong></p>
              <ul>
                <li>Invoice Number: <span class="highlight">${data.invoiceNumber}</span></li>
                <li>Total Amount: <span class="amount">$${data.amount.toFixed(2)}</span></li>
                ${data.dueDate ? `<li>Due Date: ${data.dueDate}</li>` : ''}
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

Dear ${data.clientName || 'Valued Client'},

Please find attached your invoice #${data.invoiceNumber}.

Invoice Details:

- Invoice Number: ${data.invoiceNumber}
- Total Amount: $${data.amount.toFixed(2)}
${data.dueDate ? `- Due Date: ${data.dueDate}` : ''}

If you have any questions regarding this invoice, please don't hesitate to contact us.

Thank you for your business!

Best regards,
${data.companyName}
`,
}),
};

// 5. NODEMAILER SERVICE (SERVER-SIDE)
// ===========================================

// lib/email/nodemailer.ts
import nodemailer from 'nodemailer';
import { emailConfig } from './config';
import { EmailData, EmailResponse } from '@/types/email';

class NodemailerService {
private transporter: nodemailer.Transporter;

constructor() {
this.transporter = nodemailer.createTransporter(emailConfig.smtp);
}

async verifyConnection(): Promise<boolean> {
try {
await this.transporter.verify();
return true;
} catch (error) {
console.error('Email connection verification failed:', error);
return false;
}
}

async sendInvoiceEmail(emailData: EmailData): Promise<EmailResponse> {
try {
const { to, toName, subject, message, invoiceNumber, pdfBuffer } = emailData;

      const mailOptions: nodemailer.SendMailOptions = {
        from: {
          name: emailConfig.from.name || 'Invoice System',
          address: emailConfig.from.email!,
        },
        to: toName ? `${toName} <${to}>` : to,
        subject,
        html: message,
        text: message.replace(/<[^>]*>/g, ''), // Strip HTML for plain text
        attachments: pdfBuffer ? [
          {
            filename: `invoice-${invoiceNumber}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ] : [],
      };

      const result = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        message: 'Email sent successfully',
        messageId: result.messageId,
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        message: 'Failed to send email',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

}
}

export const nodemailerService = new NodemailerService();

// 6. EMAILJS SERVICE (CLIENT-SIDE)
// ===========================================

// lib/email/emailjs.ts
import emailjs from '@emailjs/browser';
import { emailConfig } from './config';
import { EmailData, EmailResponse } from '@/types/email';

class EmailJSService {
private isInitialized = false;

private init() {
if (!this.isInitialized && emailConfig.emailjs.publicKey) {
emailjs.init(emailConfig.emailjs.publicKey);
this.isInitialized = true;
}
}

async sendInvoiceEmail(emailData: EmailData): Promise<EmailResponse> {
try {
this.init();

      if (!emailConfig.emailjs.serviceId || !emailConfig.emailjs.templateId) {
        throw new Error('EmailJS configuration is incomplete');
      }

      const templateParams = {
        to_email: emailData.to,
        to_name: emailData.toName || 'Valued Client',
        from_name: emailData.companyName,
        subject: emailData.subject,
        message: emailData.message,
        invoice_number: emailData.invoiceNumber,
        pdf_attachment: emailData.pdfBase64, // Base64 encoded PDF
      };

      const response = await emailjs.send(
        emailConfig.emailjs.serviceId,
        emailConfig.emailjs.templateId,
        templateParams
      );

      return {
        success: true,
        message: 'Email sent successfully',
        messageId: response.text,
      };
    } catch (error) {
      console.error('EmailJS sending failed:', error);
      return {
        success: false,
        message: 'Failed to send email',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

}
}

export const emailjsService = new EmailJSService();

// 7. API ROUTE FOR SERVER-SIDE EMAIL
// ===========================================

// app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { nodemailerService } from '@/lib/email/nodemailer';
import { emailTemplates } from '@/lib/email/templates';

export async function POST(request: NextRequest) {
try {
const body = await request.json();
const {
to,
toName,
invoiceData,
pdfBuffer,
customMessage,
} = body;

    // Validate required fields
    if (!to || !invoiceData) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
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
      pdfBuffer: pdfBuffer ? Buffer.from(pdfBuffer, 'base64') : undefined,
    };

    // Send email
    const result = await nodemailerService.sendInvoiceEmail(emailData);

    return NextResponse.json(result);

} catch (error) {
console.error('Email API error:', error);
return NextResponse.json(
{
success: false,
message: 'Internal server error',
error: error instanceof Error ? error.message : 'Unknown error',
},
{ status: 500 }
);
}
}

// 8. EMAIL HOOK
// ===========================================

// hooks/useEmail.ts
import { useState } from 'react';
import { toast } from 'sonner';
import { EmailResponse } from '@/types/email';
import { emailjsService } from '@/lib/email/emailjs';

interface UseEmailOptions {
onSuccess?: (response: EmailResponse) => void;
onError?: (error: string) => void;
}

export const useEmail = (options: UseEmailOptions = {}) => {
const [isLoading, setIsLoading] = useState(false);

const sendEmailServerSide = async (
to: string,
invoiceData: any,
pdfBuffer?: string,
customMessage?: string,
toName?: string
): Promise<EmailResponse> => {
setIsLoading(true);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          toName,
          invoiceData,
          pdfBuffer,
          customMessage,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Email sent successfully!');
        options.onSuccess?.(result);
      } else {
        toast.error(result.message || 'Failed to send email');
        options.onError?.(result.message);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send email';
      toast.error(errorMessage);
      options.onError?.(errorMessage);

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }

};

const sendEmailClientSide = async (
to: string,
invoiceData: any,
pdfBase64?: string,
customMessage?: string,
toName?: string
): Promise<EmailResponse> => {
setIsLoading(true);

    try {
      const emailData = {
        to,
        toName,
        subject: `Invoice ${invoiceData.invoiceNumber} from ${invoiceData.companyName}`,
        message: customMessage || `Please find attached your invoice #${invoiceData.invoiceNumber}`,
        invoiceNumber: invoiceData.invoiceNumber,
        companyName: invoiceData.companyName,
        pdfBase64,
      };

      const result = await emailjsService.sendInvoiceEmail(emailData);

      if (result.success) {
        toast.success('Email sent successfully!');
        options.onSuccess?.(result);
      } else {
        toast.error(result.message || 'Failed to send email');
        options.onError?.(result.message);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send email';
      toast.error(errorMessage);
      options.onError?.(errorMessage);

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }

};

return {
sendEmailServerSide,
sendEmailClientSide,
isLoading,
};
};

// 9. EMAIL DIALOG COMPONENT
// ===========================================

// components/email/EmailDialog.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Mail, Send, Loader2 } from 'lucide-react';
import { useEmail } from '@/hooks/useEmail';
import { Card, CardContent } from '@/components/ui/card';

interface EmailDialogProps {
invoiceData: any;
pdfBuffer?: string;
trigger?: React.ReactNode;
defaultEmail?: string;
defaultName?: string;
}

export function EmailDialog({
invoiceData,
pdfBuffer,
trigger,
defaultEmail = '',
defaultName = '',
}: EmailDialogProps) {
const [isOpen, setIsOpen] = useState(false);
const [emailForm, setEmailForm] = useState({
to: defaultEmail,
toName: defaultName,
subject: `Invoice ${invoiceData?.invoiceNumber || 'INV-001'} from ${invoiceData?.companyName || 'Your Company'}`,
message: '',
attachPdf: true,
useServerSide: true,
});

const { sendEmailServerSide, sendEmailClientSide, isLoading } = useEmail({
onSuccess: () => {
setIsOpen(false);
},
});

const handleSendEmail = async () => {
if (!emailForm.to) return;

    const pdfData = emailForm.attachPdf ? pdfBuffer : undefined;

    if (emailForm.useServerSide) {
      await sendEmailServerSide(
        emailForm.to,
        invoiceData,
        pdfData,
        emailForm.message,
        emailForm.toName
      );
    } else {
      await sendEmailClientSide(
        emailForm.to,
        invoiceData,
        pdfData,
        emailForm.message,
        emailForm.toName
      );
    }

};

const defaultMessage = `Dear ${emailForm.toName || 'Valued Client'},

Please find attached your invoice #${invoiceData?.invoiceNumber || 'INV-001'}.

Invoice Details:

- Total Amount: $${invoiceData?.total?.toFixed(2) || '0.00'}
- Due Date: ${invoiceData?.dueDate || 'Upon receipt'}

If you have any questions regarding this invoice, please don't hesitate to contact us.

Thank you for your business!

Best regards,
${invoiceData?.companyName || 'Your Company'}`;

return (
<Dialog open={isOpen} onOpenChange={setIsOpen}>
<DialogTrigger asChild>
{trigger || (
<Button variant="outline" className="flex items-center gap-2">
<Mail className="w-4 h-4" />
Send Email
</Button>
)}
</DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Send Invoice via Email
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Email Configuration */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="server-side">Email Service</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">EmailJS</span>
                  <Switch
                    id="server-side"
                    checked={emailForm.useServerSide}
                    onCheckedChange={(checked) =>
                      setEmailForm(prev => ({ ...prev, useServerSide: checked }))
                    }
                  />
                  <span className="text-sm text-muted-foreground">Nodemailer</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="attach-pdf">Attach PDF</Label>
                <Switch
                  id="attach-pdf"
                  checked={emailForm.attachPdf}
                  onCheckedChange={(checked) =>
                    setEmailForm(prev => ({ ...prev, attachPdf: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Recipient Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="to-email">Recipient Email *</Label>
              <Input
                id="to-email"
                type="email"
                placeholder="client@example.com"
                value={emailForm.to}
                onChange={(e) =>
                  setEmailForm(prev => ({ ...prev, to: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="to-name">Recipient Name</Label>
              <Input
                id="to-name"
                placeholder="John Doe"
                value={emailForm.toName}
                onChange={(e) =>
                  setEmailForm(prev => ({ ...prev, toName: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={emailForm.subject}
              onChange={(e) =>
                setEmailForm(prev => ({ ...prev, subject: e.target.value }))
              }
            />
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder={defaultMessage}
              value={emailForm.message}
              onChange={(e) =>
                setEmailForm(prev => ({ ...prev, message: e.target.value }))
              }
              rows={8}
              className="resize-none"
            />
            {!emailForm.message && (
              <p className="text-sm text-muted-foreground mt-1">
                Leave empty to use default message template
              </p>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button
              onClick={handleSendEmail}
              disabled={!emailForm.to || isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Send Email
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>

);
}

// 10. PACKAGE.JSON DEPENDENCIES
// ===========================================

/\*
Add these dependencies to your package.json:

npm install nodemailer @types/nodemailer @emailjs/browser

Dependencies added:

- nodemailer: ^6.9.8
- @types/nodemailer: ^6.4.14
- @emailjs/browser: ^3.11.0
  \*/

// 11. USAGE EXAMPLE
// ===========================================

/\*
// In your invoice component:
import { EmailDialog } from '@/components/email/EmailDialog';

<EmailDialog
invoiceData={invoiceData}
pdfBuffer={pdfBase64String}
defaultEmail={clientEmail}
defaultName={clientName}
trigger={
<Button className="flex items-center gap-2">
<Mail className="w-4 h-4" />
Send via Email
</Button>
}
/>
\*/
