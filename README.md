# SubtitleOps

SubtitleOps is a browser-based subtitle toolkit at
[subtitleops.com](https://subtitleops.com). It converts SRT, ASS, VTT, SBV,
and TXT files, extracts transcript text, drafts subtitles, and fixes subtitle
timing without uploading file contents.

This branch migrates the product from Next.js/Vercel to TanStack Start on
Cloudflare Workers. It uses the licensed `mkfast-template` SaaS foundation for
Better Auth, D1, Stripe/Creem, R2, account settings, and the admin dashboard.
Auth, plan entitlements, Pro/Studio workflows, and the Stripe subscription
lifecycle are enabled locally. The production D1 and KV resources exist;
production activation still requires R2, the Cloudflare Worker deployment,
SubtitleOps Stripe secrets/webhooks, and a real end-to-end checkout
verification.

## Stack

- TanStack Start + React 19 + TypeScript
- Cloudflare Workers, D1, R2, and KV
- Tailwind CSS v4 + shadcn/ui
- Better Auth and Stripe/Creem subscription scaffolding
- GA4 plus a private GA4/Search Console reporting endpoint

## Local development

```bash
pnpm install
pnpm dev
```

The app runs at `http://localhost:3000`.

```bash
pnpm test       # subtitle conversion and timing unit tests
pnpm check      # Biome checks
pnpm build      # production Worker build
pnpm e2e        # local Playwright acceptance tests
```

## Cloudflare setup

`wrangler.jsonc` contains the production D1 and KV bindings. Enable R2, create
the production Worker, add Worker secrets, and complete a real Stripe test-mode
purchase, portal cancellation, and post-period downgrade before attaching
`subtitleops.com`.

Important secrets include `BETTER_AUTH_SECRET`, payment provider keys and
webhook secrets, `SEO_ANALYTICS_TOKEN`, and either Google OAuth refresh-token
credentials or `GOOGLE_SERVICE_ACCOUNT_JSON`. See `.env.example` and `docs/`
for the full module configuration.

## Project layout

- `src/routes/` — TanStack pages, APIs, sitemap, robots, and manifest
- `src/subtitleops/pages/` — migrated public page content
- `src/lib/converters/` — pure subtitle conversion logic
- `src/lib/timing/` — subtitle timing utilities
- `src/components/tools/` — shared browser-side converter UI
- `src/auth/`, `src/payment/`, `src/db/` — active SaaS foundation
- `src/components/workflows/` — Pro batch and Studio team workflows

## Privacy

Subtitle conversion remains client-side. Subtitle contents do not leave the
browser. Analytics events contain only operational metadata such as format,
file size, and success/error state.

The SaaS foundation is derived from the licensed
[`saas-sources/mkfast-template`](https://github.com/saas-sources/mkfast-template).
See `LICENSE` for its terms.
