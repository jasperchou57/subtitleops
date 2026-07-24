import { useEffect } from 'react';
import { authClient } from '@/auth/client';
import {
  clearPendingSocialAuth,
  getPendingSocialAuth,
} from '@/lib/auth-analytics';
import { trackEvent } from '@/lib/analytics';
import { Routes } from '@/lib/routes';

export function GoogleAnalyticsAuthEvents() {
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    const pending = getPendingSocialAuth();
    if (!pending) return;

    if (session?.user) {
      trackEvent(pending.intent === 'sign_up' ? 'sign_up' : 'login', {
        method: pending.provider,
      });
      clearPendingSocialAuth();
      return;
    }

    if (window.location.pathname.endsWith(Routes.AuthError)) {
      trackEvent(
        pending.intent === 'sign_up' ? 'sign_up_error' : 'login_error',
        {
          method: pending.provider,
          error_code: 'oauth_callback_failed',
        }
      );
      clearPendingSocialAuth();
    }
  }, [isPending, session?.user]);

  return null;
}
