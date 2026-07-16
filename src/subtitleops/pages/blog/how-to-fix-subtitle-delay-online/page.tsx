import type { LegacyMetadata as Metadata } from '@/lib/legacy-metadata';
import Link from '@/compat/next-link';
import { JsonLd, blogPostJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'How to Fix Subtitle Delay Online',
  description:
    'Learn how to fix subtitles that appear too early, too late, or drift out of sync. Includes when to use timing shift versus FPS conversion.',
  keywords: [
    'fix subtitle delay',
    'subtitle out of sync',
    'subtitle timing shift',
    'subtitle sync online',
    'fix srt delay',
  ],
  alternates: { canonical: '/blog/how-to-fix-subtitle-delay-online' },
  openGraph: { url: '/blog/how-to-fix-subtitle-delay-online' },
};

const articleJsonLd = blogPostJsonLd({
  headline: 'How to Fix Subtitle Delay Online',
  description:
    'Learn how to fix subtitles that appear too early, too late, or drift out of sync. Includes when to use timing shift versus FPS conversion.',
  url: '/blog/how-to-fix-subtitle-delay-online',
  datePublished: '2026-05-13',
});

export default function HowToFixSubtitleDelayOnlinePage() {
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
          How to Fix Subtitle Delay Online
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Subtitle delay usually has one of two causes: every subtitle is off by
          the same fixed amount, or the subtitle timing drifts further out of
          sync as the video plays. The correct fix depends on which problem you
          have.
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
            Ready to fix the file?
          </span>{' '}
          <Link
            href="/tools/subtitle-shift"
            title="Shift subtitles forward or backward by a fixed offset"
            className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800"
          >
            Use Subtitle Timing Shift
          </Link>{' '}
          for constant delay, or{' '}
          <Link
            href="/tools/subtitle-fps-converter"
            title="Rescale subtitle timing between frame rates"
            className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800"
          >
            use Subtitle FPS Converter
          </Link>{' '}
          when the timing drifts.
        </p>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">
          Step 1: Decide Whether It Is Delay or Drift
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Play the video near the start and compare a clear spoken line to the
          matching subtitle. Then do the same near the end. If both points are
          off by the same amount, you have a constant delay. If the end is much
          worse than the beginning, you have frame-rate drift.
        </p>
        <div className="overflow-auto">
          <table className="w-full text-sm border">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-3 font-semibold">Symptom</th>
                <th className="text-left p-3 font-semibold">Likely Cause</th>
                <th className="text-left p-3 font-semibold">Tool</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="p-3">Subtitles are always 2 seconds late</td>
                <td className="p-3">Constant offset</td>
                <td className="p-3">Timing shift</td>
              </tr>
              <tr className="border-b">
                <td className="p-3">Start is close, end is far off</td>
                <td className="p-3">Frame-rate mismatch</td>
                <td className="p-3">FPS conversion</td>
              </tr>
              <tr>
                <td className="p-3">Start is off and end drifts too</td>
                <td className="p-3">Both problems</td>
                <td className="p-3">FPS conversion first, then shift</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">
          Step 2: Use the Right Shift Value
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          If the subtitle appears after the dialogue, use a negative value to
          pull it earlier. If the subtitle appears before the dialogue, use a
          positive value to delay it.
        </p>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li>
            Dialogue at <span className="font-mono">00:12</span>, subtitle at{' '}
            <span className="font-mono">00:14</span>: enter{' '}
            <span className="font-mono">-2</span>.
          </li>
          <li>
            Subtitle at <span className="font-mono">00:10</span>, dialogue at{' '}
            <span className="font-mono">00:12</span>: enter{' '}
            <span className="font-mono">+2</span>.
          </li>
          <li>
            For small errors, decimals such as{' '}
            <span className="font-mono">0.25</span> or{' '}
            <span className="font-mono">-0.75</span> are usually enough.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">
          Step 3: Fix Drift with FPS Conversion
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          If a single shift fixes the first scene but the end of the video is
          still out of sync, do not keep guessing new shift values. That pattern
          means the subtitle file was timed against a different video frame
          rate. Choose the source FPS the subtitles were timed for, choose the
          target FPS of your video, and rescale the file. Common pairs include{' '}
          <span className="font-mono">23.976 → 25</span>,{' '}
          <span className="font-mono">25 → 23.976</span>, and{' '}
          <span className="font-mono">29.97 → 30</span>.
        </p>
      </section>
    </article>
  );
}
