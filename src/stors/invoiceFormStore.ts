import {
  ClientInfo,
  CompanyInfo,
  InvoiceFormData,
  InvoiceItem,
} from "@/lib/validations/validation";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface FormErrors {
  [key: string]: string;
}

export interface InvoiceTotals {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

export interface InvoiceState {
  // Form state
  // Form state

  // UI state

  isFormValid: boolean;
  touchedFields: Set<string>;

  invoiceForm: InvoiceFormData;

  // UI state
  previewMode: boolean;
  isLoading: boolean;
  clientSearch: string;
  showClientDropdown: boolean;
  selectedClient: ClientInfo | null;
  selectedCompany: CompanyInfo | null;
  error: string | null;

  // errorHandelingState
  formErrors: FormErrors;
  apiErrors: Record<string, string>; // ✅ This handles your {apiErrors.companyId}
  generalError: string | null;
}

export interface InvoiceActions {
  // Form actions

  updateInvoiceField: (field: keyof InvoiceFormData, value: any) => void;
  updateNestedField: (path: string, value: any) => void;
  updateItem: (index: number, field: keyof InvoiceItem, value: any) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  setApiErrors: (errors: Record<string, string>) => void;
  clearApiErrors: () => void;
  setGeneralError: (error: string | null) => void;
  updateFormData: (data: Partial<InvoiceFormData>) => void;
  submitForm: () => Promise<void>;

  // UI actions

  setPreviewMode: (mode: boolean) => void;
  setLoading: (loading: boolean) => void;
  setClientSearch: (search: string) => void;
  setShowClientDropdown: (show: boolean) => void;
  setSelectedClient: (client: ClientInfo | null) => void;
  setSelectedCompany: (company: CompanyInfo | null) => void;
  setError: (error: string | null) => void;

  // Validation
  validateForm: () => boolean;
  validateField: (field: keyof InvoiceFormData, value: any) => boolean;
  validateItem: (
    index: number,
    field: keyof InvoiceItem,
    value: any
  ) => boolean;
  setTouchedField: (field: string) => void;
  clearFieldError: (field: string) => void;
  setFormErrors: (errors: FormErrors) => void;

  // Calculations
  calculateTotals: () => InvoiceTotals;

  // Utility

  resetForm: () => void;
  loadInvoice: (
    invoiceData: Partial<InvoiceFormData> & {
      client?: ClientInfo;
      company?: CompanyInfo;
    }
  ) => void;
}

export type InvoiceStore = InvoiceState & InvoiceActions;

const defaultInvoiceForm: Partial<InvoiceFormData> = {
  companyId: "",
  clientId: "",
  invoiceNumber: "",
  invoiceDate: new Date().toISOString().split("T")[0],
  dueDate: "",
  currency: "USD",
  taxRate: 0,
  discountType: "percentage",
  discountValue: 0,
  notes: "",
  terms: "",
  recurring: {
    isRecurring: false,
    frequency: "monthly",
    nextDate: "",
    endDate: "",
  },
  items: { id: "", description: "", quantity: 1, rate: 0, amount: 0 },
};

// Create the store
const useInvoiceFormStore = create<InvoiceStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      invoiceForm: defaultInvoiceForm,
      previewMode: false,
      isLoading: false,
      clientSearch: "",
      showClientDropdown: false,
      selectedClient: null,
      selectedCompany: null,
      error: null,
      formErrors: {},

      // Form actions
      updateInvoiceField: (field, value) =>
        set((state) => ({
          invoiceForm: {
            ...state.invoiceForm,
            [field]: value,
          },
        })),

      updateNestedField: (path, value) =>
        set((state) => {
          const pathArray = path.split(".");
          const newForm = { ...state.invoiceForm };

          let current: any = newForm;
          for (let i = 0; i < pathArray.length - 1; i++) {
            current[pathArray[i]] = { ...current[pathArray[i]] };
            current = current[pathArray[i]];
          }
          current[pathArray[pathArray.length - 1]] = value;

          return { invoiceForm: newForm };
        }),

      updateItem: (index, field, value) =>
        set((state) => {
          const newItems = [...state.invoiceForm.items];
          newItems[index] = {
            ...newItems[index],
            [field]: value,
          };

          // Auto-calculate amount
          if (field === "quantity" || field === "rate") {
            const quantity =
              field === "quantity" ? Number(value) : newItems[index].quantity;
            const rate =
              field === "rate" ? Number(value) : newItems[index].rate;
            newItems[index].amount = quantity * rate;
          }

          return {
            invoiceForm: {
              ...state.invoiceForm,
              items: newItems,
            },
          };
        }),

      addItem: () =>
        set((state) => {
          const newItem = {
            id: crypto.randomUUID(),
            description: "New Item",
            quantity: 1,
            rate: 0,
            amount: 0,
          };

          const newState = {
            invoiceForm: {
              ...state.invoiceForm,
              items: [...state.invoiceForm.items, newItem],
            },
          };

          // Calculate totals for the new item
          const updatedItems = newState.invoiceForm.items.map((item) => ({
            ...item,
            amount: item.quantity * item.rate,
          }));

          return {
            ...newState,
            invoiceForm: {
              ...newState.invoiceForm,
              items: updatedItems,
            },
          };
        }),

