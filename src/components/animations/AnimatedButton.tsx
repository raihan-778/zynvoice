// components/animations/AnimatedButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import type { TargetAndTransition, VariantLabels } from "framer-motion";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { ButtonProps } from "react-day-picker";

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode;
  whileHover?: TargetAndTransition | VariantLabels;
  whileTap?: TargetAndTransition | VariantLabels;
  loading?: boolean;
  success?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
interface AnimatedButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  className?: string;
}
export function AnimatedButton({
  children,
  className,
  whileHover = { scale: 1.02 },
  whileTap = { scale: 0.98 },
  loading = false,
  success = false,
  disabled,
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={!disabled && !loading ? whileHover : undefined}
      whileTap={!disabled && !loading ? whileTap : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          success && "bg-green-500 hover:bg-green-600",
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        <motion.div
          className="flex items-center gap-2"
          animate={{
            opacity: loading ? 0.7 : 1,
          }}
        >
          {children}
        </motion.div>

        {/* Success checkmark animation */}
        {success && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </svg>
          </motion.div>
        )}
      </Button>
    </motion.div>
  );
}
