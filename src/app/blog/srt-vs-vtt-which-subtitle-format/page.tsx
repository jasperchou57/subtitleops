import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, blogPostJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "SRT vs VTT — Which Subtitle Format Should You Use?",
  description:
    "SRT and VTT look almost identical but behave differently in browsers, players, and editors. Learn when to use each and how to convert between them.",
  keywords: [
    "srt vs vtt",
    "srt or vtt",
    "difference between srt and vtt",
    "webvtt vs srt",
    "srt vs webvtt",
  ],
  alternates: { canonical: "/blog/srt-vs-vtt-which-subtitle-format" },
  openGraph: { url: "/blog/srt-vs-vtt-which-subtitle-format" },
};

const articleJsonLd = blogPostJsonLd({
  headline: "SRT vs VTT — Which Subtitle Format Should You Use?",
  description:
    "SRT and VTT look almost identical but behave differently in browsers, players, and editors. Learn when to use each and how to convert between them.",
  url: "/blog/srt-vs-vtt-which-subtitle-format",
  datePublished: "2026-03-23",
});

export default function SrtVsVttPost() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <JsonLd data={articleJsonLd} />
      <header className="mb-10">
        <Link
          href="/blog"
          title="Back to SubtitleOps blog"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block"
        >
          ← Back to blog
        </Link>
        <time className="block text-xs text-muted-foreground mt-2">
          March 23, 2026
        </time>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-2 leading-tight">
          SRT vs VTT — Which Subtitle Format Should You Use?
        </h1>
      </header>

      <div className="prose prose-neutral max-w-none text-[15px] leading-relaxed space-y-6">
        <p>
          SRT and VTT are the two most common subtitle formats in active use today. They share the same
          ancestor — WebVTT was originally called &ldquo;WebSRT&rdquo; and forked from the SubRip format
          in 2010 — so they look nearly identical in a text editor. But the differences between SRT and
          VTT matter as soon as your subtitle file leaves the editor and enters a player, a browser, or
          a platform upload form. This guide explains what actually differs between the two formats, where
          each one works best, and when you need to convert.
        </p>

        {/* CTA callout */}
        <div className="not-prose my-8 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-5">
          <svg className="h-5 w-5 shrink-0 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
          <div className="text-sm">
            <p className="font-medium text-foreground">Need to convert right now?</p>
            <p className="text-muted-foreground mt-0.5">
              <Link href="/tools/srt-to-vtt" title="Convert SRT to VTT subtitle format" className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800">Convert SRT to VTT</Link>{" · "}
              <Link href="/tools/vtt-to-srt" title="Convert VTT to SRT subtitle format" className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800">Convert VTT to SRT</Link>
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4">SRT and VTT at a Glance</h2>

        <div className="not-prose overflow-x-auto my-6">
          <table className="w-full text-sm border">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-3 font-semibold">Feature</th>
                <th className="text-left p-3 font-semibold">SRT (SubRip)</th>
                <th className="text-left p-3 font-semibold">VTT (WebVTT)</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b"><td className="p-3 font-medium text-foreground">File extension</td><td className="p-3">.srt</td><td className="p-3">.vtt</td></tr>
              <tr className="border-b"><td className="p-3 font-medium text-foreground">File header</td><td className="p-3">None</td><td className="p-3">WEBVTT (required)</td></tr>
              <tr className="border-b"><td className="p-3 font-medium text-foreground">Timestamp separator</td><td className="p-3">Comma (00:01:23,456)</td><td className="p-3">Dot (00:01:23.456)</td></tr>
              <tr className="border-b"><td className="p-3 font-medium text-foreground">Cue numbering</td><td className="p-3">Required</td><td className="p-3">Optional</td></tr>
              <tr className="border-b"><td className="p-3 font-medium text-foreground">Styling</td><td className="p-3">Basic bold/italic only</td><td className="p-3">CSS-based, positioning, alignment</td></tr>
              <tr className="border-b"><td className="p-3 font-medium text-foreground">Metadata</td><td className="p-3">Not supported</td><td className="p-3">NOTE blocks, chapter titles</td></tr>
              <tr className="border-b"><td className="p-3 font-medium text-foreground">Browser native</td><td className="p-3">No</td><td className="p-3">Yes (HTML5 &lt;track&gt;)</td></tr>
              <tr><td className="p-3 font-medium text-foreground">Specification</td><td className="p-3">Community-maintained</td><td className="p-3">W3C standard</td></tr>
            </tbody>
          </table>
        </div>

        <p>
          That table captures the structural differences, but the practical impact depends entirely on
          where your subtitle file is going. A format that works perfectly in VLC may fail silently in
          a browser player, and vice versa.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">What Makes SRT and VTT Different</h2>

        <h3 className="text-xl font-semibold mt-8 mb-3">File Header</h3>
        <p>
          SRT files have no header. The file starts directly with the first cue number. VTT files must
          begin with the string <code>WEBVTT</code> on the first line — without it, every compliant
          browser and player will reject the file as invalid. This is the single most common reason
          people see &ldquo;captions not showing&rdquo; after renaming an .srt file to .vtt. Renaming
          the extension is not a conversion. The header must be present.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Timestamp Syntax</h3>
        <p>
          SRT uses a comma between seconds and milliseconds: <code>00:01:23,456</code>. VTT uses a
          dot: <code>00:01:23.456</code>. This one-character difference breaks parsing in strict
          implementations. A compliant HTML5 player receiving SRT-style timestamps with commas will
          silently skip those cues. VTT also allows you to omit the hours portion when they are zero
          — <code>01:23.456</code> is valid VTT but invalid SRT.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Cue Numbering</h3>
        <p>
          SRT requires a numeric identifier before each cue. These numbers must be sequential integers
          starting from 1. VTT makes cue identifiers optional, and when present, they can be any
          string — not just numbers. Most VTT files in practice omit them entirely, which produces a
          slightly smaller file and avoids the misnumbering errors that plague hand-edited SRT files.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Styling and Positioning</h3>
        <p>
          SRT was designed before web video existed. Its styling model is limited to basic HTML-like
          tags: <code>&lt;b&gt;</code>, <code>&lt;i&gt;</code>, <code>&lt;u&gt;</code>, and
          sometimes <code>&lt;font color=&quot;...&quot;&gt;</code>. Not every player supports even
          these. VTT exposes a CSS-based styling system. Cues can carry inline settings
          like <code>position:10%</code>, <code>line:0</code>, <code>align:start</code>, and
          external CSS stylesheets can target <code>::cue</code> pseudo-elements. This is
          powerful for branded web players where caption appearance needs to match the site design.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Metadata Support</h3>
        <p>
          VTT supports <code>NOTE</code> blocks — comments embedded in the file that do not render
          on screen. These are useful for translator notes, revision history, or encoding flags. VTT
          files can also define named regions for spatial layout (placing captions at specific screen
          coordinates), which SRT cannot do at all. SRT files have no metadata mechanism — every
          non-cue line is either a number, a timestamp, or subtitle text.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Where Each Format Works Best</h2>

        <h3 className="text-xl font-semibold mt-8 mb-3">When to Use SRT</h3>
        <p>
          SRT is the right choice when you need maximum compatibility across desktop players, editing
          software, and upload platforms. VLC, mpv, Premiere Pro, DaVinci Resolve, Final Cut Pro,
          Handbrake, Plex, Kodi, and virtually every subtitle editor read SRT natively. Most video
          platforms — YouTube, Vimeo, Facebook, TikTok, LinkedIn — accept SRT uploads directly. If
          your subtitle file needs to work everywhere without any processing, SRT is the safer bet.
        </p>
        <p>
          SRT is also preferred in translation and localization workflows. Its flat structure with no
          styling metadata means translators can work directly in the file without accidentally
          breaking formatting tags. Many CAT tools (Computer Assisted Translation) and subtitle
          vendors expect SRT as both input and output format.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">When to Use VTT</h3>
        <p>
          VTT is the right choice when your subtitle file is headed into a browser. The
          HTML5 <code>&lt;track&gt;</code> element — the standard mechanism for delivering captions
          in web video — only supports WebVTT natively. If you embed a video with a <code>&lt;video&gt;</code> tag
          and reference an SRT file in the <code>src</code> attribute of <code>&lt;track&gt;</code>,
          captions will not appear. There is no fallback. The browser simply ignores a non-VTT file.
        </p>
        <p>
          This makes VTT the default format for course platforms (Coursera, Udemy, Teachable, Moodle,
          Canvas), custom video players (Video.js, Plyr, hls.js), marketing sites with embedded
          product demos, and any project where the playback surface is a web browser. If you are
          building or publishing to a web-based video experience, VTT is not optional — it is the
          only format the platform supports natively.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">The HTML5 Rule That Decides for You</h2>
        <p>
          The W3C specification for the <code>&lt;track&gt;</code> element requires WebVTT. This is
          not a preference or a recommendation — it is a hard requirement baked into browser
          implementations. Chrome, Firefox, Safari, and Edge all enforce it. When a web team asks
          for &ldquo;subtitle support&rdquo; on their video player, the answer is always a .vtt file.
        </p>
        <p>
          This rule also matters for accessibility compliance. WCAG 2.1 Success Criterion 1.2.2
          requires synchronized captions for prerecorded audio content. On the web, the standard
          mechanism for meeting that requirement is the <code>&lt;track kind=&quot;captions&quot;&gt;</code> element,
          which means WebVTT. Using VTT for web-delivered captions is not just a technical choice —
          it is the path that satisfies accessibility audits without relying on third-party plugins.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Platform Compatibility</h2>

        <div className="not-prose overflow-x-auto my-6">
          <table className="w-full text-sm border">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-3 font-semibold">Platform / Player</th>
                <th className="text-center p-3 font-semibold">SRT</th>
                <th className="text-center p-3 font-semibold">VTT</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b"><td className="p-3 font-medium text-foreground">YouTube</td><td className="text-center p-3">Yes</td><td className="text-center p-3">Yes</td></tr>
              <tr className="border-b"><td className="p-3 font-medium text-foreground">Vimeo</td><td className="text-center p-3">Yes</td><td className="text-center p-3">Yes</td></tr>
              <tr className="border-b"><td className="p-3 font-medium text-foreground">HTML5 &lt;track&gt;</td><td className="text-center p-3">No</td><td className="text-center p-3">Yes</td></tr>
              <tr className="border-b"><td className="p-3 font-medium text-foreground">VLC</td><td className="text-center p-3">Yes</td><td className="text-center p-3">Yes</td></tr>
              <tr className="border-b"><td className="p-3 font-medium text-foreground">Premiere Pro</td><td className="text-center p-3">Yes</td><td className="text-center p-3">Limited</td></tr>
              <tr className="border-b"><td className="p-3 font-medium text-foreground">DaVinci Resolve</td><td className="text-center p-3">Yes</td><td className="text-center p-3">No</td></tr>
              <tr className="border-b"><td className="p-3 font-medium text-foreground">Plex / Kodi</td><td className="text-center p-3">Yes</td><td className="text-center p-3">Yes</td></tr>
              <tr className="border-b"><td className="p-3 font-medium text-foreground">Coursera / Udemy</td><td className="text-center p-3">Sometimes</td><td className="text-center p-3">Yes</td></tr>
              <tr className="border-b"><td className="p-3 font-medium text-foreground">Facebook</td><td className="text-center p-3">Yes</td><td className="text-center p-3">No</td></tr>
              <tr><td className="p-3 font-medium text-foreground">TikTok</td><td className="text-center p-3">Yes</td><td className="text-center p-3">No</td></tr>
            </tbody>
          </table>
        </div>

        <p>
          The pattern is clear: SRT dominates in desktop editing and social media upload workflows.
          VTT dominates in browser-based playback. The overlap — YouTube, Vimeo, VLC — is where
          either format works and the choice comes down to what happens next in your workflow.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">How to Convert Between SRT and VTT</h2>
        <p>
          Because SRT and VTT share the same underlying structure (timestamped text cues), conversion
          between them is straightforward. But it is not as simple as renaming the file extension.
          A valid conversion must handle the header, timestamp punctuation, and cue index differences.
        </p>

        <p>
          <strong>SRT to VTT</strong> adds the <code>WEBVTT</code> header, changes comma-separated
          milliseconds to dot-separated, and strips the numeric cue indices. You
          can{" "}
          <Link href="/tools/srt-to-vtt" title="Convert SRT to VTT subtitle format" className="font-medium underline underline-offset-4 hover:text-foreground/70">convert SRT to VTT here</Link>{" "}
          — the tool handles all three changes automatically.
        </p>
        <p>
          <strong>VTT to SRT</strong> removes the header, switches dot-separated milliseconds back
          to commas, strips cue settings that SRT cannot represent, and adds sequential numeric
          indices. You can{" "}
          <Link href="/tools/vtt-to-srt" title="Convert VTT to SRT subtitle format" className="font-medium underline underline-offset-4 hover:text-foreground/70">convert VTT to SRT here</Link>.
        </p>
        <p>
          In both directions, the subtitle text and timing are preserved. The conversion changes the
          container syntax, not the content. If you need to go further — for example, extracting just
          the dialogue text without any timestamps — the{" "}
          <Link href="/tools/srt-to-txt" title="Convert SRT to TXT plain text" className="font-medium underline underline-offset-4 hover:text-foreground/70">SRT to TXT tool</Link>{" "}
          handles that as a separate step.
        </p>

        {/* CTA callout */}
        <div className="not-prose my-8 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-5">
          <svg className="h-5 w-5 shrink-0 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
          <div className="text-sm">
            <p className="font-medium text-foreground">Don&apos;t lose compatibility by using the wrong format</p>
            <p className="text-muted-foreground mt-0.5">
              Headed to a browser? <Link href="/tools/srt-to-vtt" title="Convert SRT to VTT subtitle format" className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800">Convert SRT to VTT</Link>.
              {" "}Headed to an editor? <Link href="/tools/vtt-to-srt" title="Convert VTT to SRT subtitle format" className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800">Convert VTT to SRT</Link>.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4">SRT vs VTT — The Short Answer</h2>
        <p>
          If your subtitle file is going into a web player, a course platform, or any HTML5-based
          video environment, use VTT. If it is going into a desktop editor, a media server, or a
          social media upload form, use SRT. If you are not sure, start with SRT and convert to VTT
          when the web delivery step arrives — the conversion preserves everything that matters, and
          both SubtitleOps tools handle the syntax changes in one step.
        </p>
        <p>
          The formats are siblings, not competitors. Most real subtitle workflows touch both at
          different stages. The important thing is using the right format at the right stage, not
          picking one and hoping it works everywhere.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Frequently Asked Questions</h2>

        <h3 className="text-lg font-semibold mt-6 mb-2">Can I just rename .srt to .vtt?</h3>
        <p>
          No. Renaming the extension does not add the required <code>WEBVTT</code> header or fix the
          timestamp punctuation. Browsers will reject the file. Use an{" "}
          <Link href="/tools/srt-to-vtt" title="Convert SRT to VTT subtitle format" className="font-medium underline underline-offset-4 hover:text-foreground/70">SRT to VTT converter</Link>{" "}
          to handle the syntax changes properly.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2">Does converting SRT to VTT change the timing?</h3>
        <p>
          No. The timing values are preserved exactly. The conversion only changes the file header,
          timestamp punctuation (comma to dot), and cue indexing. Your subtitles will appear at the
          same moments in the video.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2">Which format does YouTube prefer?</h3>
        <p>
          YouTube accepts both SRT and VTT. Internally, YouTube converts everything to its own
          timed text format. If you already have either format ready, upload it directly — there
          is no quality advantage to choosing one over the other for YouTube specifically.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2">Can VTT do everything SRT can do?</h3>
        <p>
          Yes. VTT is a superset of SRT in terms of capability. Every piece of information stored
          in an SRT file (timing, text, basic formatting) can be represented in VTT. The reverse is
          not true — VTT features like cue settings, NOTE blocks, and region definitions have no
          SRT equivalent.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2">Why does my VTT file work in VLC but not in Chrome?</h3>
        <p>
          VLC has its own subtitle parser that is more permissive than browsers. Chrome strictly
          follows the W3C WebVTT specification. Common causes: missing <code>WEBVTT</code> header,
          BOM (byte order mark) at the start of the file, or using SRT-style comma timestamps
          instead of dot timestamps.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2">Is VTT replacing SRT?</h3>
        <p>
          Not in any practical sense. SRT remains the most widely supported subtitle format across
          desktop software, media servers, and social platforms. VTT has become the standard for
          browser-based video delivery specifically. Both formats will likely coexist for years
          because they serve different parts of the subtitle workflow.
        </p>
      </div>
    </article>
  );
}
