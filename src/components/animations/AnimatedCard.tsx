// components/animations/AnimatedCard.tsx
"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AnimatedCardProps
  extends React.ComponentPropsWithoutRef<typeof Card> {
  children: React.ReactNode;
  hover?: boolean;
  delay?: number;
  className?: string;
}

export function AnimatedCard({
  children,
  hover = true,
  delay = 0,
  className,
  ...props
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={
        hover
          ? {
              y: -4,
              transition: { duration: 0.2 },
            }
          : undefined
      }
    >
      <Card
        className={cn(
          "transition-shadow duration-300",
          hover && "hover:shadow-lg",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  );
}
