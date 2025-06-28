// 📁 components/animations/AnimatedForm.tsx
"use client";

import { motion } from "framer-motion";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

interface AnimatedFormProps extends AnimatedButtonProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedForm({ children, className = "" }: AnimatedFormProps) {
  return (
    <motion.form
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.form>
  );
}
