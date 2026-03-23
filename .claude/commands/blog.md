# /blog — SEO Blog Writer for SubtitleOps

Write a complete, SEO-optimized blog post for subtitleops.com.

## Usage

```
/blog <topic or target keyword>
```

Examples:
- `/blog srt vs vtt`
- `/blog what is an srt file`
- `/blog subtitle formats compared`

## Process

### Phase 1: Research (DO NOT SKIP)

1. **WebSearch** the target keyword + top 3 variations to understand:
   - What's currently ranking (SERP analysis)
   - What angle competitors take
   - What questions "People Also Ask" shows
   - Content gaps you can fill with unique value

2. **WebSearch** for recent data, stats, or developments related to the topic (use 2025/2026 dates)

3. **Read** existing site content to find internal linking opportunities:
   - Grep for related keywords across existing pages
   - Identify which tool pages to link to

### Phase 2: Structure

Design the article outline BEFORE writing. Show the user:

```
Target keyword: [primary]
Secondary keywords: [3-5 variations]
Search intent: [informational / comparison / how-to]
Suggested title: [<60 chars, contains primary keyword]
Meta description: [120-155 chars, contains keyword, compelling]

## Heading Structure
H1: [title]
H2: [section 1]
  H3: [subsection]
H2: [section 2]
...
H2: FAQ (4-6 questions targeting long-tail)
```

Wait for user approval before writing.

### Phase 3: Write

Follow these rules strictly:

#### Content Standards (from Jasper's SOP)
- **1,500+ English words** (blog post minimum per E-E-A-T guidelines)
- **Keyword density 3-5%** for primary keyword (count by phrase, not individual words)
- **Primary keyword in**: title, H1, first 100 words, last paragraph, at least 2 H2s
- **Body font**: text-sm (14px) with text-muted-foreground — match existing tool pages
- **No AI slop**: No "dive into", "it's important to note", "in today's digital landscape", "let's explore", "whether you're a beginner or expert". Write like a developer explaining to another developer.

#### Information Increment Rule (哥飞 SOP)
Every page must have unique, non-reusable value. Ask yourself: "If I swapped the topic name, would this paragraph still work?" If yes, rewrite it.

❌ BAD: "SRT is a popular subtitle format used by many people around the world."
✅ GOOD: "SRT stores one timestamp range and one text block per cue. The comma in `00:01:23,456` separates seconds from milliseconds — WebVTT uses a dot instead, which is why a raw SRT file breaks in browser `<track>` elements."

#### E-E-A-T Signals
- Include specific technical details (file format internals, actual tag names, real software names)
- Reference real tools (Aegisub, Premiere Pro, VLC, ffmpeg) with actual use cases
- Add context only someone who actually works with subtitles would know
- Cite format specifications where relevant

#### Internal Linking (Blog → Tool Closedloop)
- **First mention** of each subtitle format links to the relevant tool page
- Include **2-3 prominent CTAs** to tool pages (not just inline links, but callout boxes)
- Use descriptive anchor text with title attributes
- Every blog post must link to at least 2 tool pages

#### AI Citation Readiness (GEO)
- Lead each major section with a clear, quotable statement
- Use comparison tables for format differences (AI systems love structured data)
- Answer questions directly in the first sentence, then elaborate
- Include specific numbers, version names, and technical details that AI can extract

### Phase 4: Implement

Create the blog post as a Next.js page at `src/app/blog/<slug>/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, blogPostJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "<title under 60 chars>",
  description: "<120-155 chars with keyword>",
  keywords: ["kw1", "kw2", "kw3", "kw4"],
  alternates: { canonical: "/blog/<slug>" },
  openGraph: { url: "/blog/<slug>" },
};
```

#### Required elements:
- BlogPosting JSON-LD (use `blogPostJsonLd` from json-ld.tsx)
- Breadcrumb: `← Back to Blog` link at top
- Author: "SubtitleOps"
- Publication date (today's date)
- All Links must have `title` attributes

### Phase 5: Post-Write Checklist

After writing, verify ALL of these:

| Check | Standard |
|-------|----------|
| Title length | < 60 characters |
| Description length | 120-155 characters |
| H1 | Exactly one, contains primary keyword |
| Word count | ≥ 1,500 words |
| Keyword density | 3-5% for primary keyword |
| Internal links | ≥ 2 tool page links with CTAs |
| BlogPosting JSON-LD | Present with headline, description, datePublished |
| Canonical | Set to `/blog/<slug>` |
| OG URL | Set to `/blog/<slug>` |
| No AI slop phrases | Zero instances |
| Information increment | Every section has format-specific, non-reusable content |

### Phase 6: Update Supporting Files

1. **Sitemap** (`src/app/sitemap.ts`): Add the new blog URL with today's date
2. **Blog index** (`src/app/blog/page.tsx`): Add the post to the posts array
3. **Build verification**: Run `npx next build` to confirm no errors

### Phase 7: Output Summary

```
✅ Blog post created: /blog/<slug>
   Title: <title>
   Words: <count>
   Keyword density: <X%>
   Internal links: <N> tool pages
   JSON-LD: BlogPosting ✓
   Sitemap: Updated ✓
   Blog index: Updated ✓
   Build: Passed ✓
```

## Quality Gates

**STOP and ask the user if:**
- The target keyword overlaps with an existing page (keyword cannibalization)
- Word count would be under 1,200 (topic may be too narrow)
- No natural internal linking opportunity exists (topic may be off-niche)

## Anti-Patterns (NEVER DO)

- Don't write generic "what is X" content without technical depth
- Don't create a blog post that could apply to any tool site with a find-replace
- Don't stuff keywords unnaturally — if 3% density requires awkward phrasing, stay at 2%
- Don't use stock phrases: "In conclusion", "To sum up", "As we've seen"
- Don't repeat the same point in different sections with slightly different wording
