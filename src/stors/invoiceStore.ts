// stores/invoiceStore.ts
import {
  ClientInfo,
  CompanyInfo,
  InvoiceFormData,
  InvoiceItem,
} from "@/lib/validations/validation";
import { InvoiceCalculations, ITemplate } from "@/types/database";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Store interface
interface InvoiceStore {
  // State
  invoiceData: InvoiceFormData;
  selectedCompany: CompanyInfo | null;
  selectedClient: ClientInfo | null;
  calculations: InvoiceCalculations;
  template: ITemplate;
  companies: CompanyInfo[];
  clients: ClientInfo[];
  templates: ITemplate[];

  // UI State
  isGenerating: boolean;
  error: string | null;

  // Actions
  setInvoiceData: (data: Partial<InvoiceFormData>) => void;
  setSelectedCompany: (company: CompanyInfo | null) => void;
  setSelectedClient: (client: ClientInfo | null) => void;
  setCalculations: (calculations: InvoiceCalculations) => void;
  setTemplate: (template: ITemplate) => void;
  setCompanies: (companies: CompanyInfo[]) => void;
  setClients: (clients: ClientInfo[]) => void;
  setTemplates: (templates: ITemplate[]) => void;

  // Invoice Items
  addItem: (item: InvoiceItem) => void;
  updateItem: (id: string, updates: Partial<InvoiceItem>) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;

  // UI Actions
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;

  // Computed getters
  getInvoicePDFProps: () => {
    invoiceData: InvoiceFormData;
    selectedCompany: CompanyInfo;
    selectedClient: ClientInfo;
    calculations: InvoiceCalculations;
    template: ITemplate;
  } | null;

  // Utility actions
  resetInvoice: () => void;
  calculateTotals: () => void;
}

// Default values
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

const defaultInvoiceData: Partial<InvoiceFormData> = {
  invoiceNumber: "",
  invoiceDate: new Date(),
  dueDate: new Date(),
  status: "draft",
  currency: "USD",
  items: [],
  subtotal: 0,
  taxRate: 0,
  taxAmount: 0,
  discountType: "percentage",
  discountValue: 0,
  discountAmount: 0,
  total: 0,
  notes: "",
  terms: "",
  paymentTerms: 30,
};

const defaultCalculations: InvoiceCalculations = {
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
      selectedClient: null,
      calculations: defaultCalculations,
      template: defaultTemplate,
      companies: [],
      clients: [],
      templates: [defaultTemplate],

      // UI State
      isGenerating: false,
      error: null,

      // Actions
      setInvoiceData: (data) =>
        set(
          (state) => ({
            invoiceData: { ...state.invoiceData, ...data },
          }),
          false,
          "setInvoiceData"
        ),

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
      addItem: (item) =>
        set(
          (state) => ({
            invoiceData: {
              ...state.invoiceData,
              items: [...state.invoiceData.items, item],
            },
          }),
          false,
          "addItem"
        ),

      updateItem: (id, updates) =>
        set(
          (state) => ({
            invoiceData: {
              ...state.invoiceData,
              items: state.invoiceData.items.map((item) =>
                item.id === id ? { ...item, ...updates } : item
              ),
            },
          }),
          false,
          "updateItem"
        ),

      removeItem: (id) =>
        set(
          (state) => ({
            invoiceData: {
              ...state.invoiceData,
              items: state.invoiceData.items.filter((item) => item.id !== id),
            },
          }),
          false,
          "removeItem"
        ),

      clearItems: () =>
        set(
          (state) => ({
            invoiceData: {
              ...state.invoiceData,
              items: [],
            },
          }),
          false,
          "clearItems"
        ),

      // UI Actions
      setIsGenerating: (isGenerating) =>
        set({ isGenerating }, false, "setIsGenerating"),

      setError: (error) => set({ error }, false, "setError"),

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
            template: defaultTemplate,
            isGenerating: false,
            error: null,
          },
          false,
          "resetInvoice"
        ),

      calculateTotals: () =>
        set(
          (state) => {
            const { items, taxRate, discountType, discountValue } =
              state.invoiceData;

            // Calculate subtotal
            const subtotal = items.reduce((sum, item) => sum + item.amount, 0);

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
