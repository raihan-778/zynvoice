// 📁 src/components/layout/footer.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Separator } from "../ui/separator";

export default function Footer() {
  return (
    <motion.footer
      className="bg-slate-950 border-t border-gray-700 px-4 py-6 lg:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-bold text-lg text-slate-100">InvoiceGen</h3>
            <p className="mt-2 text-sm text-slate-400">
              The last invoice tool you’ll ever need.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-slate-200">Product</h4>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>
                <Link href="/features">Features</Link>
              </li>
              <li>
                <Link href="/pricing">Pricing</Link>
              </li>
              <li>
                <Link href="/templates">Templates</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-slate-200">Company</h4>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/careers">Careers</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-slate-200">Legal</h4>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>
                <Link href="/privacy">Privacy</Link>
              </li>
              <li>
                <Link href="/terms">Terms</Link>
              </li>
            </ul>
          </div>
        </div>
        <Separator className="my-8 border-slate-800" />
        <div className="flex justify-between text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Zynvoice</p>
          <p>Made with ❤️ & Next.js 15</p>
        </div>
      </div>
    </motion.footer>
  );
}

/* ---------- FOOTER ---------- */
// export const Footer = () => (
//   <footer className="border-t border-slate-800 bg-slate-950">
//     <div className="container mx-auto px-4 py-12">
//       <div className="grid gap-8 md:grid-cols-4">
//         <div>
//           <h3 className="font-bold text-lg text-slate-100">InvoiceGen</h3>
//           <p className="mt-2 text-sm text-slate-400">
//             The last invoice tool you’ll ever need.
//           </p>
//         </div>
//         <div>
//           <h4 className="font-semibold mb-2 text-slate-200">Product</h4>
//           <ul className="space-y-1 text-sm text-slate-400">
//             <li>
//               <Link href="/features">Features</Link>
//             </li>
//             <li>
//               <Link href="/pricing">Pricing</Link>
//             </li>
//             <li>
//               <Link href="/templates">Templates</Link>
//             </li>
//           </ul>
//         </div>
//         <div>
//           <h4 className="font-semibold mb-2 text-slate-200">Company</h4>
//           <ul className="space-y-1 text-sm text-slate-400">
//             <li>
//               <Link href="/about">About</Link>
//             </li>
//             <li>
//               <Link href="/careers">Careers</Link>
//             </li>
//             <li>
//               <Link href="/contact">Contact</Link>
//             </li>
//           </ul>
//         </div>
//         <div>
//           <h4 className="font-semibold mb-2 text-slate-200">Legal</h4>
//           <ul className="space-y-1 text-sm text-slate-400">
//             <li>
//               <Link href="/privacy">Privacy</Link>
//             </li>
//             <li>
//               <Link href="/terms">Terms</Link>
//             </li>
//           </ul>
//         </div>
//       </div>
//       <Separator className="my-8 border-slate-800" />
//       <div className="flex justify-between text-sm text-slate-500">
//         <p>© {new Date().getFullYear()} InvoiceGen Inc.</p>
//         <p>Made with ❤️ & Next.js 15</p>
//       </div>
//     </div>
//   </footer>
// );
