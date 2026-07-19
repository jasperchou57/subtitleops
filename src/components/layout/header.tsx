'use client';

import { useEffect, useState } from 'react';
import Link from '@/compat/next-link';
import { authClient } from '@/auth/client';
import { UserButton } from '@/components/shared/user-button';
import { Skeleton } from '@/components/ui/skeleton';

type NavItem = {
  name: string;
  href: string;
  title: string;
};

const navTools: NavItem[] = [
  {
    name: 'ASS to SRT',
    href: '/tools/ass-to-srt',
    title: 'Convert ASS to SRT subtitle format',
  },
  {
    name: 'VTT to SRT',
    href: '/tools/vtt-to-srt',
    title: 'Convert VTT to SRT subtitle format',
  },
  {
    name: 'SRT to VTT',
    href: '/tools/srt-to-vtt',
    title: 'Convert SRT to VTT subtitle format',
  },
  {
    name: 'TXT to SRT',
    href: '/tools/txt-to-srt',
    title: 'Convert TXT to SRT subtitle format',
  },
  {
    name: 'Fix Timing',
    href: '/tools/subtitle-shift',
    title: 'Shift subtitles forward or backward by a fixed offset',
  },
  {
    name: 'All Tools',
    href: '/tools',
    title: 'Browse all free subtitle conversion tools',
  },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      data-analytics-area="header"
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 xl:grid xl:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          title="SubtitleOps — Free Online Subtitle Converter"
          className="flex items-center gap-2.5"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <rect
              x="2"
              y="4"
              width="20"
              height="16"
              rx="2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M5 15h14M5 18h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-base font-semibold tracking-tight">
            SubtitleOps
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 text-sm xl:flex">
          {navTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              title={tool.title}
              className="rounded-md px-3 py-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {tool.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center justify-self-end gap-1 text-sm xl:flex">
          <Link
            href="/pricing"
            title="Compare SubtitleOps Free, Pro, and Studio plans"
            className="rounded-md px-3 py-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Pricing
          </Link>
          {!mounted || isPending ? (
            <Skeleton className="ml-2 h-8 w-20 rounded-md" />
          ) : user ? (
            <div className="ml-2">
              <UserButton user={user} />
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                title="Sign in to SubtitleOps"
                className="rounded-md px-3 py-2.5 transition-colors hover:bg-accent"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                title="Create a SubtitleOps account"
                className="rounded-md bg-foreground px-3 py-2 text-background transition-opacity hover:opacity-85"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-accent xl:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <nav className="animate-in fade-in slide-in-from-top-2 border-t bg-background px-4 py-3 duration-200 xl:hidden">
          <div className="flex flex-col gap-1">
            {navTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                title={tool.title}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {tool.name}
              </Link>
            ))}
            <Link
              href="/pricing"
              title="Compare SubtitleOps Free, Pro, and Studio plans"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Pricing
            </Link>
            {mounted && !isPending && !user && (
              <div className="mt-2 grid grid-cols-2 gap-2 border-t pt-3">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md border px-3 py-2.5 text-center text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md bg-foreground px-3 py-2.5 text-center text-sm text-background"
                >
                  Sign Up
                </Link>
              </div>
            )}
            {mounted && !isPending && user && (
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-md bg-foreground px-3 py-2.5 text-center text-sm text-background"
              >
                Open Dashboard
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
