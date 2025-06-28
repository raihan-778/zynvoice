// 📁 components/animations/LoadingOverlay.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LoadingSpinner } from "./LoadingSpinner";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export function LoadingOverlay({
  isLoading,
  message = "Loading...",
}: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-card p-8 rounded-lg shadow-lg flex flex-col items-center space-y-4"
          >
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground">{message}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
