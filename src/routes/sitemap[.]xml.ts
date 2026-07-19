import { createFileRoute } from '@tanstack/react-router';
import { getBaseUrl } from '@/lib/urls';

const entries = [
  ['/', '2026-07-19', 'weekly', '1.0'],
  ['/tools', '2026-04-27', 'monthly', '0.8'],
  ['/pricing', '2026-07-15', 'monthly', '0.7'],
  ['/tools/ass-to-srt', '2026-07-19', 'monthly', '0.9'],
  ['/tools/vtt-to-srt', '2026-07-19', 'monthly', '0.9'],
  ['/tools/txt-to-srt', '2026-07-19', 'monthly', '0.9'],
  ['/tools/srt-to-vtt', '2026-07-19', 'monthly', '0.9'],
  ['/tools/srt-to-txt', '2026-07-19', 'monthly', '0.9'],
  ['/tools/sbv-to-srt', '2026-07-19', 'monthly', '0.9'],
  ['/tools/srt-to-ass', '2026-07-19', 'monthly', '0.9'],
  ['/tools/vtt-to-txt', '2026-07-19', 'monthly', '0.9'],
  ['/tools/subtitle-shift', '2026-07-19', 'monthly', '0.9'],
  ['/tools/subtitle-fps-converter', '2026-07-19', 'monthly', '0.9'],
  ['/blog', '2026-04-27', 'weekly', '0.7'],
  ['/blog/how-to-fix-subtitle-delay-online', '2026-07-19', 'monthly', '0.8'],
  ['/blog/what-is-ass-subtitle-file', '2026-07-19', 'monthly', '0.8'],
  ['/blog/what-is-vtt-file', '2026-07-19', 'monthly', '0.8'],
  ['/blog/what-is-srt-file', '2026-07-19', 'monthly', '0.8'],
  ['/blog/ass-vs-srt-when-to-convert', '2026-07-19', 'monthly', '0.8'],
  ['/blog/srt-vs-vtt-which-subtitle-format', '2026-07-19', 'monthly', '0.8'],
  ['/about', '2026-04-27', 'yearly', '0.4'],
  ['/privacy', '2026-07-16', 'yearly', '0.3'],
  ['/cookie', '2026-07-16', 'yearly', '0.2'],
  ['/terms', '2026-03-22', 'yearly', '0.3'],
  ['/contact', '2026-03-22', 'yearly', '0.4'],
] as const;

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () => {
        const base = getBaseUrl().replace(/\/$/, '');
        const urls = entries
          .map(
            ([path, lastModified, changeFrequency, priority]) => `  <url>
    <loc>${base}${path}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${changeFrequency}</changefreq>
    <priority>${priority}</priority>
  </url>`
          )
          .join('\n');

        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`,
          { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
        );
      },
    },
  },
});