      removeItem: (index: number) =>
        set((state) => {
          // Don't remove if it's the last item
          if (state.invoiceForm?.items?.length <= 1) {
            return state;
          }

          // Remove the item at the specified index
          const updatedItems = state.invoiceForm?.items?.filter(
            (_, i) => i !== index
          );

          return {
            invoiceForm: {
              ...state.invoiceForm,
              items: updatedItems,
            },
          };
        }),

      // UI actions
      setPreviewMode: (mode) => set({ previewMode: mode }),
      setLoading: (loading) => set({ isLoading: loading }),
      setClientSearch: (search) => set({ clientSearch: search }),
      setShowClientDropdown: (show) => set({ showClientDropdown: show }),
      setSelectedClient: (client) => set({ selectedClient: client }),
      setSelectedCompany: (company) => set({ selectedCompany: company }),
      setError: (error) => set({ error }),

      // Validation
      setFormErrors: (errors) => set({ formErrors: errors }),

      validateForm: () => {
        const { invoiceForm } = get();
        const errors: FormErrors = {};

        if (!invoiceForm.companyId)
          errors.companyId = "Company selection is required";
        if (!invoiceForm.clientId)
          errors.clientId = "Client selection is required";
        if (!invoiceForm.invoiceNumber)
          errors.invoiceNumber = "Invoice number is required";
        if (!invoiceForm.invoiceDate)
          errors.invoiceDate = "Invoice date is required";
        if (!invoiceForm.dueDate) errors.dueDate = "Due date is required";

        // Validate items
        invoiceForm?.items?.forEach((item, index) => {
          if (!item.description.trim()) {
            errors[`items.${index}.description`] = "Description is required";
          }
          if (!item.quantity || item.quantity <= 0) {
            errors[`items.${index}.quantity`] =
              "Quantity must be greater than 0";
          }
          if (item.rate < 0) {
            errors[`items.${index}.rate`] = "Rate cannot be negative";
          }
        });

        set({ formErrors: errors });
        return Object.keys(errors).length === 0;
      },

      // Calculate totals
      calculateTotals: (): InvoiceTotals => {
        const { invoiceForm } = get();
        const subtotal = invoiceForm.items.reduce(
          (sum, item) => sum + item.amount,
          0
        );

        let discount = 0;
        if (invoiceForm.discountType === "percentage") {
          discount = (subtotal * invoiceForm.discountValue) / 100;
        } else {
          discount = invoiceForm.discountValue;
        }

        const afterDiscount = subtotal - discount;
        const tax = (afterDiscount * invoiceForm.taxRate) / 100;
        const total = afterDiscount + tax;

        return {
          subtotal: Math.round(subtotal * 100) / 100,
          discount: Math.round(discount * 100) / 100,
          tax: Math.round(tax * 100) / 100,
          total: Math.round(total * 100) / 100,
        };
      },

      updateFormData: (data: Partial<InvoiceFormData>) =>
        set((state) => {
          const newApiErrors = { ...state.apiErrors };

          // Clear errors for updated fields
          Object.keys(data).forEach((key) => {
            delete newApiErrors[key];
          });

          return {
            invoiceForm: {
              ...state.invoiceForm,
              ...data,
            },
            apiErrors: newApiErrors,
          };
        }),
      setApiErrors: (errors: Record<string, string>) =>
        set(() => ({ apiErrors: errors })),

      clearApiErrors: () => set(() => ({ apiErrors: {} })),

      // Form submission with error handling
      submitForm: async () => {
        const { invoiceForm, setIsLoading, setApiErrors, setGeneralError } =
          get();

        // Clear previous errors
        setApiErrors({});
        setGeneralError(null);
        setIsLoading(true);

        try {
          const response = await fetch("/api/invoices/send-invoice", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(invoiceForm),
          });

          const result = await response.json();

          if (!response.ok) {
            // Handle field-specific errors
            if (result.errors) {
              setApiErrors(result.errors); // ✅ This sets the errors your JSX displays
            }

            // Handle general error
            if (result.message) {
              setGeneralError(result.message);
            }

            throw new Error(result.message || "Failed to create invoice");
          }

          // Success - clear all errors
          setApiErrors({});
          setGeneralError(null);

          // Handle success (maybe redirect or show success message)
          console.log("Invoice created successfully:", result.data);
        } catch (error) {
          // Handle network or other errors
          if (!get().generalError) {
            setGeneralError(
              error instanceof Error
                ? error.message
                : "An unexpected error occurred"
            );
          }
        } finally {
          setIsLoading(false);
        }
      },

      // Reset form
      resetForm: () =>
        set({
          invoiceForm: {
            ...defaultInvoiceForm,
            invoiceDate: new Date().toISOString().split("T")[0],
          },
          formErrors: {},
          selectedClient: null,
          selectedCompany: null,
          clientSearch: "",
          showClientDropdown: false,
          error: null,
        }),

      // Load invoice data (for editing)
      loadInvoice: (invoiceData) =>
        set({
          invoiceForm: {
            ...defaultInvoiceForm,
            ...invoiceData,
            invoiceDate:
              invoiceData.invoiceDate || new Date().toISOString().split("T")[0],
          },
          selectedClient: invoiceData.client || null,
          selectedCompany: invoiceData.company || null,
        }),
    }),
    {
      name: "invoice-store", // Store name for devtools
    }
  )
);

export default useInvoiceFormStore;
