export type SocialAuthProvider = 'google' | 'github' | 'apple';
export type SocialAuthIntent = 'login' | 'sign_up';

type PendingSocialAuth = {
  intent: SocialAuthIntent;
  provider: SocialAuthProvider;
  startedAt: number;
};

const PENDING_SOCIAL_AUTH_KEY = 'subtitleops:pending-social-auth';
const PENDING_SOCIAL_AUTH_TTL = 30 * 60 * 1000;

export function setPendingSocialAuth(
  provider: SocialAuthProvider,
  intent: SocialAuthIntent
): void {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.setItem(
      PENDING_SOCIAL_AUTH_KEY,
      JSON.stringify({ provider, intent, startedAt: Date.now() })
    );
  } catch {
    // Analytics state must never block authentication.
  }
}

export function getPendingSocialAuth(): PendingSocialAuth | undefined {
  if (typeof window === 'undefined') return undefined;

  try {
    const storedValue = window.sessionStorage.getItem(PENDING_SOCIAL_AUTH_KEY);
    if (!storedValue) return undefined;

    const pending = JSON.parse(storedValue) as PendingSocialAuth;
    const isProvider = ['google', 'github', 'apple'].includes(pending.provider);
    const isIntent = pending.intent === 'login' || pending.intent === 'sign_up';
    const isFresh = Date.now() - pending.startedAt <= PENDING_SOCIAL_AUTH_TTL;

    if (isProvider && isIntent && isFresh) return pending;
  } catch {
    // Invalid local analytics state is discarded below.
  }

  clearPendingSocialAuth();
  return undefined;
}

export function clearPendingSocialAuth(): void {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.removeItem(PENDING_SOCIAL_AUTH_KEY);
  } catch {
    // Analytics state must never block authentication.
  }
}
