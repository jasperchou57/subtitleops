# E2E Test Catalog

## Public migration acceptance

**File:** `specs/public-pages.spec.ts` | **Priority:** P0

1. Open all 24 indexable SubtitleOps URLs.
2. Require a successful response, visible body, and no page or console errors.
3. Confirm `/api/ping`, `/robots.txt`, `/sitemap.xml`, and `/manifest.json`
   respond successfully.

The 24 URLs are the homepage, tools index, Pricing, 10 tool pages, blog index,
six blog posts, About, Contact, Privacy, and Terms. The migration intentionally
preserves English-only canonical URLs.

## Converter logic acceptance

Vitest covers all converter modules plus shared timing logic. These tests must
remain green before and after the framework migration.

## SaaS acceptance

Better Auth, protected pages, profile settings, plan entitlements, Pro and
Studio workflows, workspace seats, production API access, and storage journeys
run locally against an isolated D1 database. Stripe-specific lifecycle tests
run when `E2E_PAYMENT_PROVIDER=stripe` is set.

Production API acceptance includes a shared 1,000-request daily account quota:
multiple API keys must consume the same allowance, expose remaining/reset
headers, and return HTTP 429 after the account quota is exhausted.

Authentication acceptance rejects external or protocol-relative callback URLs
and redirects successful sign-in only to a normalized SubtitleOps path.

Payment acceptance must include checkout, webhook retry behavior, subscription
activation, customer portal access, cancellation, and entitlement downgrade.
