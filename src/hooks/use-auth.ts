"use client";

import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: !!session,
    hasRole: (role: string) => session?.user?.role === role,
    hasSubscription: (plan: string) =>
      session?.user?.subscription?.plan === plan,
  };
}
