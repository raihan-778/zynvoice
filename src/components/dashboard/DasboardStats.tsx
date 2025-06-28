// ===========================================
// 2. DASHBOARD STATS COMPONENT
// ===========================================

// 📁 components/dashboard/DashboardStats.tsx
"use client";

import { motion } from "framer-motion";
import { AnimatedCard } from "@/components/animations/AnimatedCard";
import {
  FileText,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Invoice } from "@/types/invoice";

interface DashboardStatsProps {
  invoices: Invoice[];
}

export function DashboardStats({ invoices }: DashboardStatsProps) {
  // Calculate stats
  const totalInvoices = invoices.length;
  const totalRevenue = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.total, 0);

  // If you meant "draft" as pending, use "draft" instead of "pending"
  const pendingAmount = invoices
    .filter((inv) => inv.status === "draft")
    .reduce((sum, inv) => sum + inv.total, 0);

  const overdueCount = invoices.filter(
    (inv) => inv.status === "overdue"
  ).length;

  const uniqueClients = new Set(invoices.map((inv) => inv.client)).size;

  const avgInvoiceValue =
    totalRevenue /
    (invoices.filter((inv) => inv.status === "paid").length || 1);

  const stats = [
    {
      title: "Total Invoices",
      value: totalInvoices.toString(),
      icon: FileText,
      change: "+12%",
      changeType: "positive" as const,
      description: "from last month",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: "+8.5%",
      changeType: "positive" as const,
      description: "from last month",
    },
    {
      title: "Pending Amount",
      value: `$${pendingAmount.toLocaleString()}`,
      icon: Clock,
      change: "-2.1%",
      changeType: "negative" as const,
      description: "from last month",
    },
    {
      title: "Active Clients",
      value: uniqueClients.toString(),
      icon: Users,
      change: "+15%",
      changeType: "positive" as const,
      description: "from last month",
    },
    {
      title: "Avg Invoice Value",
      value: `$${avgInvoiceValue.toFixed(0)}`,
      icon: TrendingUp,
      change: "+5.2%",
      changeType: "positive" as const,
      description: "from last month",
    },
    {
      title: "Overdue Invoices",
      value: overdueCount.toString(),
      icon: AlertTriangle,
      change: overdueCount > 0 ? "Action needed" : "All clear",
      changeType:
        overdueCount > 0 ? ("negative" as const) : ("positive" as const),
      description: "requires attention",
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      initial="hidden"
      animate="show"
    >
      {stats.map((stat, index) => (
        <AnimatedCard key={stat.title} delay={index * 0.1}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <div className="flex items-center space-x-1">
                  <span
                    className={`text-xs font-medium ${
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {stat.description}
                  </span>
                </div>
              </div>
              <div
                className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                  stat.changeType === "positive"
                    ? "bg-green-100 text-green-600 dark:bg-green-900/20"
                    : "bg-red-100 text-red-600 dark:bg-red-900/20"
                }`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        </AnimatedCard>
      ))}
    </motion.div>
  );
}
