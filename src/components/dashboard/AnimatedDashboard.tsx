// 9. ENHANCED DASHBOARD WITH ANIMATIONS
// ===========================================

// components/dashboard/AnimatedDashboard.tsx
"use client";

import { AnimatedCard } from "@/components/animations/AnimatedCard";
import { AnimatedContainer } from "@/components/animations/AnimatedContainer";
import { AnimatedList } from "@/components/animations/AnimatedList";
import { motion } from "framer-motion";
import { DollarSign, FileText, TrendingUp, Users } from "lucide-react";

const stats = [
  { title: "Total Invoices", value: "1,234", icon: FileText, change: "+12%" },
  { title: "Revenue", value: "$45,678", icon: DollarSign, change: "+8%" },
  { title: "Clients", value: "89", icon: Users, change: "+5%" },
  { title: "Growth", value: "24%", icon: TrendingUp, change: "+3%" },
];

export function AnimatedDashboard() {
  return (
    <AnimatedContainer variant="fadeIn" className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s your business overview.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <AnimatedCard key={stat.title} delay={index * 0.1} hover>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <motion.p
                    className="text-2xl font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: index * 0.1 + 0.2,
                    }}
                  >
                    {stat.value}
                  </motion.p>
                  <motion.p
                    className="text-xs text-green-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  >
                    {stat.change} from last month
                  </motion.p>
                </div>
                <motion.div
                  className="p-2 bg-blue-100 rounded-full"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </motion.div>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* Recent Invoices */}
      <AnimatedCard delay={0.5}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Invoices</h2>
          <AnimatedList staggerDelay={0.1}>
            {[1, 2, 3, 4, 5].map((item) => (
              <motion.div
                key={item}
                className="flex items-center justify-between p-4 border rounded-lg"
                whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
              >
                <div>
                  <p className="font-medium">Invoice #INV-00{item}</p>
                  <p className="text-sm text-muted-foreground">
                    Client Name {item}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ${(Math.random() * 1000 + 100).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatedList>
        </div>
      </AnimatedCard>
    </AnimatedContainer>
  );
}




