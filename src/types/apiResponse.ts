export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
};

export type InvoiceCreateResponse = {
  success: boolean;
  message: string;
  data?: {
    invoiceId: string;
    invoiceNumber: string;
    status: string;
    total: number;
    dueDate: string;
    createdAt: string;
  };
  errors?: Record<string, string>;
};

// Add these interfaces to your component file
export interface InvoiceApiResponse {
  success: boolean;
  message: string;
  data?: {
    invoiceId: string;
    invoiceNumber: string;
    status: string;
    total: number;
    dueDate: string;
    createdAt: string;
  };
  errors?: Record<string, string>;
}
// Response interfaces
export interface SuccessResponse {
  success: true;
  message: string;
  data: {
    invoiceId: string;
    invoiceNumber: string;
    status: "draft" | "sent" | "paid" | "overdue";
    total: number;
    dueDate: string;
    createdAt: string;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string>;
}
