import { describe, expect, it } from 'vitest';
import {
  getSafeAuthCallbackPath,
  resolveAuthCallbackPath,
} from './auth-callback';

describe('auth callback paths', () => {
  it('allows normalized site-local paths with queries and fragments', () => {
    expect(
      getSafeAuthCallbackPath('/settings/profile?tab=billing#details')
    ).toBe('/settings/profile?tab=billing#details');
    expect(getSafeAuthCallbackPath('/dashboard/../settings')).toBe('/settings');
  });

  it.each([
    'https://example.com/phishing',
    'http://subtitleops.com/dashboard',
    '//example.com/phishing',
    '/\\example.com/phishing',
    'dashboard',
    '',
  ])('rejects unsafe callback destination %s', (callbackUrl) => {
    expect(getSafeAuthCallbackPath(callbackUrl)).toBeNull();
  });

  it('uses the first safe candidate or the fallback', () => {
    expect(
      resolveAuthCallbackPath(
        ['https://example.com', '/settings/profile'],
        '/dashboard'
      )
    ).toBe('/settings/profile');
    expect(resolveAuthCallbackPath(['//example.com', null], '/dashboard')).toBe(
      '/dashboard'
    );
  });
});
