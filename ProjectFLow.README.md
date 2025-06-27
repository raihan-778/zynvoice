// ===========================================
// SECTION 6: ANIMATION & UX POLISH
// ===========================================

// 1. ANIMATION CONFIGURATION
// ===========================================

// lib/animations/config.ts
export const animationConfig = {
// Durations
duration: {
fast: 0.2,
normal: 0.3,
slow: 0.5,
slower: 0.8,
},

// Easing curves
ease: {
default: [0.25, 0.1, 0.25, 1],
smooth: [0.4, 0, 0.2, 1],
bounce: [0.68, -0.55, 0.265, 1.55],
elastic: [0.25, 0.46, 0.45, 0.94],
},

// Spring configurations
spring: {
gentle: { type: "spring", stiffness: 100, damping: 15 },
bouncy: { type: "spring", stiffness: 300, damping: 20 },
smooth: { type: "spring", stiffness: 200, damping: 25 },
},
};

// Common animation variants
export const fadeIn = {
initial: { opacity: 0 },
animate: { opacity: 1 },
exit: { opacity: 0 },
};

export const slideUp = {
initial: { opacity: 0, y: 20 },
animate: { opacity: 1, y: 0 },
exit: { opacity: 0, y: -20 },
};

export const slideDown = {
initial: { opacity: 0, y: -20 },
animate: { opacity: 1, y: 0 },
exit: { opacity: 0, y: 20 },
};

export const slideLeft = {
initial: { opacity: 0, x: 20 },
animate: { opacity: 1, x: 0 },
exit: { opacity: 0, x: -20 },
};

export const slideRight = {
initial: { opacity: 0, x: -20 },
animate: { opacity: 1, x: 0 },
exit: { opacity: 0, x: 20 },
};

export const scaleIn = {
initial: { opacity: 0, scale: 0.9 },
animate: { opacity: 1, scale: 1 },
exit: { opacity: 0, scale: 0.9 },
};

export const scaleOut = {
initial: { opacity: 0, scale: 1.1 },
animate: { opacity: 1, scale: 1 },
exit: { opacity: 0, scale: 1.1 },
};

// 2. ANIMATED COMPONENTS
// ===========================================

// components/animations/AnimatedContainer.tsx
'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { animationConfig } from '@/lib/animations/config';

interface AnimatedContainerProps extends HTMLMotionProps<'div'> {
children: React.ReactNode;
variant?: 'fadeIn' | 'slideUp' | 'slideDown' | 'scaleIn';
delay?: number;
duration?: number;
className?: string;
}

export function AnimatedContainer({
children,
variant = 'fadeIn',
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
        ease: animationConfig.ease.smooth,
      }}
className={className}
{...props} >
{children}
</motion.div>
);
}

// components/animations/AnimatedButton.tsx
'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends ButtonProps {
children: React.ReactNode;
whileHover?: object;
whileTap?: object;
loading?: boolean;
success?: boolean;
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
transition={{ type: "spring", stiffness: 400, damping: 17 }} >
<Button
className={cn(
"relative overflow-hidden transition-all duration-300",
success && "bg-green-500 hover:bg-green-600",
className
)}
disabled={disabled || loading}
{...props} >
<motion.div
className="flex items-center gap-2"
animate={{
            opacity: loading ? 0.7 : 1,
          }} >
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

// components/animations/AnimatedCard.tsx
'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { Card, CardProps } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AnimatedCardProps extends CardProps {
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
whileHover={hover ? {
y: -4,
transition: { duration: 0.2 }
} : undefined} >
<Card
className={cn(
"transition-shadow duration-300",
hover && "hover:shadow-lg",
className
)}
{...props} >
{children}
</Card>
</motion.div>
);
}

// 3. FORM ANIMATIONS
// ===========================================

// components/animations/AnimatedFormField.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AlertCircle, Check } from 'lucide-react';

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
className={cn("space-y-2", className)} >
{label && (
<motion.label
className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ delay: delay + 0.1 }} >
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
            animate={{ opacity: 1, height: 'auto' }}
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

// 4. LOADING ANIMATIONS
// ===========================================

// components/animations/LoadingSpinner.tsx
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
size?: 'sm' | 'md' | 'lg';
className?: string;
text?: string;
}

