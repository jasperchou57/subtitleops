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
