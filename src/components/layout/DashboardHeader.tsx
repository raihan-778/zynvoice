// ===========================================
// 1. DASHBOARD HEADER COMPONENT
// ===========================================

// 📁 components/dashboard/DashboardHeader.tsx
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Filter,
  Download,
  Grid3X3,
  List,
  Calendar,
  TrendingUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatedButton } from "@/components/animations/AnimatedButton";
import Link from "next/link";

interface DashboardHeaderProps {
  view: "table" | "cards";
  onViewChange: (view: "table" | "cards") => void;
}

export function DashboardHeader({ view, onViewChange }: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your invoices and track your business
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search invoices..." className="pl-10 w-64" />
        </div>

        {/* Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>All Invoices</DropdownMenuItem>
            <DropdownMenuItem>Paid</DropdownMenuItem>
            <DropdownMenuItem>Pending</DropdownMenuItem>
            <DropdownMenuItem>Overdue</DropdownMenuItem>
            <DropdownMenuItem>Draft</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Date Range</DropdownMenuLabel>
            <DropdownMenuItem>
              <Calendar className="h-4 w-4 mr-2" />
              This Month
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Calendar className="h-4 w-4 mr-2" />
              Last 3 Months
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Calendar className="h-4 w-4 mr-2" />
              This Year
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Export */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Export as CSV</DropdownMenuItem>
            <DropdownMenuItem>Export as PDF</DropdownMenuItem>
            <DropdownMenuItem>Export as Excel</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View Toggle */}
        <div className="flex border rounded-md">
          <Button
            variant={view === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("table")}
            className="rounded-r-none"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "cards" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("cards")}
            className="rounded-l-none border-l"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Create Invoice */}
        <AnimatedButton>
          <Link href="/invoice/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Link>
        </AnimatedButton>
      </div>
    </motion.div>
  );
}
