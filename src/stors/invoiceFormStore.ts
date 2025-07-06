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

  // Validation errors
  formErrors: FormErrors;
}

export interface InvoiceActions {
  // Form actions

  updateInvoiceField: (field: keyof InvoiceFormData, value: any) => void;
  updateNestedField: (path: string, value: any) => void;
  updateItem: (index: number, field: keyof InvoiceItem, value: any) => void;
  addItem: () => void;
  removeItem: (index: number) => void;

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

// Default form state
const defaultInvoiceForm: InvoiceFormData = {
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
const useInvoiceStore = create<InvoiceStore>()(
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
        set((state) => ({
          invoiceForm: {
            ...state.invoiceForm,
            items: [
              ...state.invoiceForm.items,
              {
                description: "",
                quantity: 1,
                rate: 0,
                amount: 0,
              },
            ],
          },
        })),

      removeItem: (index) =>
        set((state) => ({
          invoiceForm: {
            ...state.invoiceForm,
            items:
              state.invoiceForm.items.length > 1
                ? state.invoiceForm.items.filter((_, i) => i !== index)
                : state.invoiceForm.items,
          },
        })),

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
        invoiceForm.items.forEach((item, index) => {
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

export default useInvoiceStore;
