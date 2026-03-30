import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, blogPostJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "What Is an SRT File? Format Structure Explained",
  description:
    "Learn what an SRT file is, how the SubRip subtitle format works, and where SRT files are used. Includes format anatomy, real examples, and common problems.",
  keywords: [
    "what is srt file",
    "srt file format",
    "srt format",
    "subrip subtitle",
    "srt file",
  ],
  alternates: { canonical: "/blog/what-is-srt-file" },
  openGraph: { url: "/blog/what-is-srt-file" },
};

const articleJsonLd = blogPostJsonLd({
  headline: "What Is an SRT File? Format Structure Explained",
  description:
    "Learn what an SRT file is, how the SubRip subtitle format works, and where SRT files are used. Includes format anatomy, real examples, and common problems.",
  url: "/blog/what-is-srt-file",
  datePublished: "2026-03-30",
});

export default function WhatIsSrtFilePage() {
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
          March 30, 2026
        </time>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-3 leading-tight">
          What Is an SRT File? Format Structure Explained
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          An SRT file is a plain-text subtitle file that stores dialogue lines with numbered entries,
          start and end timestamps, and the text that should appear on screen during each time window.
          The format was created by the SubRip software project and has since become the most widely
          supported subtitle format across video players, editors, streaming platforms, and transcription tools.
        </p>
      </header>

      {/* CTA — above fold */}
      <div className="mb-10 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
        <svg className="h-5 w-5 shrink-0 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
        </svg>
        <p className="text-sm">
          <span className="font-medium text-foreground">Already have an SRT file that needs converting?</span>{" "}
          <Link href="/tools/srt-to-vtt" title="Convert SRT to VTT subtitle format" className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800">Convert SRT to VTT</Link>{" "}
          for web players, or{" "}
          <Link href="/tools/srt-to-txt" title="Convert SRT to TXT plain text" className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800">extract text with SRT to TXT</Link>{" "}
          for translation and review.
        </p>
      </div>

      {/* Anatomy of an SRT file */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Anatomy of an SRT File</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Every SRT file follows the same four-line repeating pattern. Understanding this pattern is
          the key to reading, editing, and debugging subtitle files manually. Here is one complete
          SRT entry:
        </p>
        <pre className="rounded-lg bg-muted/50 p-4 text-sm font-mono leading-relaxed overflow-auto mb-4">
{`1
00:00:01,000 --> 00:00:04,500
This is the first subtitle line.

2
00:00:05,200 --> 00:00:08,800
This is the second line.
It can span multiple rows.`}
        </pre>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Each entry has exactly four components, and every SRT parser in existence expects them in
          this order:
        </p>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-40">Cue number:</span>
            A sequential integer starting at 1. Some players ignore this number entirely and rely on
            timestamp order, but most SRT editors expect it. If you renumber entries incorrectly,
            some players will display subtitles out of order.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-40">Timestamp line:</span>
            Two timestamps separated by the arrow marker {" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">--&gt;</code>. The format is{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">HH:MM:SS,mmm</code> where the
            comma before milliseconds is mandatory. Using a dot instead of a comma is the single most
            common SRT syntax error and the reason many files fail to load in strict parsers.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-40">Subtitle text:</span>
            One or more lines of visible dialogue. Most players support up to two lines. A third line
            is technically valid but often overflows on small screens. SRT supports basic HTML-like
            tags ({`<b>`}, {`<i>`}, {`<u>`}) for bold, italic, and underline, though support varies
            by player.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-40">Blank line separator:</span>
            A mandatory empty line between entries. This is how parsers know where one cue ends and
            the next begins. Missing blank lines cause entries to merge, which is another frequent
            source of broken SRT files.
          </li>
        </ul>
      </section>

      {/* Why SRT became the standard */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Why SRT Became the Default Subtitle Format</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          SRT files have no binary encoding, no headers, no metadata blocks, and no styling language.
          They are plain text that can be opened in any text editor on any operating system. That
          simplicity is the reason the SRT format survived while more complex competitors from the
          same era did not.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          When subtitle files needed to move between Windows, macOS, and Linux in the early 2000s,
          SRT was the only format that worked everywhere without conversion. That cross-platform
          compatibility created a network effect: because every player supported SRT, every
          transcription tool exported SRT, and because every tool exported SRT, every new player
          added SRT support first.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Today, SRT remains the default working format in most subtitle workflows. Professional
          transcription services deliver SRT. YouTube accepts SRT uploads. Video editors import SRT
          natively. Even when a project eventually needs a different format like WebVTT for browser
          playback or ASS for styled fansubs, the subtitle work usually starts as an SRT file and
          gets converted later.
        </p>
      </section>

      {/* Where SRT files are used */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Where SRT Files Are Used</h2>
        <div className="overflow-auto">
          <table className="w-full text-sm border">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-3 font-semibold">Environment</th>
                <th className="text-left p-3 font-semibold">SRT Support</th>
                <th className="text-left p-3 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="p-3 font-medium text-foreground">Desktop players (VLC, mpv, MPC-HC)</td>
                <td className="p-3">Full</td>
                <td className="p-3">Load SRT as external subtitle track or embed in MKV containers</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium text-foreground">YouTube / Vimeo</td>
                <td className="p-3">Full</td>
                <td className="p-3">Upload SRT directly for manual captions and translated subtitles</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium text-foreground">Video editors (Premiere, DaVinci)</td>
                <td className="p-3">Full</td>
                <td className="p-3">Import SRT as caption tracks for timing adjustment on the timeline</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium text-foreground">HTML5 browsers</td>
                <td className="p-3">None</td>
                <td className="p-3">
                  Browsers require WebVTT for the {`<track>`} element.{" "}
                  <Link href="/tools/srt-to-vtt" title="Convert SRT to VTT subtitle format" className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800">Convert SRT to VTT</Link>{" "}
                  before embedding in web video
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium text-foreground">Transcription services</td>
                <td className="p-3">Full</td>
                <td className="p-3">Most services (Rev, Otter, Descript) export SRT as a default option</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-foreground">Smart TVs / streaming devices</td>
                <td className="p-3">Partial</td>
                <td className="p-3">Most support SRT in MKV containers; standalone SRT file support varies</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mt-4">
          The one major gap is browser-based video. HTML5 video players use WebVTT instead of SRT
          for native caption rendering. If your subtitle file is headed for a website, course
          platform, or any browser-based player, converting SRT to VTT is a necessary step in the
          delivery workflow.
        </p>
      </section>

      {/* SRT limitations */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">What SRT Cannot Do</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Understanding the SRT format also means understanding its boundaries. SRT is deliberately
          minimal, and that minimalism has real trade-offs in production workflows:
        </p>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">No positioning control:</span>
            SRT subtitles always appear at the bottom center of the video frame. You cannot place text
            at the top, move it to avoid overlapping graphics, or position speaker labels on different
            sides of the screen. If subtitle placement matters, ASS or WebVTT are better choices.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">No font or color styling:</span>
            While some players support basic HTML tags in SRT for bold, italic, and color, this
            support is inconsistent. There is no official styling specification, and most platforms
            strip these tags during import.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">No metadata or headers:</span>
            SRT has no place to store information about the video, language, author, or encoding.
            The file is raw subtitle data with nothing else. This means language detection, for
            example, must be done by reading the text content rather than from a declared metadata field.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">No karaoke or animation:</span>
            If your subtitle workflow involves karaoke timing, progressive text reveal, fade effects,
            or any visual animation, SRT is not the right format. ASS (Advanced SubStation Alpha) is
            the standard choice for those use cases.
          </li>
        </ul>
      </section>

      {/* Common SRT problems */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Common SRT File Problems and How to Fix Them</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          SRT files break more often than people expect, usually because of small syntax mistakes
          that are invisible until the file hits a strict parser. These are the most frequent issues:
        </p>
        <ul className="space-y-4 text-sm text-muted-foreground">
          <li>
            <p className="font-medium text-foreground">Dot instead of comma in timestamps</p>
            <p className="mt-1">
              The SRT specification requires a comma before milliseconds:{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs">00:01:23,456</code>.
              WebVTT uses a dot. If someone hand-edits an SRT file and uses dots, or if a tool
              exports with the wrong punctuation, strict parsers will reject the file. This is the
              number one reason SRT files silently fail to load.
            </p>
          </li>
          <li>
            <p className="font-medium text-foreground">Wrong character encoding</p>
            <p className="mt-1">
              SRT files should be saved as UTF-8, especially when they contain non-Latin characters
              like Chinese, Japanese, Korean, Arabic, or accented European text. Files saved in
              legacy encodings like Windows-1252 or Shift-JIS will display garbled characters in
              players that expect UTF-8. If subtitles appear as question marks or random symbols,
              encoding is almost always the cause.
            </p>
          </li>
          <li>
            <p className="font-medium text-foreground">Missing blank lines between entries</p>
            <p className="mt-1">
              Every SRT entry must be followed by an empty line. Without it, the parser cannot tell
              where one cue ends and the next begins. The result is usually merged entries or
              subtitles that display at the wrong time.
            </p>
          </li>
          <li>
            <p className="font-medium text-foreground">BOM (Byte Order Mark) at the start of the file</p>
            <p className="mt-1">
              Some text editors on Windows insert an invisible BOM character at the beginning of
              UTF-8 files. This can cause the first cue number to be misread, making the first
              subtitle entry invisible or misaligned. Saving the file as &ldquo;UTF-8 without
              BOM&rdquo; fixes this.
            </p>
          </li>
          <li>
            <p className="font-medium text-foreground">Overlapping timestamps</p>
            <p className="mt-1">
              When two entries have time ranges that overlap, players handle it differently. Some
              show both lines simultaneously, some show only the later entry, and some skip one
              entirely. If subtitles disappear unexpectedly, check for timestamp overlaps.
            </p>
          </li>
        </ul>
      </section>

      {/* SRT vs other formats */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">SRT Compared to Other Subtitle Formats</h2>
        <div className="overflow-auto">
          <table className="w-full text-sm border">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-3 font-semibold">Feature</th>
                <th className="text-left p-3 font-semibold">SRT</th>
                <th className="text-left p-3 font-semibold">VTT</th>
                <th className="text-left p-3 font-semibold">ASS</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="p-3 font-medium text-foreground">Plain text editable</td>
                <td className="p-3">Yes</td>
                <td className="p-3">Yes</td>
                <td className="p-3">Yes</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium text-foreground">Browser native</td>
                <td className="p-3">No</td>
                <td className="p-3">Yes</td>
                <td className="p-3">No</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium text-foreground">Positioning</td>
                <td className="p-3">No</td>
                <td className="p-3">Yes (cue settings)</td>
                <td className="p-3">Yes (pixel-precise)</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium text-foreground">Styling</td>
                <td className="p-3">Basic tags only</td>
                <td className="p-3">CSS-based</td>
                <td className="p-3">Full (fonts, colors, effects)</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium text-foreground">Karaoke / animation</td>
                <td className="p-3">No</td>
                <td className="p-3">No</td>
                <td className="p-3">Yes</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-foreground">Player support</td>
                <td className="p-3">Universal</td>
                <td className="p-3">Browsers only</td>
                <td className="p-3">Desktop + fansub players</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mt-4">
          For a deeper comparison between SRT and VTT, including when to convert and when not to,
          read the full{" "}
          <Link href="/blog/srt-vs-vtt-which-subtitle-format" title="SRT vs VTT — Which Subtitle Format Should You Use?" className="font-medium underline underline-offset-4 hover:text-foreground/70">
            SRT vs VTT comparison guide
          </Link>.
          For ASS versus SRT trade-offs in fansub and styled subtitle workflows, see the{" "}
          <Link href="/blog/ass-vs-srt-when-to-convert" title="ASS vs SRT — When to Convert" className="font-medium underline underline-offset-4 hover:text-foreground/70">
            ASS vs SRT guide
          </Link>.
        </p>
      </section>

      {/* When to convert SRT */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">When You Need to Convert an SRT File</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          SRT is a strong working format, but it is not always the right delivery format. These are
          the situations where converting an SRT file is the correct next step:
        </p>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Web video delivery:</span>{" "}
            HTML5 video players require WebVTT. If your SRT file is going into a website, course
            platform, or browser-based player,{" "}
            <Link href="/tools/srt-to-vtt" title="Convert SRT to VTT subtitle format" className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800">
              convert SRT to VTT
            </Link>{" "}
            before embedding.
          </li>
          <li>
            <span className="font-medium text-foreground">Translation or text review:</span>{" "}
            When translators or reviewers need the dialogue without timestamp noise,{" "}
            <Link href="/tools/srt-to-txt" title="Convert SRT to TXT plain text" className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800">
              extract text with SRT to TXT
            </Link>{" "}
            to produce a clean transcript.
          </li>
          <li>
            <span className="font-medium text-foreground">Receiving non-SRT files:</span>{" "}
            If someone sends you an ASS or VTT file and your workflow expects SRT, use{" "}
            <Link href="/tools/ass-to-srt" title="Convert ASS to SRT subtitle format" className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800">ASS to SRT</Link>{" "}
            or{" "}
            <Link href="/tools/vtt-to-srt" title="Convert VTT to SRT subtitle format" className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800">VTT to SRT</Link>{" "}
            to standardize the file.
          </li>
          <li>
            <span className="font-medium text-foreground">Creating subtitles from scratch:</span>{" "}
            If you have a script, transcript, or lyrics but no timed subtitle file,{" "}
            <Link href="/tools/txt-to-srt" title="Convert TXT to SRT subtitle format" className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800">
              use TXT to SRT
            </Link>{" "}
            to generate a subtitle draft with auto-generated timestamps.
          </li>
        </ul>
      </section>

      {/* Bottom CTA */}
      <div className="mb-10 rounded-xl border border-blue-200 bg-blue-50/50 p-5">
        <p className="font-medium text-foreground text-sm mb-2">
          Don&apos;t leave your SRT file in the wrong format
        </p>
        <p className="text-sm text-muted-foreground">
          SubtitleOps converts between SRT, VTT, ASS, and TXT in the browser. No upload, no signup.{" "}
          <Link href="/" title="SubtitleOps — Free Online Subtitle Converter" className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800">
            Open the converter
          </Link>{" "}
          and drop your file.
        </p>
      </div>

      <footer className="border-t pt-8 text-sm text-muted-foreground">
        <p>
          Published on March 30, 2026. This article is part of the{" "}
          <Link href="/blog" title="SubtitleOps Blog" className="underline underline-offset-4 hover:text-foreground">
            SubtitleOps subtitle guides series
          </Link>.
        </p>
      </footer>
    </article>
  );
}
