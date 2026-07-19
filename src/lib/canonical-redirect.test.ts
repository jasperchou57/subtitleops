import { describe, expect, it } from 'vitest';
import { getCanonicalRedirectUrl } from './canonical-redirect';

describe('canonical production redirects', () => {
  it.each([
    ['http://subtitleops.com/', 'https://subtitleops.com/'],
    [
      'http://www.subtitleops.com/tools/txt-to-srt?source=old',
      'https://subtitleops.com/tools/txt-to-srt?source=old',
    ],
    [
      'https://www.subtitleops.com/blog/what-is-srt-file',
      'https://subtitleops.com/blog/what-is-srt-file',
    ],
  ])('redirects %s in one hop', (requestUrl, expectedUrl) => {
    expect(getCanonicalRedirectUrl(requestUrl)?.toString()).toBe(expectedUrl);
  });

  it('does not redirect the canonical URL', () => {
    expect(getCanonicalRedirectUrl('https://subtitleops.com/tools')).toBeNull();
  });

  it('does not redirect preview or local hosts', () => {
    expect(
      getCanonicalRedirectUrl('https://subtitleops.example.workers.dev/')
    ).toBeNull();
    expect(getCanonicalRedirectUrl('http://localhost:3000/')).toBeNull();
  });
});
