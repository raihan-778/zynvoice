import { IInvoice } from "@/types/database"; // or define it inline if needed
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
};

export type InvoiceCreateResponse = {
  invoice: IInvoice;
};
