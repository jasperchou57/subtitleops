import { m } from '@/locale/paraglide/messages';
import { LoginForm } from '@/components/auth/login-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getSafeAuthCallbackPath } from '@/lib/auth-callback';
import { trackEvent } from '@/lib/analytics';
import { Routes } from '@/lib/routes';
import { useRouter } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
interface LoginWrapperProps {
  children: React.ReactNode;
  mode?: 'modal' | 'redirect';
  asChild?: boolean;
  callbackUrl?: string;
}
/**
 * Wraps content to trigger login
 * - mode="modal" opens a login dialog
 * - mode="redirect" navigates to the login page
 */
export function LoginWrapper({
  children,
  mode = 'redirect',
  asChild,
  callbackUrl,
}: LoginWrapperProps) {
  const router = useRouter();
  const safeCallbackUrl = getSafeAuthCallbackPath(callbackUrl);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const handleRedirect = () => {
    trackEvent('auth_cta_click', {
      auth_mode: 'redirect',
      page_path: window.location.pathname,
    });
    router.navigate({
      to: Routes.Login,
      search: safeCallbackUrl ? { callbackUrl: safeCallbackUrl } : {},
    });
  };
  const handleModalSuccess = () => {
    setOpen(false);
    trackEvent('login_prompt_close', { close_reason: 'login_success' });
    if (safeCallbackUrl) {
      router.navigate({ to: safeCallbackUrl });
    }
  };
  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    trackEvent(nextOpen ? 'login_prompt_view' : 'login_prompt_close', {
      close_reason: nextOpen ? undefined : 'user_close',
    });
  };
  if (!mounted) {
    return <span>{children}</span>;
  }
  if (mode === 'modal') {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger
          render={
            asChild && React.isValidElement(children) ? (
              children
            ) : (
              <button data-analytics-id="login_prompt_open" type="button">
                {children}
              </button>
            )
          }
        />
        <DialogContent className="sm:max-w-100 p-0 border-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>{m.auth_login_sign_in()}</DialogTitle>
          </DialogHeader>
          <LoginForm
            callbackUrl={safeCallbackUrl ?? undefined}
            onSuccess={handleModalSuccess}
            className="border-0 shadow-none"
          />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <button
      data-analytics-id="login_redirect"
      type="button"
      onClick={handleRedirect}
      className="inline"
    >
      {children}
    </button>
  );
}
