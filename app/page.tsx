'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Auto-redirect authenticated users to dashboard
  useEffect(() => {
    if (user && !isLoading) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-2 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-slate-900">Supabase Auth System</h1>
          <p className="mb-8 text-xl text-slate-600">
            A complete, production-ready authentication system built with Next.js, Supabase, and Tailwind CSS
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-12 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>🔐 Secure Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Built with Supabase Auth for enterprise-grade security and OAuth support.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📱 Responsive Design</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Beautiful, mobile-first UI built with Tailwind CSS and shadcn/ui components.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>⚡ Type-Safe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Full TypeScript support for better developer experience and fewer bugs.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🛡️ Protected Routes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Automatic redirect for unauthenticated users and dashboard protection.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Auth Pages */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Available Pages</CardTitle>
            <CardDescription>Get started with authentication</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Link href="/login">
                <Button className="w-full">Sign In →</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="w-full">
                  Create Account →
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Documentation */}
        <Card>
          <CardHeader>
            <CardTitle>Features Included</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>✅ Email and password registration</li>
              <li>✅ Email and password login</li>
              <li>✅ Password reset / forgot password</li>
              <li>✅ Logout functionality</li>
              <li>✅ Protected dashboard route</li>
              <li>✅ User profile management</li>
              <li>✅ Error handling and validation</li>
              <li>✅ Loading states and spinners</li>
              <li>✅ Success notifications</li>
              <li>✅ Row Level Security policies</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
