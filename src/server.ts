import handler from '@tanstack/react-start/server-entry';
import { localeMiddleware } from '@/locale/middleware';
import { purgeExpiredProjects } from '@/lib/project-retention';

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:",
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
  async fetch(request: Request) {
    const url = new URL(request.url);

    if (url.hostname === 'www.subtitleops.com') {
      url.hostname = 'subtitleops.com';
      return Response.redirect(url, 308);
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
    await purgeExpiredProjects();
  },
};
