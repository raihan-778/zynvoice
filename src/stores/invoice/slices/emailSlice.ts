import type { StateCreator } from "zustand";
import type { EmailState, SendEmailOptions } from "../types";

export interface EmailSlice {
  emailState: EmailState;
  setEmailSending: (sending: boolean) => void;
  setEmailError: (error: string | null) => void;
  setEmailSuccess: (success: boolean) => void;
  loadEmailHistory: (invoiceId: string) => Promise<void>;
  loadEmailTemplates: () => Promise<void>;
  setSelectedEmailTemplate: (template: any) => void;
  sendInvoiceEmail: (options: SendEmailOptions) => Promise<void>;
}

export const createEmailSlice: StateCreator<EmailSlice, [], [], EmailSlice> = (
  set,
  get
) => ({
  emailState: {
    isEmailSending: false,
    emailError: null,
    emailSuccess: false,
    emailHistory: [],
    emailTemplates: [],
    selectedEmailTemplate: null,
  },

  setEmailSending: (isEmailSending) =>
    set(
      (s) => ({ emailState: { ...s.emailState, isEmailSending } }),
      false,
      "email/setSending"
    ),

  setEmailError: (emailError) =>
    set(
      (s) => ({ emailState: { ...s.emailState, emailError } }),
      false,
      "email/setError"
    ),

  setEmailSuccess: (emailSuccess) =>
    set(
      (s) => ({ emailState: { ...s.emailState, emailSuccess } }),
      false,
      "email/setSuccess"
    ),

  setSelectedEmailTemplate: (selectedEmailTemplate) =>
    set(
      (s) => ({ emailState: { ...s.emailState, selectedEmailTemplate } }),
      false,
      "email/setTemplate"
    ),

  loadEmailHistory: async (invoiceId) => {
    const res = await fetch(`/api/invoices/${invoiceId}/emails`);
    const data = await res.json();
    set(
      (s) => ({ emailState: { ...s.emailState, emailHistory: data } }),
      false,
      "email/loadHistory"
    );
  },

  loadEmailTemplates: async () => {
    const res = await fetch("/api/email-templates");
    const data = await res.json();
    set(
      (s) => ({ emailState: { ...s.emailState, emailTemplates: data } }),
      false,
      "email/loadTemplates"
    );
  },

  sendInvoiceEmail: async (options) => {
    get().setEmailSending(true);
    try {
      const res = await fetch(`/api/invoices/send-email`, {
        method: "POST",
        body: JSON.stringify(options),
      });
      if (!res.ok) throw new Error(await res.text());
      get().setEmailSuccess(true);
    } catch (err: any) {
      get().setEmailError(err.message);
    } finally {
      get().setEmailSending(false);
    }
  },
});
