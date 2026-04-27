import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About SubtitleOps",
  description:
    "SubtitleOps is a free, browser-based subtitle tool suite for converting, extracting, and drafting subtitle files between SRT, ASS, VTT, and TXT formats.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
        About SubtitleOps
      </h1>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>
          SubtitleOps is a free, browser-based subtitle tool suite built for
          people who work with subtitle files regularly. Whether you need to
          convert between formats, extract transcript text, or draft subtitles
          from a plain script, SubtitleOps handles it without uploads, accounts,
          or installations.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">
          Why We Built This
        </h2>
        <p>
          Most subtitle tools online are either buried under ads, require file
          uploads to remote servers, or only handle one format pair. We wanted a
          tool that respects your privacy, runs entirely in the browser, and
          covers the most common subtitle workflows in one place.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">
          How It Works
        </h2>
        <p>
          Every conversion on SubtitleOps happens client-side. Your subtitle
          files are processed using JavaScript in your browser — nothing is
          uploaded to any server. This means faster conversions, complete
          privacy, and no file size limits imposed by server infrastructure.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">
          What We Support Today
        </h2>
        <p>
          SubtitleOps currently covers four kinds of subtitle work. Format
          conversion between SRT, ASS (Advanced SubStation Alpha), VTT (WebVTT),
          SBV (YouTube), and TXT. Transcript extraction for translation and
          review workflows. Subtitle drafting from plain text scripts. And
          subtitle timing correction through the Subtitle Timing Shift tool
          for fixing constant offsets, plus the Subtitle FPS Converter for
          rescaling between frame rates like 23.976, 25, 29.97, and 30 fps.
        </p>
        <p>
          More formats and tools are on our roadmap, including subtitle
          language translation. If a workflow you need is missing, send us a
          note — feature requests genuinely move the priority list.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">
          Contact
        </h2>
        <p>
          Have feedback, a bug report, or a feature request? Reach out at{" "}
          <a
            href="mailto:help@subtitleops.com"
            className="font-medium underline underline-offset-4 hover:text-foreground/70"
          >
            help@subtitleops.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
