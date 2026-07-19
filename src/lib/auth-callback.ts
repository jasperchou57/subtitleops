const CALLBACK_ORIGIN = 'https://subtitleops.com';

function hasControlCharacters(value: string) {
  return Array.from(value).some((character) => {
    const code = character.charCodeAt(0);
    return code <= 31 || code === 127;
  });
}

/**
 * Return a normalized site-local callback path, or null for external/unsafe
 * destinations.
 */
export function getSafeAuthCallbackPath(
  value: string | null | undefined
): string | null {
  if (
    !value ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('\\') ||
    hasControlCharacters(value)
  ) {
    return null;
  }

  try {
    const url = new URL(value, CALLBACK_ORIGIN);
    if (url.origin !== CALLBACK_ORIGIN) return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

export function resolveAuthCallbackPath(
  candidates: (string | null | undefined)[],
  fallback: string
) {
  for (const candidate of candidates) {
    const safePath = getSafeAuthCallbackPath(candidate);
    if (safePath) return safePath;
  }
  return fallback;
}
