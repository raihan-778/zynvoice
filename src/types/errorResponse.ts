import { InvoiceFormData } from "@/lib/validations/validation";

export type ValidationErrors<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? ValidationErrors<U>[]
    : T[K] extends object
    ? ValidationErrors<T[K]>
    : string;
};

export type InvoiceFormErrors = ValidationErrors<InvoiceFormData>;
