import { authOptions } from "@/lib/auth/auth.config";
import { getServerSession } from "next-auth/next";

import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireRole(role: string) {
  const user = await requireAuth();
  if (user.role !== role && user.role !== "admin") {
    redirect("/unauthorized");
  }
  return user;
}
