// components/animations/ProgressBar.tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export function ProgressBar({
  progress,
  className,
  showPercentage = true,
  animated = true,
}: ProgressBarProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {showPercentage && (
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <motion.span
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {Math.round(progress)}%
          </motion.span>
        </div>
      )}

      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            duration: animated ? 0.5 : 0,
            ease: "easeOut",
          }}
        />
      </div>
    </div>
  );
}
