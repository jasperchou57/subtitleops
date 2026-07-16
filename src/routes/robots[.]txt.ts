import { createFileRoute } from '@tanstack/react-router';
import { getBaseUrl } from '@/lib/urls';

const disallowedPaths = ['/auth', '/admin', '/settings', '/dashboard'];

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () => {
        const base = getBaseUrl().replace(/\/$/, '');
        const disallowRules = disallowedPaths
          .map((path) => `Disallow: ${path}`)
          .join('\n');
        const robots = `User-agent: *\nAllow: /\n${disallowRules}\n\nSitemap: ${base}/sitemap.xml`;

        return new Response(robots, {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      },
    },
  },
});
