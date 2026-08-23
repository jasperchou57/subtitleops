import type { LegacyMetadata as Metadata } from '@/lib/legacy-metadata';
import Link from '@/compat/next-link';
import { JsonLd, blogPostJsonLd } from '@/components/seo/json-ld';
import { ArticleHeroImage, ArticleMeta } from '@/components/seo/article-meta';

const articleImage = '/og/what-is-vtt.png';

export const metadata: Metadata = {
  title: 'What Is a VTT File? WebVTT Captions Explained',
  description:
    'Learn what a VTT file is, how WebVTT captions work, and when to use VTT instead of SRT. Includes syntax examples, browser use cases, and conversion tips.',
  keywords: [
    'what is vtt file',
    'webvtt file',
    'vtt subtitles',
    'vtt file format',
    'webvtt captions',
  ],
  alternates: { canonical: '/blog/what-is-vtt-file' },
  openGraph: {
    url: '/blog/what-is-vtt-file',
    type: 'article',
    image: articleImage,
    imageAlt: 'WebVTT browser caption format guide',
  },
};

const articleJsonLd = blogPostJsonLd({
  headline: 'What Is a VTT File? WebVTT Captions Explained',
  description:
    'Learn what a VTT file is, how WebVTT captions work, and when to use VTT instead of SRT. Includes syntax examples, browser use cases, and conversion tips.',
  url: '/blog/what-is-vtt-file',
  image: articleImage,
  datePublished: '2026-05-13',
  dateModified: '2026-07-19',
});

export default function WhatIsVttFilePage() {
  return (
    <article className="responsive-content mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <JsonLd data={articleJsonLd} />
      <header className="mb-10">
        <Link
          href="/blog"
          title="Back to SubtitleOps blog"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block"
        >
          &larr; Back to blog
        </Link>
        <ArticleMeta datePublished="2026-05-13" />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-3 leading-tight">
          What Is a VTT File? WebVTT Captions Explained
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          A VTT file is a WebVTT caption file used by HTML5 video players to
          display timed text in the browser. It looks similar to SRT, but WebVTT
          adds a required header, browser-oriented cue settings, comments, and
          optional styling hooks that make it better suited for web video.
        </p>
      </header>

      <ArticleHeroImage
        src={articleImage}
        alt="WebVTT caption format for browser video"
      />

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
            Need to move between VTT and SRT?
          </span>{' '}
          <Link
            href="/tools/vtt-to-srt"
            title="Convert VTT to SRT subtitle format"
            className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800"
          >
            Convert VTT to SRT
          </Link>{' '}
          for editors and players, or{' '}
          <Link
            href="/tools/srt-to-vtt"
            title="Convert SRT to VTT subtitle format"
            className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800"
          >
            convert SRT to VTT
          </Link>{' '}
          for browser captions.
        </p>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Basic WebVTT Structure</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          A valid VTT file starts with the{' '}
          <code className="bg-muted px-1.5 py-0.5 rounded text-xs">WEBVTT</code>{' '}
          header. Each cue then uses dot-based timestamps and visible caption
          text.
        </p>
        <pre className="rounded-lg bg-muted/50 p-4 text-sm font-mono leading-relaxed overflow-auto mb-4">
          {`WEBVTT

00:00:01.000 --> 00:00:04.500
Welcome to the tutorial.

00:00:05.200 --> 00:00:08.800 align:center position:50%
Open the file menu.`}
        </pre>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-40">
              Header:
            </span>
            VTT requires a WEBVTT header. SRT does not have one.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-40">
              Timestamps:
            </span>
            VTT uses dots before milliseconds, such as{' '}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
              00:00:01.000
            </code>
            .
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-40">
              Cue settings:
            </span>
            Settings such as align, line, size, and position can tell the
            browser how to place a cue.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">When Should You Use VTT?</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Use VTT when the subtitle file is meant for a website, a course
          platform, or any HTML5 video workflow. The browser{' '}
          <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
            &lt;track&gt;
          </code>{' '}
          element expects WebVTT, not SRT. This is why an SRT file often needs
          to be converted before it can power native browser captions.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Use SRT when you need maximum compatibility with desktop media
          players, subtitle editors, video editors, and transcription tools. VTT
          is the better web delivery format; SRT is still the better interchange
          format for many editing workflows.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">VTT vs SRT at a Glance</h2>
        <div className="overflow-auto">
          <table className="w-full text-sm border">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-3 font-semibold">Feature</th>
                <th className="text-left p-3 font-semibold">VTT</th>
                <th className="text-left p-3 font-semibold">SRT</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="p-3 font-medium text-foreground">
                  Browser video
                </td>
                <td className="p-3">Native support</td>
                <td className="p-3">Needs conversion</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium text-foreground">Header</td>
                <td className="p-3">WEBVTT required</td>
                <td className="p-3">No header</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium text-foreground">
                  Milliseconds
                </td>
                <td className="p-3">Dot</td>
                <td className="p-3">Comma</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-foreground">
                  Cue placement
                </td>
                <td className="p-3">Supports cue settings</td>
                <td className="p-3">Minimal placement control</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Format References</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <a
              href="https://www.w3.org/TR/webvtt1/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-foreground/70"
            >
              W3C WebVTT specification
            </a>{' '}
            defines WebVTT syntax, cue settings, comments, and text tracks.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-foreground/70"
            >
              MDN WebVTT API documentation
            </a>{' '}
            explains WebVTT usage in browser video workflows.
          </li>
        </ul>
      </section>
    </article>
  );
}
