import type { StateCreator } from "zustand";
import type { InvoiceItem } from "../types";

export interface ItemsSlice {
  addItem: (item: InvoiceItem) => void;
  updateItem: (id: string, updates: Partial<InvoiceItem>) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
}

export const createItemsSlice: StateCreator<ItemsSlice, [], [], ItemsSlice> = (
  set,
  get
) => ({
  addItem: (item) => {
    set(
      (state) => ({
        invoiceData: {
          ...state.invoiceData,
          items: [...state.invoiceData.items, item],
        },
      }),
      false,
      "items/addItem"
    );
    get().calculateTotals();
  },

  updateItem: (id, updates) => {
    set(
      (state) => ({
        invoiceData: {
          ...state.invoiceData,
          items: state.invoiceData.items.map((i) =>
            i.id === id ? { ...i, ...updates } : i
          ),
        },
      }),
      false,
      "items/updateItem"
    );
    get().calculateTotals();
  },

  removeItem: (id) => {
    set(
      (state) => ({
        invoiceData: {
          ...state.invoiceData,
          items: state.invoiceData.items.filter((i) => i.id !== id),
        },
      }),
      false,
      "items/removeItem"
    );
    get().calculateTotals();
  },

  clearItems: () => {
    set(
      (state) => ({ invoiceData: { ...state.invoiceData, items: [] } }),
      false,
      "items/clearItems"
    );
    get().calculateTotals();
  },
});
