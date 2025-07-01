"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";

interface SignInButtonProps {
  children: React.ReactNode;
  provider?: string;
  callbackUrl?: string;
  className?: string;
}

export function SignInButton({
  children,
  provider = "credentials",
  callbackUrl = "/dashboard",
  className,
}: SignInButtonProps) {
  return (
    <Button
      onClick={() => signIn(provider, { callbackUrl })}
      className={className}
    >
      {children}
    </Button>
  );
}
