<!-- # Section 1: Project Setup

## 1.1 Initialize Next.js Project with App Router & TypeScript

```bash
# Create Next.js project with TypeScript
npx create-next-app@latest invoice-generator --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Navigate to project directory
cd invoice-generator
```

## 1.2 Install Required Dependencies

```bash
# Core dependencies
npm install mongoose framer-motion lucide-react

# Authentication
npm install next-auth
npm install @auth/mongodb-adapter

# ShadCN UI setup
npx shadcn-ui@latest init

# Install ShadCN components we'll need
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add card
npx shadcn-ui@latest add form
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add avatar

# PDF and Email dependencies
npm install react-pdf html-to-image nodemailer
npm install @types/nodemailer --save-dev

# Additional utilities
npm install react-hook-form @hookform/resolvers zod
npm install date-fns uuid
npm install @types/uuid --save-dev
```

## 1.3 Project Folder Structure

Create the following folder structure:

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── invoices/
│   │   ├── clients/
│   │   ├── templates/
│   │   └── email/
│   ├── auth/
│   │   ├── signin/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── settings/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/ (ShadCN components)
│   ├── auth/
│   ├── forms/
│   ├── invoice/
│   ├── layout/
│   └── common/
├── lib/
│   ├── auth/
│   ├── database/
│   ├── models/
│   ├── utils/
│   └── validations/
├── types/
│   └── index.ts
└── styles/
    └── globals.css
```

## 1.4 Environment Variables Setup

Create `.env.local` file:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/invoice-generator
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/invoice-generator

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here-make-it-long-and-random

# OAuth Providers (Optional - you can add Google, GitHub, etc.)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Email Configuration (for Nodemailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 1.5 Update tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

## 1.6 Update globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  @apply bg-secondary;
}

::-webkit-scrollbar-thumb {
  @apply bg-primary/20 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-primary/40;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }

  .print-break {
    page-break-before: always;
  }
}
```

## 1.7 Database Connection Setup

Create `src/lib/database/connection.ts`:

```typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseConnection | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB');
      return mongoose;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default connectDB;

## 1.8 NextAuth Configuration

Create `src/lib/auth/auth.config.ts`:

```typescript
import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import connectDB from "../database/connection";
import User from "../models/User";

const client = new MongoClient(process.env.MONGODB_URI!);
const clientPromise = client.connect();

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    // Credentials Provider (Email & Password)
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        };
      }
    }),

    // Google Provider (Optional)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // GitHub Provider (Optional)
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
```

Create `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

Create `src/lib/models/User.ts`:

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: 'user' | 'admin';
  company?: {
    name: string;
    logo?: string;
    address: string;
    phone?: string;
    email?: string;
    website?: string;
    taxId?: string;
  };
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    select: false, // Don't include password in queries by default
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  company: {
    name: String,
    logo: String,
    address: String,
    phone: String,
    email: String,
    website: String,
    taxId: String,
  },
  emailVerified: Date,
}, {
  timestamps: true,
});

