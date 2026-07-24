import { lazy, Suspense, useEffect, useState } from 'react';
import { ClarityAnalytics } from './clarity-analytics';
import { GoogleAnalytics } from './google-analytics';
import { PlausibleAnalytics } from './plausible-analytics';
import { UmamiAnalytics } from './umami-analytics';
import { getPendingSocialAuth } from '@/lib/auth-analytics';

const GoogleAnalyticsAuthEvents = lazy(() =>
  import('./google-analytics-auth-events').then((module) => ({
    default: module.GoogleAnalyticsAuthEvents,
  }))
);

/**
 * Renders all script-based analytics (only in production)
 */
export function Analytics() {
  const [trackPendingAuth, setTrackPendingAuth] = useState(false);

  useEffect(() => {
    setTrackPendingAuth(Boolean(getPendingSocialAuth()));
  }, []);

  if (!import.meta.env.PROD) return null;

  return (
    <>
      {trackPendingAuth && (
        <Suspense fallback={null}>
          <GoogleAnalyticsAuthEvents />
        </Suspense>
      )}
      <GoogleAnalytics />
      <UmamiAnalytics />
      <PlausibleAnalytics />
      <ClarityAnalytics />
    </>
  );
}
