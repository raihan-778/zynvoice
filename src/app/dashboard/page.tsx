"use client";

import { AnimatedNotifications } from "@/components/animations/AnimatedNotifications";
import { LoadingOverlay } from "@/components/animations/LoadingOverlay";
import { PageTransition } from "@/components/animations/PageTransition";
import { DashboardStats } from "@/components/dashboard/DasboardStats";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { InvoiceTable } from "@/components/invoice/InvoiceTable";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { useInvoices } from "@/hooks/useInvoice";
import { useNotifications } from "@/hooks/useNotification";

import { useState } from "react";

export default function DashboardPage() {
  const { invoices, loading, deleteInvoice, updateInvoice } = useInvoices();
  const { notifications, addNotification, dismissNotification } =
    useNotifications();
  const [view, setView] = useState<"table" | "cards">("table");

  const handleDeleteInvoice = async (id: string) => {
    try {
      await deleteInvoice(id);
      addNotification({
        type: "success",
        title: "Invoice Deleted",
        message: "Invoice has been successfully deleted.",
      });
    } catch (error) {
      addNotification({
        type: "error",
        title: "Delete Failed",
        message: `Failed to delete invoice. Please try again.${error}`,
      });
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto p-6 space-y-8">
        <LoadingOverlay isLoading={loading} message="Loading dashboard..." />

        <AnimatedNotifications
          notifications={notifications}
          onDismiss={dismissNotification}
        />

        <DashboardHeader view={view} onViewChange={setView} />

        <DashboardStats invoices={invoices} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <InvoiceTable
              invoices={invoices}
              view={view}
              onDelete={handleDeleteInvoice}
              onUpdate={updateInvoice}
            />
          </div>

          <div className="lg:col-span-1">
            <DashboardCharts invoices={invoices} />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
