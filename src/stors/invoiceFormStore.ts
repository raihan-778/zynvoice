import {
  ClientInfo,
  CompanyInfo,
  InvoiceFormData,
} from "@/lib/validations/validation";
import {
  InvoiceCalculations,
  InvoicePdfProps,
  ITemplate,
} from "@/types/database";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Types for our store
interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface RecurringSettings {
  isRecurring: boolean;
  frequency: "weekly" | "monthly" | "quarterly" | "yearly";
  nextDate?: string;
  endDate?: string;
}

interface FormErrors {
  [key: string]: string;
}

interface InvoiceStoreState {
  // Form Data
  formData: InvoiceFormData;

  // UI State
  isLoading: boolean;
  isGenerating: boolean;
  previewMode: boolean;
  showClientDropdown: boolean;
  clientSearch: string;
  isInitialLoading: boolean;
  invoiceNumber: string;

  // Selected entities
  selectedClient: any | null;
  selectedCompany: any | null;

  // Calculations
  calculations: InvoiceCalculations;

  // Error handling
  formErrors: FormErrors;
  apiErrors: Record<string, string>;
  generalError: string | null;

  // API data
  companies: CompanyInfo[];
  clients: ClientInfo[];
  currencies: Array<{ code: string; symbol: string; name: string }>;

  // Default template
  defaultTemplate: Partial<ITemplate>;
}

interface InvoiceStoreActions {
  // Form field updates
  updateFormField: (field: keyof InvoiceFormData, value: any) => void;
  updateNestedField: (path: string, value: any) => void;

  // Item management
  addItem: () => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, field: keyof InvoiceItem, value: any) => void;

  // Client/Company management
  setSelectedClient: (client: ClientInfo) => void;
  setSelectedClientSafe: (client: ClientInfo) => void;
  setSelectedCompany: (company: CompanyInfo) => void;
  setClientSearch: (search: string) => void;
  setShowClientDropdown: (show: boolean) => void;

  // Data loading
  setCompanies: (companies: CompanyInfo[]) => void;
  setClients: (clients: ClientInfo[]) => void;
  loadInitialData: () => Promise<void>;
  setInitialLoading: (loading: boolean) => void;

  // UI state management
  setLoading: (loading: boolean) => void;
  setGenerating: (generating: boolean) => void;
  setPreviewMode: (preview: boolean) => void;

  // Error management
  setFormError: (field: string, message: string) => void;
  clearFormError: (field: string) => void;
  setApiErrors: (errors: Record<string, string>) => void;
  setGeneralError: (error: string | null) => void;
  clearAllErrors: () => void;

  // Calculations
  calculateAmounts: () => void;

  // Utility functions
  generateInvoiceNumber: () => void;
  resetForm: () => void;
  validateForm: () => boolean;

  calculateDueDate: (field: number) => void;

  // PDF functions
  getInvoicePDFProps: () => InvoicePdfProps;

  // Form submission
  getFormData: () => InvoiceFormData;
}

type InvoiceStore = InvoiceStoreState & InvoiceStoreActions;

// Default form data
const defaultFormData: InvoiceFormData = {
  companyId: "",
  clientId: "",
  invoiceNumber: `INV-${Date.now()}`,
  invoiceDate: new Date().toISOString(),
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  items: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
  taxRate: 0,
  discountType: "percentage",
  discountValue: 0,
  currency: "USD",
  notes: "",
  terms: "",
  paymentTerms: 30,
  recurring: {
    isRecurring: false,
    frequency: "monthly",
    nextDate: undefined,
    endDate: undefined,
  },
  status: "draft",
  subtotal: 0,
  taxAmount: 0,
  discountAmount: 0,
  total: 0,
  paidAmount: 0,
};

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
];

