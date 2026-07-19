import handler from '@tanstack/react-start/server-entry';
import { purgeOldProductionApiUsage } from '@/lib/api-usage';
import { localeMiddleware } from '@/locale/middleware';
import { purgeExpiredProjects } from '@/lib/project-retention';
import { getCanonicalRedirectUrl } from '@/lib/canonical-redirect';

type WorkerEnv = Env & { ASSETS: Fetcher };

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' https:",
  "connect-src 'self' https:",
  'frame-src https:',
  'child-src https:',
  "form-action 'self'",
  "manifest-src 'self'",
].join('; ');

function withSecurityHeaders(response: Response) {
  const headers = new Headers(response.headers);
  headers.set('Content-Security-Policy', CONTENT_SECURITY_POLICY);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  );
  headers.set('Strict-Transport-Security', 'max-age=63072000');

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}

export default {
  async fetch(request: Request, env: WorkerEnv) {
    const canonicalRedirectUrl = getCanonicalRedirectUrl(request.url);
    if (canonicalRedirectUrl)
      return Response.redirect(canonicalRedirectUrl, 308);

    if (request.method === 'GET' || request.method === 'HEAD') {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status !== 404) return assetResponse;
    }

    const response = await localeMiddleware(request, () =>
      handler.fetch(request, {
        context: {
          fromFetch: true,
        },
      })
    );

    return withSecurityHeaders(response);
  },
  async scheduled(_controller: ScheduledController) {
    await Promise.all([purgeExpiredProjects(), purgeOldProductionApiUsage()]);
  },
};
