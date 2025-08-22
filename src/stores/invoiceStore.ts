// stores/invoiceStore.ts
import {
  ClientInfo,
  CompanyInfo,
  InvoiceFormData,
  InvoiceItem,
} from "@/lib/validations/validation";
import { ErrorResponse } from "@/types/apiResponse";
import {
  IInvoiceCalculations,
  IInvoiceItem,
  ITemplate,
} from "@/types/database";
import { Types } from "mongoose";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

//Email State
export interface EmailState {
  isEmailSending: boolean;
  emailError: string | null;
  emailSuccess: boolean;
  emailHistory: EmailRecord[];
  emailTemplates: EmailTemplate[];
  selectedEmailTemplate: EmailTemplate | null;
}

export interface EmailRecord {
  id: string;
  invoiceId: string;
  recipientEmail: string;
  subject: string;
  status: "sent" | "failed" | "pending";
  sentAt: Date;
  error?: string;
  attachmentType: "pdf" | "image";
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  isDefault: boolean;
}

interface SendEmailOptions {
  recipientEmail: string;
  subject: string;
  message: string;
  attachmentType: "pdf" | "image";
  imageFormat?: "png" | "jpeg";
  templateId?: string;
}

// Store interface
interface InvoiceStore {
  // State
  invoiceData: InvoiceFormData;

  selectedCompany: CompanyInfo | null;
  selectedClient: ClientInfo | null;
  calculations: IInvoiceCalculations;
  template: ITemplate;
  companies: CompanyInfo[];
  clients: ClientInfo[];
  templates: ITemplate[];

  // UI State
  isGenerating: boolean;
  validationErrors: unknown;
  error: string | null;
  isLoading: boolean;
  previewMode: boolean;
  showClientDropdown: boolean;
  clientSearch: string;
  apiErrors: ErrorResponse;
  invoiceNumber: string;

  // Email State
  emailState: EmailState;

  // Email Actions
  sendInvoiceEmail: (options: SendEmailOptions) => Promise<void>;
  setEmailSending: (sending: boolean) => void;
  setEmailError: (error: string | null) => void;
  setEmailSuccess: (success: boolean) => void;
  loadEmailHistory: (invoiceId: string) => Promise<void>;
  loadEmailTemplates: () => Promise<void>;
  setSelectedEmailTemplate: (template: EmailTemplate | null) => void;
  exportInvoiceAsImage: (format: "png" | "jpeg") => Promise<Blob>;

  // Actions
  setInvoiceData: (data: Partial<InvoiceFormData>) => void;
  setSelectedCompany: (company: CompanyInfo | null) => void;
  setSelectedClient: (client: ClientInfo | null) => void;
  setCalculations: (calculations: IInvoiceCalculations) => void;
  setTemplate: (template: ITemplate) => void;
  setCompanies: (companies: CompanyInfo[]) => void;
  setClients: (clients: ClientInfo[]) => void;
  setTemplates: (templates: ITemplate[]) => void;

  resetForm: () => void;
  updateFormData: (data: Partial<InvoiceFormData>) => void;

  setIsLoading: (loading: boolean) => void;

  setPreviewMode: (preview: boolean) => void;
  setShowClientDropdown: (show: boolean) => void;
  setClientSearch: (value: string) => void;

  setApiErrors: (errors: ErrorResponse) => void;

  generateInvoiceNumber: () => void;

  // Invoice Items
  addItem: (item: InvoiceItem) => void;
  setSelectedInvoiceClient: (client: []) => void;
  updateInvoiceData: (data: []) => void;
  updateItem: (id: string, updates: Partial<InvoiceItem>) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;

  // UI Actions
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  setvalidationErrors: (formValidationError: InvoiceFormData) => void;

  // Computed getters
  getInvoicePDFProps: () => {
    invoiceData: InvoiceFormData;
    selectedCompany: CompanyInfo;
    selectedClient: ClientInfo;
    calculations: IInvoiceCalculations;
    template: ITemplate;
  } | null;

  // Utility actions
  resetInvoice: () => void;
  calculateTotals: () => void;
}

// Default values
const defaultPDFTemplate = {
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

  userId: undefined, // optional in interface
  // satisfies string | "defult"
  description: "Clean default layout",
  layout: "modern",

  logoPosition: "left",

  // BaseDocument fields
  isDefault: true,
  isPublic: false,

  _id: new Types.ObjectId(),
} as unknown as ITemplate;

const defaultInvoiceData: InvoiceFormData = {
  invoiceNumber: "",
  invoiceDate: new Date().toISOString().split("T")[0],
  dueDate: "",
  status: "draft",
  currency: "USD",
  items: [{ id: "", description: "", quantity: 1, rate: 0, amount: 0 }],
  subtotal: 0,
  taxRate: 0,
  taxAmount: 0,
  discountType: "percentage",
  discountValue: 0,
  discountAmount: 0,
  paidAmount: 0,
  total: 0,
  notes: "",
  terms: "",

  paymentTerms: 30,
  companyId: "",
  clientId: "",
  recurring: {
    isRecurring: false,
    frequency: "monthly",
    nextDate: "",
    endDate: "",
  },
};

