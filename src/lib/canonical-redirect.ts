const CANONICAL_HOSTNAME = 'subtitleops.com';

export function getCanonicalRedirectUrl(requestUrl: string | URL): URL | null {
  const url = new URL(requestUrl);
  const isProductionHost =
    url.hostname === CANONICAL_HOSTNAME ||
    url.hostname === `www.${CANONICAL_HOSTNAME}`;

  if (!isProductionHost) return null;

  const isCanonical =
    url.protocol === 'https:' && url.hostname === CANONICAL_HOSTNAME;
  if (isCanonical) return null;

  url.protocol = 'https:';
  url.hostname = CANONICAL_HOSTNAME;
  url.port = '';
  return url;
}
