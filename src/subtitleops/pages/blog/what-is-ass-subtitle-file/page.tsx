import type { LegacyMetadata as Metadata } from '@/lib/legacy-metadata';
import Link from '@/compat/next-link';
import { JsonLd, blogPostJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'What Is an ASS Subtitle File? Advanced SubStation Alpha Explained',
  description:
    'Learn what an ASS subtitle file is, why it supports styling and positioning, and when to keep ASS instead of converting to SRT.',
  keywords: [
    'what is ass subtitle file',
    'ass subtitle format',
    'advanced substation alpha',
    'ass subtitles',
    'aegisub ass',
  ],
  alternates: { canonical: '/blog/what-is-ass-subtitle-file' },
  openGraph: { url: '/blog/what-is-ass-subtitle-file' },
};

const articleJsonLd = blogPostJsonLd({
  headline: 'What Is an ASS Subtitle File? Advanced SubStation Alpha Explained',
  description:
    'Learn what an ASS subtitle file is, why it supports styling and positioning, and when to keep ASS instead of converting to SRT.',
  url: '/blog/what-is-ass-subtitle-file',
  datePublished: '2026-05-13',
});

export default function WhatIsAssSubtitleFilePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <JsonLd data={articleJsonLd} />
      <header className="mb-10">
        <Link
          href="/blog"
          title="Back to SubtitleOps blog"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block"
        >
          &larr; Back to blog
        </Link>
        <time className="block text-xs text-muted-foreground mt-2">
          May 13, 2026
        </time>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-3 leading-tight">
          What Is an ASS Subtitle File?
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          An ASS subtitle file is an Advanced SubStation Alpha file. Unlike SRT,
          ASS can store fonts, colors, outlines, screen positioning, animation
          tags, and karaoke timing. It is commonly used for fansubs, lyric
          videos, sign translations, and any project where subtitle appearance
          matters.
        </p>
      </header>

      <div className="mb-10 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
        <svg
          className="h-5 w-5 shrink-0 text-blue-500 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
          />
        </svg>
        <p className="text-sm">
          <span className="font-medium text-foreground">
            Need a simpler subtitle file?
          </span>{' '}
          <Link
            href="/tools/ass-to-srt"
            title="Convert ASS to SRT subtitle format"
            className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800"
          >
            Convert ASS to SRT
          </Link>{' '}
          when you need broad player support, or{' '}
          <Link
            href="/tools/srt-to-ass"
            title="Convert SRT to ASS subtitle format"
            className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800"
          >
            convert SRT to ASS
          </Link>{' '}
          when you want an editable styled starting point.
        </p>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">What Makes ASS Different?</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          ASS files are structured into sections. The key sections are script
          metadata, style definitions, and timed dialogue events. That structure
          lets one file carry both the subtitle text and the visual rules for
          how the subtitles should appear.
        </p>
        <pre className="rounded-lg bg-muted/50 p-4 text-sm font-mono leading-relaxed overflow-auto mb-4">
          {`[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, OutlineColour, Alignment
Style: Default,Arial,48,&H00FFFFFF,&H00000000,2

[Events]
Format: Start, End, Style, Text
Dialogue: 0:00:01.00,0:00:04.50,Default,Welcome to the tutorial.`}
        </pre>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">When Should You Keep ASS?</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">
              Styled subtitles:
            </span>
            Keep ASS if the file uses colors, font choices, outlines, shadows,
            or named styles that matter to the video.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">
              Screen positioning:
            </span>
            Keep ASS when lines need to avoid on-screen text, signs, graphics,
            or speaker labels.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">
              Karaoke timing:
            </span>
            Keep ASS when syllable-level timing or animated lyric effects are
            part of the subtitle work.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">
          When Should You Convert ASS to SRT?
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Convert ASS to SRT when compatibility matters more than styling. SRT
          works across more players, editors, transcription tools, and upload
          forms. The tradeoff is that SRT cannot preserve ASS-only features such
          as positioning, animation tags, karaoke effects, and most style
          definitions.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Format Reference</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          For detailed override tags and styling syntax, see the{' '}
          <a
            href="https://aegisub.org/docs/latest/ass_tags/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-foreground/70"
          >
            Aegisub ASS tags documentation
          </a>
          .
        </p>
      </section>
    </article>
  );
}
