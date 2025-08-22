import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createItemsSlice, type ItemsSlice } from "./slices/itemsSlice";
import { createEmailSlice, type EmailSlice } from "./slices/emailSlice";
import type {
  InvoiceFormData,
  IInvoiceCalculations,
  ITemplate,
  CompanyInfo,
  ClientInfo,
} from "./types";

export interface InvoiceStore extends ItemsSlice, EmailSlice {
  invoiceData: InvoiceFormData;
  selectedCompany: CompanyInfo | null;
  selectedClient: ClientInfo | null;
  calculations: IInvoiceCalculations;
  template: ITemplate;
  companies: CompanyInfo[];
  clients: ClientInfo[];
  templates: ITemplate[];

  setInvoiceData: (data: Partial<InvoiceFormData>) => void;
  setSelectedCompany: (c: CompanyInfo | null) => void;
  setSelectedClient: (c: ClientInfo | null) => void;
  setTemplate: (t: ITemplate) => void;
  setCompanies: (list: CompanyInfo[]) => void;
  setClients: (list: ClientInfo[]) => void;
  setTemplates: (list: ITemplate[]) => void;
  resetInvoice: () => void;
  calculateTotals: () => void;
  generateInvoiceNumber: () => void;
}

const defaultInvoiceData: InvoiceFormData = {
  /* same as before */
};
const defaultCalculations: IInvoiceCalculations = {
  /* same */
};
const defaultTemplate: ITemplate = {
  /* same */
};

export const createInvoiceStore = (init?: Partial<InvoiceFormData>) =>
  create<InvoiceStore>()(
    devtools(
      immer((set, get, ...rest) => ({
        // static
        invoiceData: { ...defaultInvoiceData, ...init },
        selectedCompany: null,
        selectedClient: null,
        calculations: defaultCalculations,
        template: defaultTemplate,
        companies: [],
        clients: [],
        templates: [],

        setInvoiceData: (patch) =>
          set(
            (s) => ({ invoiceData: { ...s.invoiceData, ...patch } }),
            false,
            "invoice/setInvoiceData"
          ),

        setSelectedCompany: (c) => set({ selectedCompany: c }),
        setSelectedClient: (c) => set({ selectedClient: c }),
        setTemplate: (t) => set({ template: t }),
        setCompanies: (list) => set({ companies: list }),
        setClients: (list) => set({ clients: list }),
        setTemplates: (list) => set({ templates: list }),

        resetInvoice: () =>
          set(
            {
              invoiceData: { ...defaultInvoiceData, ...init },
              selectedCompany: null,
              selectedClient: null,
              calculations: defaultCalculations,
              template: defaultTemplate,
            },
            false,
            "invoice/reset"
          ),

        generateInvoiceNumber: () => {
          const number = `INV-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 4)
            .toUpperCase()}`;
          set(
            (s) => ({
              invoiceData: { ...s.invoiceData, invoiceNumber: number },
            }),
            false,
            "invoice/generateNumber"
          );
        },

        calculateTotals: () =>
          set(
            (s) => {
              const { items, taxRate, discountType, discountValue } =
                s.invoiceData;
              const subtotal = items.reduce((sum, i) => sum + i.amount, 0);

              const discountAmount =
                discountType === "percentage"
                  ? (subtotal * discountValue) / 100
                  : discountValue || 0;

              const taxable = subtotal - discountAmount;
              const taxAmount = (taxable * taxRate) / 100;
              const total = taxable + taxAmount;

              s.calculations = { subtotal, discountAmount, taxAmount, total };
              s.invoiceData.subtotal = subtotal;
              s.invoiceData.discountAmount = discountAmount;
              s.invoiceData.taxAmount = taxAmount;
              s.invoiceData.total = total;
            },
            false,
            "invoice/calculate"
          ),

        // mix in slices
        ...createItemsSlice(set, get, ...rest),
        ...createEmailSlice(set, get, ...rest),
      })),
      { name: "invoiceStore" }
    )
  );
