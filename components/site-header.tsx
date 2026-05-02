'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '@/app/contexts/auth-context';
import { Button } from '@/components/ui/button';

const linkButtonClass =
  'inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white/80 px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white hover:text-slate-950';

const primaryLinkClass =
  'inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800';

function getInitials(nameOrEmail: string) {
  const parts = nameOrEmail.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return nameOrEmail.slice(0, 2).toUpperCase();
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const isHomePage = pathname === '/';
  const displayName = user?.full_name?.trim() || user?.email || 'Account';
  const initials = getInitials(displayName || 'A');

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = isHomePage
    ? [
        { href: '#features', label: 'Features' },
        { href: '#security', label: 'Security' },
        { href: '#workflow', label: 'Workflow' },
      ]
    : [{ href: '/', label: 'Home' }];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              UI Platform
            </span>
            <span className="block text-base font-semibold text-slate-950">Supabase Auth System</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              {pathname === '/dashboard' ? (
                <span className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/90 px-3 py-2 shadow-sm">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                    {initials}
                  </span>
                  <span className="hidden sm:block">
                    <span className="block text-[11px] uppercase tracking-[0.2em] text-slate-400">
                      Account
                    </span>
                    <span className="block max-w-36 truncate text-sm font-semibold text-slate-900">
                      {displayName}
                    </span>
                  </span>
                </span>
              ) : (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/90 px-3 py-2 shadow-sm transition hover:border-slate-300 hover:bg-white"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                    {initials}
                  </span>
                  <span className="hidden sm:block">
                    <span className="block text-[11px] uppercase tracking-[0.2em] text-slate-400">
                      Account
                    </span>
                    <span className="block max-w-36 truncate text-sm font-semibold text-slate-900">
                      {displayName}
                    </span>
                  </span>
                  <LayoutDashboard className="h-4 w-4 text-slate-400" />
                </Link>
              )}

              <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden sm:inline-flex">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className={linkButtonClass}>
                Sign in
              </Link>
              <Link href="/register" className={primaryLinkClass}>
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}