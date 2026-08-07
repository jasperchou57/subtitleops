import type { QueryClient } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouterState,
} from '@tanstack/react-router';
import { Analytics } from '@/components/analytics/analytics';
import { InteractionTracker } from '@/components/analytics/interaction-tracker';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { DefaultCatchBoundary } from '@/components/layout/default-catch-boundary';
import { DefaultNotFound } from '@/components/layout/default-not-found';
import { Toaster } from '@/components/shared/toaster';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { clientEnv } from '@/env/client';
import { Routes } from '@/lib/routes';
import appCss from '../styles.css?url';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#ffffff' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/icon.svg', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', href: '/logo-512.png' },
      { rel: 'manifest', href: '/manifest.json' },
    ],
  }),
  shellComponent: RootDocument,
  component: RootComponent,
  notFoundComponent: DefaultNotFound,
  errorComponent: DefaultCatchBoundary,
});

function RootComponent() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const matches = useRouterState({ select: (state) => state.matches });
  const isAuthPage = pathname.startsWith(Routes.Auth);
  const isProtectedPage =
    pathname.startsWith(Routes.Admin) ||
    pathname.startsWith(Routes.Dashboard) ||
    pathname.startsWith(Routes.Settings);
  const isNotFound = pathname !== '/' && matches.length <= 1;

  if (isAuthPage || isProtectedPage || isNotFound) {
    return (
      <div className="flex min-h-screen flex-col">
        <main id="main-content" className="flex-1">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const adsenseClientId = clientEnv.VITE_ADSENSE_CLIENT_ID?.trim();
  const adsenseScriptSrc =
    clientEnv.VITE_ADSENSE_ENABLED && adsenseClientId
      ? `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adsenseClientId)}`
      : undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        {adsenseScriptSrc && (
          <script async src={adsenseScriptSrc} crossOrigin="anonymous" />
        )}
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <TooltipProvider>
            <InteractionTracker />
            {children}
            <Toaster richColors position="top-right" offset={64} />
          </TooltipProvider>
        </ThemeProvider>
        <Analytics />
        <Scripts />
      </body>
    </html>
  );
}
