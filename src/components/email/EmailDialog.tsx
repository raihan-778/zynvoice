// 9. EMAIL DIALOG COMPONENT
// ===========================================

// components/email/EmailDialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { motion } from "framer-motion";
import { Loader2, Mail, Send } from "lucide-react";
import { useState } from "react";

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
  defaultEmail = "",
  defaultName = "",
}: EmailDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [emailForm, setEmailForm] = useState({
    to: defaultEmail,
    toName: defaultName,
    subject: `Invoice ${invoiceData?.invoiceNumber || "INV-001"} from ${
      invoiceData?.companyName || "Your Company"
    }`,
    message: "",
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

  const defaultMessage = `Dear ${emailForm.toName || "Valued Client"},

Please find attached your invoice #${invoiceData?.invoiceNumber || "INV-001"}.

Invoice Details:

- Total Amount: $${invoiceData?.total?.toFixed(2) || "0.00"}
- Due Date: ${invoiceData?.dueDate || "Upon receipt"}

If you have any questions regarding this invoice, please don't hesitate to contact us.

Thank you for your business!

Best regards,
${invoiceData?.companyName || "Your Company"}`;

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
                    onCheckedChange={(checked: any) =>
                      setEmailForm((prev) => ({
                        ...prev,
                        useServerSide: checked,
                      }))
                    }
                  />
                  <span className="text-sm text-muted-foreground">
                    Nodemailer
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="attach-pdf">Attach PDF</Label>
                <Switch
                  id="attach-pdf"
                  checked={emailForm.attachPdf}
                  onCheckedChange={(checked: any) =>
                    setEmailForm((prev) => ({ ...prev, attachPdf: checked }))
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
                  setEmailForm((prev) => ({ ...prev, to: e.target.value }))
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
                  setEmailForm((prev) => ({ ...prev, toName: e.target.value }))
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
                setEmailForm((prev) => ({ ...prev, subject: e.target.value }))
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
                setEmailForm((prev) => ({ ...prev, message: e.target.value }))
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
