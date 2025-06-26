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
              Create, customize, and send professional invoices with ease. Built
              with Next.js, TypeScript, and modern web technologies.
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
                <Button size="lg">Go to Dashboard</Button>
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
                <Button size="lg">Create Your First Invoice</Button>
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
