import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export function formatCurrency(amount: number, currency: string): string {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//   }).format(amount);
// }

// export function formatDate(date: Date): string {
//   return new Intl.DateTimeFormat("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   }).format(date);
// }

// export function generateInvoiceNumber(): string {
//   const now = new Date();
//   const year = now.getFullYear();
//   const month = String(now.getMonth() + 1).padStart(2, "0");
//   const day = String(now.getDate()).padStart(2, "0");
//   const random = Math.floor(Math.random() * 1000)
//     .toString()
//     .padStart(3, "0");

//   return `INV-${year}${month}${day}-${random}`;
// }

export function calculateItemAmount(quantity: number, rate: number): number {
  return Math.round(quantity * rate * 100) / 100;
}

export function calculateSubtotal(items: { amount: number }[]): number {
  return (
    Math.round(items.reduce((sum, item) => sum + item.amount, 0) * 100) / 100
  );
}

export function calculateTax(subtotal: number, taxRate: number): number {
  return Math.round(((subtotal * taxRate) / 100) * 100) / 100;
}

export function calculateTotal(subtotal: number, taxAmount: number): number {
  return Math.round((subtotal + taxAmount) * 100) / 100;
}

export function formatDate(date: Date | string | undefined): string {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export function generateInvoiceNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `INV-${timestamp}-${random}`;
}

// 15. PERFORMANCE OPTIMIZATIONS
// ===========================================

import { useEffect, useState } from "react";

// utils/animationUtils.ts
export const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

export const getAnimationProps = (baseProps: any) => {
  if (
    typeof window !== "undefined" &&
    window.matchMedia(reducedMotionQuery).matches
  ) {
    return {
      ...baseProps,
      transition: { duration: 0 },
      animate: baseProps.initial || {},
    };
  }
  return baseProps;
};

// Custom hook for respecting reduced motion preferences
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(reducedMotionQuery);
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}