// Index for faster email lookups
UserSchema.index({ email: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
```
```

## 1.9 TypeScript Types Setup

Create `src/types/index.ts`:

```typescript
import { DefaultSession } from "next-auth";

// Extend NextAuth session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: 'user' | 'admin';
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: 'user' | 'admin';
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: 'user' | 'admin';
  }
}

export interface Company {
  _id?: string;
  name: string;
  logo?: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  taxId?: string;
}

export interface Client {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  company?: string;
  userId: string; // Link to user who created this client
}

export interface ServiceItem {
  _id?: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  _id?: string;
  invoiceNumber: string;
  company: Company;
  client: Client;
  items: ServiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issueDate: Date;
  dueDate: Date;
  notes?: string;
  templateId?: string;
  userId: string; // Link to user who created this invoice
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InvoiceTemplate {
  _id?: string;
  name: string;
  description?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  layout: 'modern' | 'classic' | 'minimal';
  logoPosition: 'left' | 'center' | 'right';
  isDefault: boolean;
  userId?: string; // Optional: for user-specific templates
  createdAt?: Date;
}

export interface FormData {
  company: Company;
  client: Client;
  items: ServiceItem[];
  taxRate: number;
  notes?: string;
  templateId?: string;
  dueDate: Date;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: 'user' | 'admin';
  company?: Company;
}
```

## 1.10 Utility Functions

Create `src/lib/utils/index.ts`:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function generateInvoiceNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

  return `INV-${year}${month}${day}-${random}`;
}

export function calculateItemAmount(quantity: number, rate: number): number {
  return Math.round((quantity * rate) * 100) / 100;
}

export function calculateSubtotal(items: { amount: number }[]): number {
  return Math.round(items.reduce((sum, item) => sum + item.amount, 0) * 100) / 100;
}

export function calculateTax(subtotal: number, taxRate: number): number {
  return Math.round((subtotal * taxRate / 100) * 100) / 100;
}

export function calculateTotal(subtotal: number, taxAmount: number): number {
  return Math.round((subtotal + taxAmount) * 100) / 100;
}
```

## 1.11 Authentication Components

Create `src/components/auth/auth-provider.tsx`:

```typescript
"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

Create `src/components/auth/signin-form.tsx`:

```typescript
"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Github, Mail, Eye, EyeOff } from "lucide-react";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch (error) {
      setError("An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn("google")}
            disabled={isLoading}
          >
            <Mail className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn("github")}
            disabled={isLoading}
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a
            href="/auth/signup"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign up
          </a>
        </p>
      </CardContent>
    </Card>
  );
}
```

Create `src/app/auth/signin/page.tsx`:

```typescript
import SignInForm from "@/components/auth/signin-form";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <SignInForm />
    </div>
  );
}
```

Update `src/app/page.tsx` to test the setup:

```typescript
"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Settings, Download, LogIn } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header with Auth Status */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Professional Invoice Generator
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Create, customize, and send professional invoices with ease.
              Built with Next.js, TypeScript, and modern web technologies.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {status === "loading" ? (
              <div className="animate-pulse">Loading...</div>
            ) : session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Welcome, {session.user?.name || session.user?.email}
                </span>
                <Link href="/dashboard">
                  <Button>Go to Dashboard</Button>
                </Link>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/auth/signin">
                  <Button variant="outline">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Create Invoice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Generate professional invoices quickly and easily
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Manage Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Keep track of all your clients and their information
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Download className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Export & Send</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Download as PDF or send directly via email
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Settings className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Customize</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Choose from multiple templates and customize your brand
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          {session ? (
            <div className="space-x-4">
              <Link href="/dashboard">
                <Button size="lg">
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  Create Invoice
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-x-4">
              <Link href="/auth/signup">
                <Button size="lg">
                  Create Your First Invoice
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Settings, Download } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Invoice Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create, customize, and send professional invoices with ease.
            Built with Next.js, TypeScript, and modern web technologies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Create Invoice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Generate professional invoices quickly and easily
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Manage Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Keep track of all your clients and their information
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Download className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Export & Send</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Download as PDF or send directly via email
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Settings className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Customize</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Choose from multiple templates and customize your brand
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button className="mr-4" size="lg">
            Create Your First Invoice
          </Button>
          <Button variant="outline" size="lg">
            View Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
```

## 1.11 Start Development Server

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see your setup working!

## ✅ Section 1 Complete!

Your project is now set up with:
- ✅ Next.js 14 with App Router & TypeScript
- ✅ TailwindCSS with ShadCN UI components installed
- ✅ Framer Motion ready for animations
- ✅ MongoDB connection setup with Mongoose
- ✅ Proper folder structure
- ✅ TypeScript types defined
- ✅ Utility functions created
- ✅ Environment variables configured

**Next Steps:** Ready for Section 2 - Database Schema (Mongoose) where we'll create the data models for our invoice system.

Let me know when you're ready to proceed with Section 2! -->

# Section 1: Project Setup

## 1.1 Initialize Next.js Project with App Router & TypeScript

```bash
# Create Next.js project with TypeScript
npx create-next-app@latest invoice-generator --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Navigate to project directory
cd invoice-generator
```

## 1.2 Install Required Dependencies

```bash
# Core dependencies
npm install mongoose framer-motion lucide-react

# Authentication
npm install next-auth
npm install @auth/mongodb-adapter

# ShadCN UI setup
npx shadcn-ui@latest init

# Install ShadCN components we'll need
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add card
npx shadcn-ui@latest add form
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add avatar

# PDF and Email dependencies
npm install react-pdf html-to-image nodemailer
npm install @types/nodemailer --save-dev

# Additional utilities (including bcrypt for password hashing)
npm install react-hook-form @hookform/resolvers zod
npm install date-fns uuid bcryptjs
npm install @types/uuid @types/bcryptjs --save-dev
```

## 1.3 Project Folder Structure

Create the following folder structure:

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── invoices/
│   │   ├── clients/
│   │   ├── templates/
│   │   └── email/
│   ├── auth/
│   │   ├── signin/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── settings/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/ (ShadCN components)
│   ├── auth/
│   ├── forms/
│   ├── invoice/
│   ├── layout/
│   └── common/
├── lib/
│   ├── auth/
│   ├── database/
│   ├── models/
│   ├── utils/
│   └── validations/
├── types/
│   └── index.ts
└── styles/
    └── globals.css
```

## 1.4 Environment Variables Setup

Create `.env.local` file:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/invoice-generator
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/invoice-generator

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here-make-it-long-and-random

# OAuth Providers (Optional - you can add Google, GitHub, etc.)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Email Configuration (for Nodemailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 1.5 Update tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

## 1.6 Update globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  @apply bg-secondary;
}

::-webkit-scrollbar-thumb {
  @apply bg-primary/20 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-primary/40;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }

  .print-break {
    page-break-before: always;
  }
}
```

## 1.7 Database Connection Setup

Create `src/lib/database/connection.ts`:

````typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseConnection | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB');
      return mongoose;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default connectDB;

## 1.8 NextAuth Configuration

Create `src/lib/auth/auth.config.ts`:

```typescript
import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import connectDB from "../database/connection";
import User from "../models/User";

const client = new MongoClient(process.env.MONGODB_URI!);
const clientPromise = client.connect();

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    // Credentials Provider (Email & Password)
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        };
      }
    }),

    // Google Provider (Optional)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // GitHub Provider (Optional)
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
````

Create `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

Create `src/lib/models/User.ts`:

```typescript
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: "user" | "admin";
  company?: {
    name: string;
    logo?: string;
    address: string;
    phone?: string;
    email?: string;
    website?: string;
    taxId?: string;
  };
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false, // Don't include password in queries by default
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    company: {
      name: String,
      logo: String,
      address: String,
      phone: String,
      email: String,
      website: String,
      taxId: String,
    },
    emailVerified: Date,
  },
  {
    timestamps: true,
  }
);

// Index for faster email lookups
UserSchema.index({ email: 1 });

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
```

````

## 1.9 TypeScript Types Setup

Create `src/types/index.ts`:

```typescript
import { DefaultSession } from "next-auth";

// Extend NextAuth session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: 'user' | 'admin';
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: 'user' | 'admin';
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: 'user' | 'admin';
  }
}

export interface Company {
  _id?: string;
  name: string;
  logo?: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  taxId?: string;
}

export interface Client {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  company?: string;
  userId: string; // Link to user who created this client
}

export interface ServiceItem {
  _id?: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  _id?: string;
  invoiceNumber: string;
  company: Company;
  client: Client;
  items: ServiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issueDate: Date;
  dueDate: Date;
  notes?: string;
  templateId?: string;
  userId: string; // Link to user who created this invoice
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InvoiceTemplate {
  _id?: string;
  name: string;
  description?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  layout: 'modern' | 'classic' | 'minimal';
  logoPosition: 'left' | 'center' | 'right';
  isDefault: boolean;
  userId?: string; // Optional: for user-specific templates
  createdAt?: Date;
}

export interface FormData {
  company: Company;
  client: Client;
  items: ServiceItem[];
  taxRate: number;
  notes?: string;
  templateId?: string;
  dueDate: Date;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: 'user' | 'admin';
  company?: Company;
}
````

## 1.10 Utility Functions

Create `src/lib/utils/index.ts`:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function generateInvoiceNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `INV-${year}${month}${day}-${random}`;
}

export function calculateItemAmount(quantity: number, rate: number): number {
  return Math.round(quantity * rate * 100) / 100;
}

export function calculateSubtotal(items: { amount: number }[]): number {
  return (
    Math.round(items.reduce((sum, item) => sum + item.amount, 0) * 100) / 100
  );
}

export function calculateTax(subtotal: number, taxRate: number): number {
  return Math.round(((subtotal * taxRate) / 100) * 100) / 100;
}

export function calculateTotal(subtotal: number, taxAmount: number): number {
  return Math.round((subtotal + taxAmount) * 100) / 100;
}
```

## 1.11 Authentication Components

Create `src/components/auth/auth-provider.tsx`:

```typescript
"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

Create `src/components/auth/signin-form.tsx`:

```typescript
"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Github, Mail, Eye, EyeOff } from "lucide-react";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch (error) {
      setError("An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn("google")}
            disabled={isLoading}
          >
            <Mail className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn("github")}
            disabled={isLoading}
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a
            href="/auth/signup"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign up
          </a>
        </p>
      </CardContent>
    </Card>
  );
}
```

Create `src/app/auth/signin/page.tsx`:

```typescript
import SignInForm from "@/components/auth/signin-form";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <SignInForm />
    </div>
  );
}
```

Update `src/app/page.tsx` to test the setup:

````typescript
"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Settings, Download, LogIn } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header with Auth Status */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Professional Invoice Generator
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Create, customize, and send professional invoices with ease.
              Built with Next.js, TypeScript, and modern web technologies.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {status === "loading" ? (
              <div className="animate-pulse">Loading...</div>
            ) : session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Welcome, {session.user?.name || session.user?.email}
                </span>
                <Link href="/dashboard">
                  <Button>Go to Dashboard</Button>
                </Link>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/auth/signin">
                  <Button variant="outline">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Create Invoice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Generate professional invoices quickly and easily
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Manage Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Keep track of all your clients and their information
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Download className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Export & Send</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Download as PDF or send directly via email
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Settings className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Customize</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Choose from multiple templates and customize your brand
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          {session ? (
            <div className="space-x-4">
              <Link href="/dashboard">
                <Button size="lg">
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  Create Invoice
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-x-4">
              <Link href="/auth/signup">
                <Button size="lg">
                  Create Your First Invoice
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Settings, Download } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Invoice Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create, customize, and send professional invoices with ease.
            Built with Next.js, TypeScript, and modern web technologies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Create Invoice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Generate professional invoices quickly and easily
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Manage Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Keep track of all your clients and their information
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Download className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Export & Send</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Download as PDF or send directly via email
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Settings className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Customize</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Choose from multiple templates and customize your brand
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button className="mr-4" size="lg">
            Create Your First Invoice
          </Button>
          <Button variant="outline" size="lg">
            View Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
````

## 1.11 Start Development Server

## 1.17 Complete Setup Checklist & Guidelines

### 🚀 **COMPLETE SETUP STEPS:**

1. **Install Dependencies:**

```bash
npm install
```

2. **Setup Environment Variables:**

   - Copy the `.env.local` template above
   - Add your MongoDB URI (local or Atlas)
   - Generate a strong NEXTAUTH_SECRET: `openssl rand -base64 32`
   - Optional: Add OAuth provider credentials

3. **Database Setup:**

   - **Local MongoDB:** Install MongoDB locally or use Docker
   - **MongoDB Atlas:** Create free cluster at mongodb.com
   - **Connection String Format:**
     ```
     # Local: mongodb://localhost:27017/invoice-generator
     # Atlas: mongodb+srv://username:password@cluster.mongodb.net/invoice-generator
     ```

4. **OAuth Setup (Optional but Recommended):**

   **Google OAuth:**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

   **GitHub OAuth:**

   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create new OAuth App
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

5. **Start Development Server:**

```bash
npm run dev
```

### 🔧 **TESTING YOUR SETUP:**

1. **Homepage Test:**

   - Visit `http://localhost:3000`
   - Should see landing page with auth buttons

