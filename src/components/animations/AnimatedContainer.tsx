// 2. ANIMATED COMPONENTS
// ===========================================

// components/animations/AnimatedContainer.tsx
"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { animationConfig } from "@/lib/animations/config";

interface AnimatedContainerProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  variant?: "fadeIn" | "slideUp" | "slideDown" | "scaleIn";
  delay?: number;
  duration?: number;
  className?: string;
}

export function AnimatedContainer({
  children,
  variant = "fadeIn",
  delay = 0,
  duration = animationConfig.duration.normal,
  className,
  ...props
}: AnimatedContainerProps) {
  const variants = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    slideDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },
  };

  return (
    <motion.div
      variants={variants[variant]}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        duration,
        delay,
        ease: "easeInOut",
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
