// hooks/useInvoiceForm.ts - Updated for App Router

import { calculateInvoiceTotal, calculateTaxAmount, InvoiceItem, validateInvoiceForm } from "@/lib/validations/validation";
import { ApiResponse } from "@/types/apiResponse";
import {
  IClient,
  ICompany,
  IInvoice,
  IInvoiceItem,
  InvoiceFormData,
  InvoiceFormErrors,
} from "@/types/database";
import { useCallback, useEffect, useState } from "react";

interface UseInvoiceFormReturn {
  formData: Partial<InvoiceFormData>;
  errors: InvoiceFormErrors;
  isSubmitting: boolean;
  companies: ICompany[];
  clients: IClient[];
  clientSearch: string;
  setClientSearch: (search: string) => void;
  updateFormData: <K extends keyof InvoiceFormData>(
    field: K,
    value: InvoiceFormData[K]
  ) => void;
  updateItem: (
    index: number,
    field: keyof IInvoiceItem,
    value: IInvoiceItem[keyof IInvoiceItem]
  ) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  validateForm: () => Promise<boolean>;
  submitForm: () => Promise<{
    success: boolean;
    invoice?: IInvoice;
    errors?: InvoiceFormErrors;
    error?: string;
  }>;
  resetForm: () => void;
  generateInvoiceNumber: () => Promise<void>;
}

const initialFormData: Partial<InvoiceFormData> = {
  invoiceNumber: "",
  clientId: undefined,
  companyId: undefined,

  dueDate: new Date().toISOString().split("T")[0],
  items: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
  taxRate: 0,
  notes: "",
};

export const useInvoiceForm = (): UseInvoiceFormReturn => {
  const [formData, setFormData] = useState<Partial<InvoiceFormData>>(initialFormData);
  const [errors, setErrors] = useState<InvoiceFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [clients, setClients] = useState<IClient[]>([]);
  const [clientSearch, setClientSearch] = useState("");

  // Load companies and generate invoice number on mount
  useEffect(() => {
    fetchCompanies();
    generateInvoiceNumber();
  }, []);

  // Search clients with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (clientSearch.length >= 2) {
        fetchClients(clientSearch);
      } else {
        setClients([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [clientSearch]);

  // Calculate totals when items or tax rate change
  useEffect(() => {
    if (formData.items) {
      const subtotal = calculateInvoiceTotal(formData.items);
      const taxAmount = calculateTaxAmount(subtotal, formData.taxRate || 0);
      const totalAmount = subtotal + taxAmount;

      setFormData((prev) => ({
        ...prev,
        subtotal,
        taxAmount,
        totalAmount,
      }));
    }
  }, [formData.items, formData.taxRate]);

  const fetchCompanies = async (): Promise<void> => {
    try {
      const response = await fetch("/api/companies");
      const data: ApiResponse<{ companies: ICompany[] }> = await response.json();

      if (data.success && data.data) {
        setCompanies(data.data.companies);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchClients = async (search: string): Promise<void> => {
    try {
      const response = await fetch(
        `/api/clients?search=${encodeURIComponent(search)}`
      );
      const data: ApiResponse<{ clients: IClient[] }> = await response.json();

      if (data.success && data.data) {
        setClients(data.data.clients);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const generateInvoiceNumber = async (): Promise<void> => {
    try {
      const response = await fetch("/api/invoices/next-number");
      const data: ApiResponse<{ invoiceNumber: string }> =
        await response.json();

      if (data.success && data.data) {
        setFormData((prev) => ({
          ...prev,
          invoiceNumber: data.data!.invoiceNumber,
        }));
      }
    } catch (error) {
      console.error("Error generating invoice number:", error);
    }
  };

  const checkDuplicateInvoice = async (
    invoiceNumber: string
  ): Promise<boolean> => {
    try {
      const response = await fetch("/api/invoices/check-duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceNumber }),
      });
      const data: ApiResponse<{ exists: boolean }> = await response.json();
      return data.success && data.data ? data.data.exists : false;
    } catch (error) {
      console.error("Error checking duplicate:", error);
      return false;
    }
  };

  const updateFormData = useCallback(
    <K extends keyof InvoiceFormData>(field: K, value: InvoiceFormData[K]): void => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear field-specific error when user starts typing
      if (errors[field as keyof InvoiceFormErrors]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field as keyof InvoiceFormErrors];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const updateItem = useCallback(
    (
      index: number,
      field: keyof IInvoiceItem,
      value: string | number | undefined
    ): void => {
      setFormData((prev) => {
        const newItems = [...(prev.items || [])];
        newItems[index] = { ...newItems[index], [field]: value };
        return { ...prev, items: newItems };
      });

      // Clear item-specific error
      const errorKey = `items.${index}.${field}`;
      if ((errors as Record<string, unknown>)[errorKey]) {
        setErrors((prev) => {
          const newErrors = { ...prev } as Record<string, unknown>;
          delete newErrors[errorKey];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const addItem = useCallback((): void => {
    setFormData((prev) => ({
      ...prev,
      items: [...(prev.items || []), { description: "", quantity: 1, rate: 0, amount: 0 }],
    }));
  }, []);

  const removeItem = useCallback((index: number): void => {
    setFormData((prev) => ({
      ...prev,
      items: (prev.items || []).filter((_, i) => i !== index),
    }));
  }, []);

  const validateForm = useCallback(async (): Promise<boolean> => {
    const validation = validateInvoiceForm(formData);

    // Check for duplicate invoice number
    if (validation.isValid && formData.invoiceNumber) {
      const isDuplicate = await checkDuplicateInvoice(formData.invoiceNumber);
      if (isDuplicate) {
        validation.isValid = false;
        validation.errors.invoiceNumber = "Invoice number already exists";
      }
    }

    setErrors(validation.errors);
    return validation.isValid;
  }, [formData]);

  const submitForm = useCallback(async () => {
    setIsSubmitting(true);

    try {
      const isValid = await validateForm();
      if (!isValid) {
        setIsSubmitting(false);
        return { success: false, errors };
      }

      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result: ApiResponse<{ invoice: IInvoice }> = await response.json();

      if (result.success && result.data) {
        return { success: true, invoice: result.data.invoice };
      } else {
        setErrors(result.errors || {});
        return { success: false, errors: result.errors };
      }
    } catch (error) {
      console.error("Submit error:", error);
      return { success: false, error: "Network error occurred" };
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, errors]);

  const resetForm = useCallback((): void => {
    setFormData(initialFormData);
    setErrors({});
    generateInvoiceNumber();
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    companies,
    clients,
    clientSearch,
    setClientSearch,
    updateFormData,
    updateItem,
    addItem,
    removeItem,
    validateForm,
    submitForm,
    resetForm,
    generateInvoiceNumber,
  };
};
