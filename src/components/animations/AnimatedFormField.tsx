// 3. FORM ANIMATIONS
// ===========================================

// components/animations/AnimatedFormField.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AlertCircle, Check } from "lucide-react";

interface AnimatedFormFieldProps {
  children: React.ReactNode;
  label?: string;
  error?: string;
  success?: boolean;
  delay?: number;
  className?: string;
}

export function AnimatedFormField({
  children,
  label,
  error,
  success,
  delay = 0,
  className,
}: AnimatedFormFieldProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn("space-y-2", className)}
    >
      {label && (
        <motion.label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.1 }}
        >
          {label}
        </motion.label>
      )}

      <div className="relative">
        {children}

        {/* Success icon */}
        <AnimatePresence>
          {success && (
            <motion.div
              className="absolute right-3 top-1/2 -translate-y-1/2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Check className="w-4 h-4 text-green-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="flex items-center gap-2 text-sm text-red-500"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