export function LoadingSpinner({
size = 'md',
className,
text
}: LoadingSpinnerProps) {
const sizeClasses = {
sm: 'w-4 h-4',
md: 'w-6 h-6',
lg: 'w-8 h-8',
};

return (
<div className={cn("flex items-center gap-3", className)}>
<motion.div
className={cn(
"border-2 border-current border-t-transparent rounded-full",
sizeClasses[size]
)}
animate={{ rotate: 360 }}
transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
/>
{text && (
<motion.span
className="text-sm text-muted-foreground"
animate={{ opacity: [0.5, 1, 0.5] }}
transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }} >
{text}
</motion.span>
)}
</div>
);
}

// components/animations/ProgressBar.tsx
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
            }} >
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

// 5. SUCCESS/ERROR ANIMATIONS
// ===========================================

// components/animations/StatusMessage.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusMessageProps {
type: 'success' | 'error' | 'warning' | 'info';
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
success: 'bg-green-50 text-green-800 border-green-200',
error: 'bg-red-50 text-red-800 border-red-200',
warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
info: 'bg-blue-50 text-blue-800 border-blue-200',
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
)} >
<motion.div
initial={{ scale: 0 }}
animate={{ scale: 1 }}
transition={{
              type: "spring",
              stiffness: 300,
              damping: 15,
              delay: 0.1,
            }} >
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

// 6. LIST ANIMATIONS
// ===========================================

// components/animations/AnimatedList.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedListProps {
children: React.ReactNode[];
className?: string;
staggerDelay?: number;
}

export function AnimatedList({
children,
className,
staggerDelay = 0.1,
}: AnimatedListProps) {
return (
<motion.div
className={cn("space-y-4", className)}
initial="hidden"
animate="visible"
variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }} >
<AnimatePresence mode="popLayout">
{children.map((child, index) => (
<motion.div
key={index}
layout
variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
exit={{ opacity: 0, x: -100 }}
transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
            }} >
{child}
</motion.div>
))}
</AnimatePresence>
</motion.div>
);
}

// 7. PAGE TRANSITIONS
// ===========================================

// components/animations/PageTransition.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
const pathname = usePathname();

return (
<AnimatePresence mode="wait">
<motion.div
key={pathname}
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -20 }}
transition={{
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1],
        }} >
{children}
</motion.div>
</AnimatePresence>
);
}

// 8. ENHANCED INVOICE FORM WITH ANIMATIONS
// ===========================================

// components/forms/AnimatedInvoiceForm.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { AnimatedContainer } from '@/components/animations/AnimatedContainer';
import { AnimatedButton } from '@/components/animations/AnimatedButton';
import { AnimatedFormField } from '@/components/animations/AnimatedFormField';
import { AnimatedCard } from '@/components/animations/AnimatedCard';
import { StatusMessage } from '@/components/animations/StatusMessage';
import { ProgressBar } from '@/components/animations/ProgressBar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ServiceItem {
id: string;
description: string;
quantity: number;
rate: number;
amount: number;
}

export function AnimatedInvoiceForm() {
const [services, setServices] = useState<ServiceItem[]>([
{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }
]);
const [showSuccess, setShowSuccess] = useState(false);
const [isGenerating, setIsGenerating] = useState(false);
const [formProgress, setFormProgress] = useState(0);

// Calculate form completion progress
const calculateProgress = () => {
let completed = 0;
const totalFields = 6; // Adjust based on your form fields

    // Add your progress calculation logic here
    return (completed / totalFields) * 100;

};

const addService = () => {
const newService: ServiceItem = {
id: Date.now().toString(),
description: '',
quantity: 1,
rate: 0,
amount: 0,
};
setServices([...services, newService]);
};

const removeService = (id: string) => {
setServices(services.filter(service => service.id !== id));
};

const updateService = (id: string, field: keyof ServiceItem, value: string | number) => {
setServices(services.map(service => {
if (service.id === id) {
const updated = { ...service, [field]: value };
if (field === 'quantity' || field === 'rate') {
updated.amount = updated.quantity \* updated.rate;
}
return updated;
}
return service;
}));
};

const totalAmount = services.reduce((sum, service) => sum + service.amount, 0);

const handleGenerate = async () => {
setIsGenerating(true);

    // Simulate generation process
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsGenerating(false);
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);

};

