// ===========================================
// 13. SUCCESS/ERROR STATE ANIMATIONS
// ===========================================

// 📁 components/animations/AnimatedStates.tsx
"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnimatedStateProps {
  type: "success" | "error" | "warning";
  title: string;
  message: string;
  onAction?: () => void;
  actionLabel?: string;
}

export function AnimatedState({
  type,
  title,
  message,
  onAction,
  actionLabel = "Try Again",
}: AnimatedStateProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
  };

  const colors = {
    success: "text-green-600",
    error: "text-red-600",
    warning: "text-yellow-600",
  };

  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex flex-col items-center justify-center p-8 text-center space-y-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 30 }}
      >
        <Icon className={`h-16 w-16 ${colors[type]}`} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground">{message}</p>
      </motion.div>

      {onAction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={onAction}
            variant={type === "success" ? "default" : "outline"}
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
