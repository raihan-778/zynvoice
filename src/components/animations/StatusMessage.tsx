// 5. SUCCESS/ERROR ANIMATIONS
// ===========================================

// components/animations/StatusMessage.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusMessageProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  visible: boolean;
  onClose?: () => void;
  className?: string;
}

export function StatusMessage({
  type,
  message,
  visible,
  onClose,
  className,
}: StatusMessageProps) {
  const icons = {
    success: Check,
    error: X,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
  };

  const Icon = icons[type];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          className={cn(
            "flex items-center gap-3 p-4 rounded-lg border",
            colors[type],
            className
          )}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 15,
              delay: 0.1,
            }}
          >
            <Icon className="w-5 h-5" />
          </motion.div>

          <p className="flex-1 text-sm font-medium">{message}</p>

          {onClose && (
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1 rounded-full hover:bg-black/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