const defaultTemplate: Partial<ITemplate> = {
  name: "Default",
  primaryColor: "#2563eb",
  secondaryColor: "#64748b",
  fontFamily: "Helvetica",
  fontSize: 12,
  showLogo: true,
  showCompanyAddress: true,
  showClientAddress: true,
  showInvoiceNumber: true,
  showDates: true,
  showPaymentTerms: true,
  showNotes: true,
  showTerms: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Helper function to set nested values
const setNestedValue = (obj: any, path: string, value: any) => {
  const keys = path.split(".");
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
};

export const useInvoiceFormStore = create<InvoiceStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      formData: { ...defaultFormData },
      isLoading: false,
      isGenerating: false,
      previewMode: false,
      showClientDropdown: false,
      clientSearch: "",
      isInitialLoading: true,
      selectedClient: null,
      selectedCompany: null,
      calculations: {
        subtotal: 0,
        discountAmount: 0,
        taxAmount: 0,
        total: 0,
      },
      formErrors: {},
      apiErrors: {},
      generalError: null,
      companies: [],
      clients: [],
      invoiceNumber: "",
      currencies,
      defaultTemplate,

      // Data loading actions
      setCompanies: (companies) => {
        set({ companies });
      },

      setClients: (clients) => {
        set({ clients });
      },

      setInitialLoading: (loading) => {
        set({ isInitialLoading: loading });
      },

      loadInitialData: async () => {
        try {
          set({ isInitialLoading: true });

          // Load companies
          const companiesResponse = await fetch("/api/companies/get-company");
          const companyData = await companiesResponse.json();
          const companies = companyData.data.companies;

          console.log("Loaded companies:", companies);
          get().setCompanies(companies);

          // Load clients
          const clientsResponse = await fetch("/api/clients/get-client");
          const clientData = await clientsResponse.json();
          const clients = clientData.data;

          console.log("Loaded clients:", clients);
          get().setClients(clients);

          console.log(
            "Initial data loaded successfully - Companies:",
            companies,
            "Clients:",
            clients
          );
        } catch (error) {
          console.error("Error loading initial data:", error);
          get().setGeneralError("Failed to load initial data");
        } finally {
          set({ isInitialLoading: false });
        }
      },

      // Actions
      // Actions
      updateFormField: (field, value) => {
        set((state) => ({
          formData: {
            ...state.formData,
            [field]: value,
          },
        }));

        // Auto-calculate when relevant fields change
        if (
          ["items", "taxRate", "discountType", "discountValue"].includes(field)
        ) {
          get().calculateAmounts();
        }

        // Handle company selection
        if (field === "companyId") {
          const company = get().companies.find((c) => c._id === value);
          get().setSelectedCompany(company || null);
        }
      },

      updateNestedField: (path, value) => {
        set((state) => {
          const newFormData = { ...state.formData };
          setNestedValue(newFormData, path, value);
          return { formData: newFormData };
        });

        // Auto-calculate if items changed
        if (path.startsWith("items")) {
          get().calculateAmounts();
        }
      },
      addItem: () => {
        set((state) => ({
          formData: {
            ...state?.formData,
            items: [
              ...state?.formData?.items,
              { description: "", quantity: 1, rate: 0, amount: 0 },
            ],
          },
        }));
      },

      removeItem: (index) => {
        const { formData } = get();
        if (formData.items && formData?.items?.length > 1) {
          set((state) => ({
            formData: {
              ...state.formData,
              items: state.formData.items?.filter((_, i) => i !== index),
            },
          }));
          get().calculateAmounts();
        }
      },

      updateItem: (index, field, value) => {
        set((state) => ({
          formData: {
            ...state.formData,
            items: state.formData.items?.map((item, i) =>
              i === index ? { ...item, [field]: value } : item
            ),
          },
        }));
        get().calculateAmounts();
      },

      // Helper function to calculate due date safely
      calculateDueDate: (paymentTerms) => {
        // Only calculate if we're on the client side
        if (typeof window === "undefined") return "";

        const dueDate = new Date(
          Date.now() + paymentTerms * 24 * 60 * 60 * 1000
        );
        return dueDate.toISOString().split("T")[0];
      },

      // Alternative approach: Set client without calculating due date immediately
      setSelectedClientSafe: (client) => {
        set({ selectedClient: client });
        if (client) {
          get().updateFormField("clientId", client._id);
          get().updateFormField("paymentTerms", client.paymentTerms);

          // Don't calculate due date immediately - let it be calculated when needed
          // Or trigger it in a useEffect in the component

          // Update UI
          get().setClientSearch(client.name);
          get().setShowClientDropdown(false);
        }
      },

      // Function to update due date (call this from useEffect in component)
      updateDueDate: (paymentTerms) => {
        const dueDate = new Date(
          Date.now() + paymentTerms * 24 * 60 * 60 * 1000
        );
        const dueDateString = dueDate.toISOString().split("T")[0];
        get().updateFormField("dueDate", dueDateString);
      },

      setSelectedCompany: (company) => {
        set({ selectedCompany: company });
      },

      setClientSearch: (search) => {
        set({ clientSearch: search });
      },

      setShowClientDropdown: (show) => {
        set({ showClientDropdown: show });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setGenerating: (generating) => {
        set({ isGenerating: generating });
      },

      setPreviewMode: (preview) => {
        set({ previewMode: preview });
      },

      setFormError: (field, message) => {
        set((state) => ({
          formErrors: {
            ...state.formErrors,
            [field]: message,
          },
        }));
      },

      clearFormError: (field) => {
        set((state) => {
          const newErrors = { ...state.formErrors };
          delete newErrors[field];
          return { formErrors: newErrors };
        });
      },

      setApiErrors: (errors) => {
        set({ apiErrors: errors });
      },

      setGeneralError: (error) => {
        set({ generalError: error });
      },

      clearAllErrors: () => {
        set({
          formErrors: {},
          apiErrors: {},
          generalError: null,
        });
      },

      calculateAmounts: () => {
        const { formData } = get();
        const { items, taxRate, discountType, discountValue } = formData;

        let subtotal = 0;

        // Calculate subtotal and update item amounts
        const updatedItems = items?.map((item) => {
          const amount = (item.quantity || 0) * (item.rate || 0);
          subtotal += amount;
          return { ...item, amount };
        });

        // Update items with calculated amounts
        set((state) => ({
          formData: {
            ...state.formData,
            items: updatedItems,
          },
        }));

        // Calculate discount
        let discountAmount = 0;
        if (discountType === "percentage") {
          discountAmount = (subtotal * (discountValue || 0)) / 100;
        } else {
          discountAmount = discountValue || 0;
        }

        // Calculate tax
        const taxableAmount = subtotal - discountAmount;
        const taxAmount = (taxableAmount * (taxRate || 0)) / 100;
        const total = taxableAmount + taxAmount;

        // Update calculations
        set({
          calculations: {
            subtotal,
            discountAmount,
            taxAmount,
            total,
          },
        });
      },

      generateInvoiceNumber: () => {
        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0");
        const invoiceNumber = `INV-${timestamp}-${randomSuffix}`;
        get().updateFormField("invoiceNumber", invoiceNumber);
      },
      // Validation
      // validateForm: () => {
      //   const { formData } = get();
      //   const errors = {};

      //   // Required fields validation
      //   if (!formData.invoiceNumber) {
      //     errors.invoiceNumber = "Invoice number is required";
      //   }

      //   if (!formData.invoiceDate) {
      //     errors.invoiceDate = "Invoice date is required";
      //   }

      //   if (!formData.dueDate) {
      //     errors.dueDate = "Due date is required";
      //   }

      //   if (!formData.clientId) {
      //     errors.clientId = "Client selection is required";
      //   }

      //   // Items validation
      //   if (!formData.items || formData.items.length === 0) {
      //     errors.items = "At least one item is required";
      //   } else {
      //     const itemErrors = [];
      //     formData.items.forEach((item, index) => {
      //       const itemError = {};

      //       if (!item.description) {
      //         itemError.description = "Description is required";
      //       }

      //       if (!item.quantity || item.quantity <= 0) {
      //         itemError.quantity = "Quantity must be greater than 0";
      //       }

      //       if (item.rate === undefined || item.rate < 0) {
      //         itemError.rate = "Rate cannot be negative";
      //       }

      //       if (Object.keys(itemError).length > 0) {
      //         itemErrors[index] = itemError;
      //       }
      //     });

      //     if (itemErrors.length > 0) {
      //       errors.items = itemErrors;
      //     }
      //   }

      //   // Recurring validation
      //   if (formData.recurring?.isRecurring) {
      //     if (!formData.recurring.frequency) {
      //       errors.recurringFrequency =
      //         "Frequency is required for recurring invoices";
      //     }

      //     if (!formData.recurring.nextDate) {
      //       errors.recurringNextDate =
      //         "Next invoice date is required for recurring invoices";
      //     }
      //   }

      //   set({ validationErrors: errors });
      //   return Object.keys(errors).length === 0;
      // },
      validateForm: () => {
        const { formData, selectedClient, selectedCompany } = get();
        const errors: FormErrors = {};

        // Required field validation
        if (!formData.companyId)
          errors.companyId = "Company selection is required";
        if (!formData.clientId)
          errors.clientId = "Client selection is required";
        if (!formData.invoiceNumber)
          errors.invoiceNumber = "Invoice number is required";
        if (!formData.invoiceDate)
          errors.invoiceDate = "Invoice date is required";
        if (!formData.dueDate) errors.dueDate = "Due date is required";

        // Items validation
        formData?.items?.forEach((item, index) => {
          if (!item.description) {
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

      // Clear validation errors
      // clearValidationErrors: () => {
      //   set({ validationErrors: {} });
      // },

      resetForm: () => {
        set({
          formData: { ...defaultFormData },
          selectedClient: null,
          selectedCompany: null,
          clientSearch: "",
          showClientDropdown: false,
          previewMode: false,
          calculations: {
            subtotal: 0,
            discountAmount: 0,
            taxAmount: 0,
            total: 0,
          },
        });
        get().clearAllErrors();
      },

      getInvoicePDFProps: () => {
        const {
          formData,
          selectedClient,
          selectedCompany,
          calculations,
          defaultTemplate,
        } = get();

        return {
          invoiceData: formData,
          selectedClient,
          selectedCompany,
          calculations,
          template: defaultTemplate,
        };
      },

      getFormData: () => {
        const { formData, calculations } = get();
        return {
          ...formData,
          subtotal: calculations.subtotal,
          discountAmount: calculations.discountAmount,
          taxAmount: calculations.taxAmount,
          total: calculations.total,
        };
      },
    }),
    {
      name: "invoice-store",
    }
  )
);

// Computed selectors (optional, for complex derived state)
export const useInvoiceSelectors = () => {
  const store = useInvoiceFormStore();

  return {
    // Filtered clients based on search
    filteredClients: store.clients.filter(
      (client) =>
        client.status === "active" &&
        (client.name.toLowerCase().includes(store.clientSearch.toLowerCase()) ||
          client?.email
            .toLowerCase()
            .includes(store.clientSearch.toLowerCase()) ||
          (client.company &&
            client.company
              .toLowerCase()
              .includes(store.clientSearch.toLowerCase())))
    ),

    // Selected currency info
    selectedCurrency: store.currencies.find(
      (c) => c.code === store.formData.currency
    ),

    // Form validation state
    hasErrors: Object.keys(store.formErrors).length > 0,

    // Ready to preview/submit
    isFormReady:
      store.formData.companyId &&
      store.formData.clientId &&
      store?.formData?.items.length > 0,
  };
};