const defaultCalculations: IInvoiceCalculations = {
  subtotal: 0,
  taxAmount: 0,
  discountAmount: 0,
  total: 0,
};

// Create store
export const useInvoiceStore = create<InvoiceStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      invoiceData: defaultInvoiceData,
      selectedCompany: null,
      invoiceDate: null,
      dueDate: null,
      selectedClient: null,
      calculations: defaultCalculations,
      template: defaultPDFTemplate,
      companies: [],
      clients: [],
      templates: [defaultInvoiceData],
      // UI State
      isGenerating: false,
      error: null,
      formValidationError: false,

      // Actions
      setInvoiceData: (data) => {
        set(
          (state) => ({
            invoiceData: { ...state.invoiceData, ...data },
          }),
          false,
          "setInvoiceData"
        );
        get().calculateTotals();
      },

      // / Method 1: Enhanced updateInvoiceData method

      setSelectedCompany: (company) =>
        set({ selectedCompany: company }, false, "setSelectedCompany"),

      setSelectedClient: (client) =>
        set({ selectedClient: client }, false, "setSelectedClient"),

      setCalculations: (calculations) =>
        set({ calculations }, false, "setCalculations"),

      setTemplate: (template) => set({ template }, false, "setTemplate"),

      setCompanies: (companies) => set({ companies }, false, "setCompanies"),

      setClients: (clients) => set({ clients }, false, "setClients"),

      setTemplates: (templates) => set({ templates }, false, "setTemplates"),

      // Invoice Items
      addItem: (item: IInvoiceItem) => {
        set(
          (state) => ({
            invoiceData: {
              ...state?.invoiceData,
              items: [...(state?.invoiceData?.items || []), item],
            },
          }),
          false,
          "addItem"
        );
        get().calculateTotals();
      },

      updateItem: (id, updates) => {
        set(
          (state) => ({
            invoiceData: {
              ...state.invoiceData,
              items: state?.invoiceData?.items?.map((item) =>
                item.id === id ? { ...item, ...updates } : item
              ),
            },
          }),
          false,
          "updateItem"
        );
        get().calculateTotals();
      },

      removeItem: (id) => {
        set(
          (state) => ({
            invoiceData: {
              ...state.invoiceData,
              items: state.invoiceData?.items?.filter((item) => item.id !== id),
            },
          }),
          false,
          "removeItem"
        );
        get().calculateTotals();
      },

      clearItems: () => {
        set(
          (state) => ({
            invoiceData: {
              ...state.invoiceData,
              items: [],
            },
          }),
          false,
          "clearItems"
        );
        get().calculateTotals();
      },

      invoiceNumber: "",

      generateInvoiceNumber: () => {
        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0");

        const generated = `INV-${timestamp}-${randomSuffix}`;

        set({ invoiceNumber: generated }, false, "generateInvoiceNumber");
      },

      // UI Actions
      setIsGenerating: (isGenerating) =>
        set({ isGenerating }, false, "setIsGenerating"),

      setError: (error) => set({ error }, false, "setError"),
      setvalidationErrors: (validationErrors: InvoiceFormData) =>
        set({ validationErrors }, false, "setFormValidationError"),
      // Computed getters
      getInvoicePDFProps: () => {
        const state = get();
        if (!state.selectedCompany || !state.selectedClient) {
          return null;
        }

        return {
          invoiceData: state.invoiceData,
          selectedCompany: state.selectedCompany,
          selectedClient: state.selectedClient,
          calculations: state.calculations,
          template: state.template,
          templates: state.templates,
        };
      },

      // Utility actions
      resetInvoice: () =>
        set(
          {
            invoiceData: defaultInvoiceData,
            selectedCompany: null,
            selectedClient: null,
            calculations: defaultCalculations,
            template: defaultPDFTemplate,
            isGenerating: false,
            error: null,
          },
          false,
          "resetInvoice"
        ),

      calculateTotals: () =>
        set(
          (state) => {
            const {
              items = [],
              taxRate = 0,
              discountType = "percentage",
              discountValue = 0,
            } = state.invoiceData || {};

            // Calculate subtotal
            const subtotal = items?.reduce((sum, item) => sum + item.amount, 0);

            // Calculate discount
            let discountAmount = 0;
            if (discountType === "percentage") {
              discountAmount = (subtotal * discountValue) / 100;
            } else {
              discountAmount = discountValue;
            }

            // Calculate tax
            const taxableAmount = subtotal - discountAmount;
            const taxAmount = (taxableAmount * taxRate) / 100;

            // Calculate total
            const total = taxableAmount + taxAmount;

            const newCalculations = {
              subtotal,
              taxAmount,
              discountAmount,
              total,
            };

            return {
              calculations: newCalculations,
              invoiceData: {
                ...state.invoiceData,
                subtotal,
                taxAmount,
                discountAmount,
                total,
              },
            };
          },
          false,
          "calculateTotals"
        ),
    }),
    {
      name: "invoice-store", // unique name for devtools
    }
  )
);
