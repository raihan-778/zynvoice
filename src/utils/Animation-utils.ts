// 15. PERFORMANCE OPTIMIZATIONS
// ===========================================

// utils/animationUtils.ts
export const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

export const getAnimationProps = (baseProps: any) => {
  if (
    typeof window !== "undefined" &&
    window.matchMedia(reducedMotionQuery).matches
  ) {
    return {
      ...baseProps,
      transition: { duration: 0 },
      animate: baseProps.initial || {},
    };
  }
  return baseProps;
};

// Custom hook for respecting reduced motion preferences
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(reducedMotionQuery);
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}
