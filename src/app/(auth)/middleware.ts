// ============================================================================
// middleware.ts - Route Protection Middleware
// ============================================================================

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Add custom logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect admin routes
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "admin";
        }

        // Protect dashboard and other authenticated routes
        if (
          req.nextUrl.pathname.startsWith("/dashboard") ||
          req.nextUrl.pathname.startsWith("/invoices") ||
          req.nextUrl.pathname.startsWith("/clients") ||
          req.nextUrl.pathname.startsWith("/companies")
        ) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/invoices/:path*",
    "/clients/:path*",
    "/companies/:path*",
    "/admin/:path*",
    "/api/invoices/:path*",
    "/api/clients/:path*",
    "/api/companies/:path*",
  ],
};
