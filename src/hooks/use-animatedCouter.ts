// 13. ENHANCED HOOKS
// ===========================================

// hooks/useAnimatedCounter.ts
import { useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function useAnimatedCounter(
  end: number,
  duration: number = 2000,
  start: number = 0
) {
  const [count, setCount] = useState(start);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      const currentCount = start + (end - start) * progress;
      setCount(Math.floor(currentCount));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, start, isInView]);

  return { count, ref };
}

// 14. USAGE EXAMPLES & INTEGRATION
// ===========================================

/*
// Example: Using animated components in your invoice app

// In your main invoice page:
import { AnimatedInvoiceForm } from '@/components/forms/AnimatedInvoiceForm';
import { PageTransition } from '@/components/animations/PageTransition';

export default function InvoicePage() {
  return (
    <PageTransition>
      <AnimatedInvoiceForm />
    </PageTransition>
  );
}

// In your dashboard:
import { AnimatedDashboard } from '@/components/dashboard/AnimatedDashboard';

export default function Dashboard() {
  return <AnimatedDashboard />;
}

// Using individual components:
import { AnimatedButton } from '@/components/animations/AnimatedButton';
import { StatusMessage } from '@/components/animations/StatusMessage';
import { LoadingSpinner } from '@/components/animations/LoadingSpinner';

function MyComponent() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  return (
    <div>
      <AnimatedButton
        loading={loading}
        success={success}
        onClick={handleAction}
      >
        Generate Invoice
      </AnimatedButton>
      
      {loading && <LoadingSpinner text="Generating..." />}
      
      <StatusMessage
        type="success"
        message="Invoice created successfully!"
        visible={success}
      />
    </div>
  );
}
*/
