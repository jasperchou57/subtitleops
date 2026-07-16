import { createFileRoute } from '@tanstack/react-router';
import {
  getSeoAnalyticsOverview,
  GoogleSeoAnalyticsConfigurationError,
  isSeoAnalyticsRequestAuthorized,
} from '@/lib/google-seo-analytics';

const JSON_HEADERS = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json',
};

export const Route = createFileRoute('/api/seo/analytics')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          if (!isSeoAnalyticsRequestAuthorized(request)) {
            return Response.json(
              { success: false, error: 'Unauthorized' },
              { status: 401, headers: JSON_HEADERS }
            );
          }

          const url = new URL(request.url);
          const data = await getSeoAnalyticsOverview({
            days: Number(url.searchParams.get('days') ?? 28),
            endDate: url.searchParams.get('endDate') ?? undefined,
            rowLimit: Number(url.searchParams.get('rowLimit') ?? 50),
          });

          return Response.json(
            { success: true, data },
            { headers: JSON_HEADERS }
          );
        } catch (error) {
          const isConfigurationError =
            error instanceof GoogleSeoAnalyticsConfigurationError;

          return Response.json(
            {
              success: false,
              error:
                error instanceof Error
                  ? error.message
                  : 'Unknown Google SEO analytics error',
            },
            {
              status: isConfigurationError ? 503 : 500,
              headers: JSON_HEADERS,
            }
          );
        }
      },
    },
  },
});
