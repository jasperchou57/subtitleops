# E2E Test Catalog

## Public migration acceptance

**File:** `specs/public-pages.spec.ts` | **Priority:** P0

1. Open all 25 indexable SubtitleOps URLs.
2. Require a successful response, visible body, and no page or console errors.
3. Confirm the production security headers remain enforced.
4. Confirm `/api/ping`, `/api/ready`, `/robots.txt`, `/sitemap.xml`, and
   `/manifest.json` respond successfully.

The 25 URLs are the homepage, tools index, Pricing, 10 tool pages, blog index,
six blog posts, About, Contact, Privacy, Cookie Policy, and Terms. The migration
intentionally preserves English-only canonical URLs.

## Existing-page SEO batch 1 acceptance

**File:** `specs/public-pages.spec.ts` | **Priority:** P0

1. Open the homepage, tools index, SRT-to-TXT, and TXT-to-SRT pages.
2. Require the approved unique title, meta description, H1, and self-canonical.
3. Confirm the homepage uses the visible `SubtitleOps` brand and asks visitors
   to choose a task before exposing any file upload control.
4. Confirm the tools index routes users by conversion, text extraction,
   subtitle creation, and timing correction tasks.
5. Confirm SRT-to-TXT describes cue-boundary spacing accurately and TXT-to-SRT
   calls its output a rule-based editable draft rather than speech-synced
   subtitles.
6. Require supported JSON-LD only: WebSite and Organization on the homepage;
   SoftwareApplication and BreadcrumbList on each tool page. Do not add FAQ or
   HowTo rich-result markup.

## Existing-page SEO batch 2 acceptance

**File:** `specs/public-pages.spec.ts` | **Priority:** P0

1. Open ASS-to-SRT, VTT-to-SRT, SRT-to-VTT, SBV-to-SRT, SRT-to-ASS,
   VTT-to-TXT, Subtitle Timing Shift, Subtitle FPS Converter, and Pricing.
2. Require a unique, branded title; precise meta description; single H1; and
   self-canonical on every page.
3. On each tool page, show the uploader before the full file contract: accepted
   input, downloaded result, what is kept, and what changes or is not created.
4. Keep claims aligned with the shipped converters. In particular, disclose
   styling loss, default ASS output, TXT cue spacing, negative-time clamping,
   and the manually chosen source-to-target FPS ratio.
5. After a successful conversion, connect one-file local processing to the
   optional SubtitleOps repeat-workflow plans without suggesting that private
   beta features are already generally available.
6. Require SoftwareApplication and BreadcrumbList on tool pages. Pricing uses
   a visible breadcrumb plus BreadcrumbList only; it must not advertise paid
   offers as available while checkout is closed.

## Mobile SEO and accessibility acceptance

**File:** `specs/public-pages.spec.ts` | **Priority:** P0

1. At a 390px viewport, public pages must not create document-level horizontal
   scrolling.
2. Every tool upload control must have a descriptive accessible name.
3. The upload area must begin within the first mobile viewport; detailed file
   contracts and secondary workflow guidance follow the tool.
4. Pricing plan names use a valid H2 hierarchy and the billing interval control
   exposes valid toolbar semantics.

## Converter logic acceptance

Vitest covers all converter modules plus shared timing logic. These tests must
remain green before and after the framework migration. TXT extraction must
preserve line breaks within a cue and place exactly one blank line between
separate subtitle cues.

## SaaS acceptance

Better Auth, protected pages, profile settings, plan entitlements, Pro and
Studio workflows, workspace seats, production API access, and storage journeys
run locally against an isolated D1 database. Stripe-specific lifecycle tests
run when `E2E_PAYMENT_PROVIDER=stripe` is set.

Production API acceptance includes a shared 1,000-request daily account quota:
multiple API keys must consume the same allowance, expose remaining/reset
headers, and return HTTP 429 after the account quota is exhausted.

Authentication acceptance rejects external or protocol-relative callback URLs
and redirects successful sign-in only to a normalized SubtitleOps path. Public
navigation exposes Pricing, Sign In, and Sign Up as a balanced action group.
Sign Up offers Google and GitHub registration while email/password registration
remains unavailable.

Payment acceptance must include checkout, customer portal access, cancellation,
and entitlement downgrade. Stripe lifecycle coverage additionally requires:

1. Invalid signatures return HTTP 400 and create no event record.
2. Stripe event IDs and per-invoice or per-payment-intent business keys remain
   idempotent across concurrent delivery, replay, and out-of-order delivery.
3. `invoice.paid` independently grants subscription access; payment failures,
   delayed one-time payments, unknown prices, refunds, and disputes follow their
   explicit failure or revocation paths.
4. An administrator can inspect payment transactions and webhook attempts, then
   safely reconcile only a Stripe invoice, Checkout Session, or PaymentIntent
   through Stripe's current object state.
