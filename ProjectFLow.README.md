// 📁 src/hooks/use-email.ts
'use client';

import { useState } from 'react';
import { EmailService } from '@/lib/services/email-service';
import { SendEmailRequest, EmailResponse, EmailStatus } from '@/lib/types/email';
import { useInvoiceGenerator } from './use-invoice-generator';
import { InvoiceFormData } from '@/lib/types';
import { toast } from 'sonner';

interface EmailFormData {
recipientEmail: string;
recipientName: string;
subject: string;
message?: string;
includeAttachment: boolean;
}

export function useEmail() {
const [isSending, setIsSending] = useState(false);
const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null);
const [emailHistory, setEmailHistory] = useState<EmailStatus[]>([]);

const { getPDFBlob } = useInvoiceGenerator();

/\*\*

- Send invoice email
  \*/
  const sendInvoiceEmail = async (
  emailData: EmailFormData,
  invoiceData: InvoiceFormData,
  companyInfo: any,
  clientInfo: any,
  invoiceNumber: string,
  preferredMethod: 'nodemailer' | 'emailjs' = 'nodemailer'
  ): Promise<EmailResponse> => {


    setIsSending(true);

    try {
      // Generate PDF attachment if requested
      let pdfBlob: Blob | null = null;
      if (emailData.includeAttachment) {
        toast.info('Generating PDF attachment...');
        pdfBlob = await getPDFBlob(invoiceData, companyInfo, clientInfo, invoiceNumber);

        if (!pdfBlob) {
          throw new Error('Failed to generate PDF attachment');
        }
      }

      // Calculate total amount
      const totalAmount = invoiceData.items.reduce(
        (sum, item) => sum + (item.quantity * item.rate),
        0
      ) * (1 + invoiceData.taxRate / 100) - invoiceData.discount;

      // Prepare email request
      const emailRequest: SendEmailRequest = {
        recipientEmail: emailData.recipientEmail,
        recipientName: emailData.recipientName,
        senderName: companyInfo.name,
        senderEmail: companyInfo.email,
        subject: emailData.subject,
        message: emailData.message,
        invoiceData
