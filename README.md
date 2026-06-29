# SubtitleOps

Free, browser-based subtitle tools at [subtitleops.com](https://subtitleops.com).
Convert between SRT, ASS, VTT, SBV, and TXT, extract transcript text, draft
subtitles from a script, and fix out-of-sync timing. Every tool runs entirely
in your browser — no uploads, no accounts, no file size limits.

## Tools

**Format conversion** — `/tools/ass-to-srt`, `/tools/vtt-to-srt`,
`/tools/srt-to-vtt`, `/tools/srt-to-ass`, `/tools/sbv-to-srt`

**Transcript extraction** — `/tools/srt-to-txt`, `/tools/vtt-to-txt`

**Subtitle drafting** — `/tools/txt-to-srt`

**Timing correction** — `/tools/subtitle-shift` (constant offset),
`/tools/subtitle-fps-converter` (frame-rate rescaling)

The homepage at `/` also exposes a universal converter that auto-detects the
input format and routes through SRT.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript 5
- Tailwind CSS v4 + shadcn/ui + Base UI
- Static generation for every tool and blog page
- GA4 with custom conversion-tracking events
- Lightweight client-side trace-id system for debugging

## Local development

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:3000`.

```bash
npm run build   # production build
npm run lint    # eslint
```

## Private GA4 and GSC API

SubtitleOps exposes an owner-only endpoint for Google SEO reporting:

```bash
curl -H "Authorization: Bearer $SEO_ANALYTICS_TOKEN" \
  "https://subtitleops.com/api/seo/analytics?days=28&rowLimit=50"
```

It reads GA4 through the Google Analytics Data API and Search Console through
the Search Console API. The endpoint is private: it returns `401` without
`SEO_ANALYTICS_TOKEN` and `503` until the Google auth settings are configured.

Environment variables:

```bash
GOOGLE_OAUTH_CLIENT_ID="...apps.googleusercontent.com"
GOOGLE_OAUTH_CLIENT_SECRET="..." # optional for desktop OAuth clients
GOOGLE_OAUTH_REFRESH_TOKEN="..."
GOOGLE_SERVICE_ACCOUNT_JSON="..." # optional fallback instead of OAuth
GOOGLE_SERVICE_ACCOUNT_EMAIL="grid-maker-seo-analytics@project-5a3f9a08-96a3-4787-926.iam.gserviceaccount.com"
GOOGLE_WIF_PROJECT_NUMBER="1062922534665"
GOOGLE_WIF_POOL_ID="vercel"
GOOGLE_WIF_PROVIDER_ID="vercel"
GOOGLE_SEO_GA4_PROPERTY_ID="529230481"
GOOGLE_SEO_GSC_SITE_URL="sc-domain:subtitleops.com"
SEO_ANALYTICS_TOKEN="use-a-long-random-string"
```

The OAuth refresh token must be authorized with these scopes:

```text
https://www.googleapis.com/auth/analytics.readonly
https://www.googleapis.com/auth/webmasters.readonly
```

If OAuth consent is blocked, use `GOOGLE_SERVICE_ACCOUNT_JSON` instead and add
the service account email as a user in the GA4 property. For Search Console
service-account access, verify a URL-prefix property with the Site Verification
API and set `GOOGLE_SEO_GSC_SITE_URL` to that URL-prefix property.

On Vercel, the preferred keyless path is Workload Identity Federation. The API
route accepts Vercel's OIDC token from `x-vercel-oidc-token`, exchanges it with
Google STS, impersonates `GOOGLE_SERVICE_ACCOUNT_EMAIL`, and then calls GA4/GSC.

## Project layout

- `src/app/` — App Router pages (homepage, tools, blog, legal pages)
- `src/app/tools/<slug>/` — each tool's page + client converter component
- `src/lib/converters/` — pure conversion logic, format-specific
- `src/lib/timing/` — shared timestamp parsing for shift and FPS tools
- `src/components/tools/` — shared dropzone, result panel, generic converter
- `src/components/seo/` — JSON-LD helpers (WebSite, FAQPage, BreadcrumbList,
  SoftwareApplication, BlogPosting)

## Privacy

Every conversion runs client-side. Subtitle files never leave the browser.
GA4 is loaded with `lazyOnload` and only tracks anonymous tool-usage events
(format pairs, file size, success/error) — never file content.
