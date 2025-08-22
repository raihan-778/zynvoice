"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useStore } from "zustand";
import type { StoreApi } from "zustand";
import { createInvoiceStore, type InvoiceStore } from "./invoiceStore";

const InvoiceStoreContext = createContext<StoreApi<InvoiceStore> | null>(null);

export const InvoiceStoreProvider = ({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData?: Partial<InvoiceStore["invoiceData"]>;
}) => {
  const storeRef = useRef<StoreApi<InvoiceStore>>();
  if (!storeRef.current) {
    storeRef.current = createInvoiceStore(initialData);
  }
  return (
    <InvoiceStoreContext.Provider value={storeRef.current}>
      {children}
    </InvoiceStoreContext.Provider>
  );
};

export const useInvoiceStore = <T>(
  selector: (s: InvoiceStore) => T = (s) => s as T
) => {
  const ctx = useContext(InvoiceStoreContext);
  if (!ctx) throw new Error("Missing InvoiceStoreProvider");
  return useStore(ctx, selector);
};
