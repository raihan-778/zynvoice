// 📁 src/components/layout/footer.tsx
"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      className="bg-gray-50 border-t border-gray-200 px-4 py-6 lg:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-gray-600 mb-4 md:mb-0">
          © 2024 InvoiceGen. All rights reserved.
        </div>

        <div className="flex space-x-6 text-sm text-gray-600">
          <a href="#" className="hover:text-blue-600 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-blue-600 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-blue-600 transition-colors">
            Support
          </a>
        </div>
      </div>
    </motion.footer>
  );
}
