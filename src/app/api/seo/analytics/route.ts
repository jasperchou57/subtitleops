import {
  getSeoAnalyticsOverview,
  GoogleSeoAnalyticsConfigurationError,
  isSeoAnalyticsRequestAuthorized,
} from "@/lib/google-seo-analytics";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const JSON_HEADERS = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json",
};

export async function GET(request: Request) {
  try {
    if (!isSeoAnalyticsRequestAuthorized(request)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401, headers: JSON_HEADERS },
      );
    }

    const url = new URL(request.url);
    const data = await getSeoAnalyticsOverview({
      days: Number(url.searchParams.get("days") ?? 28),
      endDate: url.searchParams.get("endDate") ?? undefined,
      oidcToken:
        request.headers.get("x-vercel-oidc-token") ??
        process.env.VERCEL_OIDC_TOKEN,
      rowLimit: Number(url.searchParams.get("rowLimit") ?? 50),
    });

    return Response.json({ success: true, data }, { headers: JSON_HEADERS });
  } catch (error) {
    const isConfigurationError =
      error instanceof GoogleSeoAnalyticsConfigurationError;

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown Google SEO analytics error",
      },
      { status: isConfigurationError ? 503 : 500, headers: JSON_HEADERS },
    );
  }
}