return (
<AnimatedContainer variant="slideUp" className="max-w-4xl mx-auto p-6 space-y-8">
{/_ Progress Bar _/}
<ProgressBar progress={formProgress} />

      {/* Status Messages */}
      <StatusMessage
        type="success"
        message="Invoice generated successfully!"
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
      />

      {/* Company Information */}
      <AnimatedCard delay={0.1}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            >
              🏢
            </motion.div>
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <AnimatedFormField label="Company Name" delay={0.2}>
            <Input placeholder="Your Company Name" />
          </AnimatedFormField>

          <AnimatedFormField label="Email" delay={0.3}>
            <Input type="email" placeholder="company@example.com" />
          </AnimatedFormField>

          <AnimatedFormField label="Phone" delay={0.4} className="col-span-2">
            <Input placeholder="+1 (555) 123-4567" />
          </AnimatedFormField>

          <AnimatedFormField label="Address" delay={0.5} className="col-span-2">
            <Textarea placeholder="Company Address" rows={3} />
          </AnimatedFormField>
        </CardContent>
      </AnimatedCard>

      {/* Client Information */}
      <AnimatedCard delay={0.2}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            >
              👤
            </motion.div>
            Client Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <AnimatedFormField label="Client Name" delay={0.3}>
            <Input placeholder="Client Name" />
          </AnimatedFormField>

          <AnimatedFormField label="Client Email" delay={0.4}>
            <Input type="email" placeholder="client@example.com" />
          </AnimatedFormField>
        </CardContent>
      </AnimatedCard>

      {/* Services */}
      <AnimatedCard delay={0.3}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                📋
              </motion.div>
              Services
            </div>

            <AnimatedButton
              onClick={addService}
              variant="outline"
              size="sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </AnimatedButton>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="popLayout">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                }}
                className="grid grid-cols-12 gap-4 p-4 border rounded-lg mb-4"
              >
                <div className="col-span-5">
                  <Input
                    placeholder="Service description"
                    value={service.description}
                    onChange={(e) => updateService(service.id, 'description', e.target.value)}
                  />
                </div>

                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={service.quantity}
                    onChange={(e) => updateService(service.id, 'quantity', parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="Rate"
                    value={service.rate}
                    onChange={(e) => updateService(service.id, 'rate', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="col-span-2">
                  <motion.div
                    className="flex items-center h-10 px-3 bg-gray-50 rounded-md"
                    animate={{ scale: service.amount > 0 ? [1, 1.05, 1] : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    ${service.amount.toFixed(2)}
                  </motion.div>
                </div>

                <div className="col-span-1 flex justify-end">
                  {services.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeService(service.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <Separator className="my-6" />

          {/* Total */}
          <motion.div
            className="flex justify-end items-center gap-4 text-lg font-semibold"
            animate={{ scale: totalAmount > 0 ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 0.5 }}
          >
            <Calculator className="w-5 h-5" />
            <span>Total: ${totalAmount.toFixed(2)}</span>
          </motion.div>
        </CardContent>
      </AnimatedCard>

      {/* Action Buttons */}
      <motion.div
        className="flex justify-end gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <AnimatedButton
          variant="outline"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Save Draft
        </AnimatedButton>

        <AnimatedButton
          onClick={handleGenerate}
          loading={isGenerating}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          {isGenerating ? 'Generating...' : 'Generate Invoice'}
        </AnimatedButton>
      </motion.div>
    </AnimatedContainer>

);
}

// 9. ENHANCED DASHBOARD WITH ANIMATIONS
// ===========================================

// components/dashboard/AnimatedDashboard.tsx
'use client';

import { motion } from 'framer-motion';
import { AnimatedContainer } from '@/components/animations/AnimatedContainer';
import { AnimatedCard } from '@/components/animations/AnimatedCard';
import { AnimatedList } from '@/components/animations/AnimatedList';
import { FileText, DollarSign, Users, TrendingUp } from 'lucide-react';

const stats = [
{ title: 'Total Invoices', value: '1,234', icon: FileText, change: '+12%' },
{ title: 'Revenue', value: '$45,678', icon: DollarSign, change: '+8%' },
{ title: 'Clients', value: '89', icon: Users
