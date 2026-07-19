import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/manifest.json')({
  server: {
    handlers: {
      GET: () =>
        Response.json(
          {
            name: 'SubtitleOps',
            short_name: 'SubtitleOps',
            description:
              'Browser-based subtitle tools for converting, extracting, drafting, and timing subtitle files.',
            start_url: '/',
            scope: '/',
            display: 'standalone',
            background_color: '#ffffff',
            theme_color: '#18181b',
            icons: [
              {
                src: '/logo-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable',
              },
              {
                src: '/icon.svg',
                sizes: 'any',
                type: 'image/svg+xml',
                purpose: 'any',
              },
            ],
          },
          {
            headers: {
              'Content-Type': 'application/manifest+json',
              'Cache-Control': 'public, max-age=3600',
            },
          }
        ),
    },
  },
});