2. **Authentication Test:**

   - Click "Sign Up" → Should redirect to `/auth/signup`
   - Try creating account with email/password
   - Test OAuth providers (if configured)
   - Test sign in at `/auth/signin`

3. **Protected Routes Test:**
   - Try accessing `/dashboard` without login → Should redirect to sign in
   - Sign in and access `/dashboard` → Should work

### 🛠️ **TROUBLESHOOTING:**

**Common Issues:**

1. **MongoDB Connection Error:**

   ```bash
   # Check if MongoDB is running (local)
   brew services start mongodb/brew/mongodb-community
   # Or check Atlas connection string
   ```

2. **NextAuth Secret Error:**

   ```bash
   # Generate strong secret
   openssl rand -base64 32
   # Add to .env.local as NEXTAUTH_SECRET
   ```

3. **ShadCN Components Not Found:**

   ```bash
   # Re-run ShadCN init if needed
   npx shadcn-ui@latest init
   ```

4. **Build Errors:**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run dev
   ```

### 📁 **FOLDER STRUCTURE VERIFICATION:**

Make sure you have all these folders/files:

```
src/
├── app/
│   ├── api/auth/[...nextauth]/route.ts ✓
│   ├── api/auth/register/route.ts ✓
│   ├── auth/signin/page.tsx ✓
│   ├── auth/signup/page.tsx ✓
│   └── layout.tsx ✓
├── components/
│   ├── auth/
│   │   ├── auth-provider.tsx ✓
│   │   ├── signin-form.tsx ✓
│   │   └── signup-form.tsx ✓
│   └── layout/navbar.tsx ✓
├── lib/
│   ├── auth/auth.config.ts ✓
│   ├── database/connection.ts ✓
│   └── models/User.ts ✓
├── types/index.ts ✓
└── middleware.ts ✓
```

### ✅ **VERIFICATION CHECKLIST:**

- [ ] All dependencies installed without errors
- [ ] Environment variables configured
- [ ] MongoDB connection working
- [ ] NextAuth properly configured
- [ ] Sign up/Sign in forms work
- [ ] Protected routes redirect correctly
- [ ] User sessions persist
- [ ] OAuth providers work (if configured)

### 🎯 **WHAT'S WORKING NOW:**

✅ **Complete Authentication System:**

- Email/Password registration & login
- OAuth with Google & GitHub (optional)
- Protected routes with middleware
- User sessions with NextAuth
- Password hashing with bcrypt

✅ **Professional UI:**

- Responsive design with Tailwind CSS
- ShadCN UI components
- Beautiful auth forms
- Navigation with user dropdown

✅ **Database Integration:**

- MongoDB connection with Mongoose
- User model with company info
- Proper TypeScript types

✅ **Security Features:**

- Password hashing
- JWT tokens
- Route protection
- CSRF protection (NextAuth built-in)

## ✅ Section 1 Complete with Authentication!

Your professional Invoice Generator now has:

- ✅ Complete NextAuth.js authentication system
- ✅ Email/Password + OAuth login
- ✅ Protected routes with middleware
- ✅ User management with MongoDB
- ✅ Professional UI with navigation
- ✅ TypeScript type safety throughout

**Ready for Section 2?** Let me know when you want to proceed with the **Database Schema (Mongoose)** section where we'll create all the data models for invoices, clients, and templates!

The authentication foundation is solid and production-ready! 🚀
