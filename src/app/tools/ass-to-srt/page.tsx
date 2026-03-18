import type { Metadata } from "next";
import Link from "next/link";
import { AssToSrtConverter } from "./converter";
import { VibeBackgroundGlow } from "@/components/ui/vibe-background-glow";
import { JsonLd, toolPageJsonLd } from "@/components/seo/json-ld";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Free ASS to SRT Converter Online",
  description:
    "Convert ASS (Advanced SubStation Alpha) subtitle files to SRT format instantly in your browser. Preserves timing, strips styling tags. No upload needed — 100% private.",
  keywords: [
    "ass to srt",
    "convert ass to srt",
    ".ass to srt",
    "ass subtitle converter",
    "ssa to srt",
    "advanced substation alpha converter",
  ],
  alternates: {
    canonical: "/tools/ass-to-srt",
  },
};

const relatedTools = [
  { name: "VTT to SRT", href: "/tools/vtt-to-srt" },
  { name: "TXT to SRT", href: "/tools/txt-to-srt" },
  { name: "SRT to VTT", href: "/tools/srt-to-vtt" },
  { name: "SRT to TXT", href: "/tools/srt-to-txt" },
  { name: "Subtitle Shifter", href: "/tools/subtitle-shifter" },
  { name: "Subtitle Merger", href: "/tools/subtitle-merger" },
];

const jsonLdData = toolPageJsonLd({
  name: "ASS to SRT Converter",
  description: "Convert ASS/SSA subtitle files to SRT format. Free, browser-based, no upload needed.",
  url: "/tools/ass-to-srt",
  faqs: [
    { question: "What is an ASS subtitle file?", answer: "ASS (Advanced SubStation Alpha) is a subtitle format used in anime fansubs and karaoke, supporting rich styling like fonts, colors, and positioning. It was created as an extension of the older SSA format." },
    { question: "What happens when I convert ASS to SRT?", answer: "The ASS to SRT conversion extracts dialogue text and timing from the [Events] section, strips all styling tags like \\fs, \\c, \\pos, and \\an, and converts centisecond timestamps to millisecond format." },
    { question: "Is this ASS to SRT converter free?", answer: "Yes, 100% free with no file size limits. Processing happens in your browser — files never leave your device." },
    { question: "Does ASS to SRT conversion preserve styling?", answer: "SRT has limited styling support. ASS-specific tags like fonts, colors, positioning, and animations are stripped. Text and timing are fully preserved." },
    { question: "Can I convert ASS files created with Aegisub?", answer: "Yes. Aegisub is the most popular ASS subtitle editor, and our converter fully supports ASS files exported from Aegisub, including files with multiple style tracks." },
    { question: "What is the difference between ASS and SRT timestamps?", answer: "ASS uses the format H:MM:SS.cc with centiseconds (hundredths of a second), while SRT uses HH:MM:SS,mmm with milliseconds. During ASS to SRT conversion, centiseconds are multiplied by 10 to get milliseconds." },
    { question: "Is my subtitle file safe?", answer: "Absolutely. All ASS to SRT processing happens directly in your browser using JavaScript. Your file is never uploaded to any server." },
  ],
});

export default function AssToSrtPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      {jsonLdData.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      {/* ===== Zone 1: Tool Area (Hero) ===== */}
      <section className="relative py-10 md:py-14">
        <VibeBackgroundGlow />

        <h1 className="relative text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center">
          Convert ASS to SRT Instantly
        </h1>
        <p className="relative mt-3 text-center text-muted-foreground max-w-2xl mx-auto">
          Use this free online ASS to SRT converter to transform Advanced SubStation Alpha subtitle files into
          universal SRT format. All ASS styling tags including fonts, colors, positioning, and animations are
          stripped while dialogue text and timing are fully preserved. Your file is processed entirely in your
          browser — nothing is uploaded to any server.
        </p>

        <div className="mt-8">
          <AssToSrtConverter />
        </div>

        {/* Workflow suggestion */}
        <div className="mt-6 rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Subtitle out of sync?</span>{" "}
          Fix timing with our{" "}
          <Link href="/tools/subtitle-shifter" className="font-medium underline underline-offset-4 hover:text-foreground/70">
            Subtitle Shifter
          </Link>{" "}
          — adjust timestamps by milliseconds after converting your subtitle file.
        </div>
      </section>

      {/* ===== Zone 2: Landing Page Content (SEO) ===== */}
      <section className="pb-12 border-t pt-10">
        <h2 className="text-2xl font-bold mb-6">
          How to Convert ASS to SRT in 3 Steps
        </h2>
        <ol className="grid gap-4 md:grid-cols-3 mb-8">
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">
              1
            </span>
            <h3 className="font-semibold mb-1">Upload ASS File</h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop your .ass or .ssa subtitle file into the ASS to SRT converter above, or click
              the upload area to browse your files. The converter accepts any valid ASS file regardless of
              size, including files created with Aegisub or any other subtitle editor.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">
              2
            </span>
            <h3 className="font-semibold mb-1">Automatic Conversion</h3>
            <p className="text-sm text-muted-foreground">
              The conversion happens instantly in your browser. The [Script Info] header and
              [V4+ Styles] definitions are removed, dialogue is extracted from the [Events] section, and
              all override tags are stripped from the subtitle text.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">
              3
            </span>
            <h3 className="font-semibold mb-1">Preview and Download SRT</h3>
            <p className="text-sm text-muted-foreground">
              Review the before and after comparison showing your original ASS content alongside the
              converted SRT output. When satisfied with the result, download your clean .srt file with
              a single click.
            </p>
          </li>
        </ol>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">What Happens During ASS to SRT Conversion</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          When you convert ASS to SRT, several specific transformations occur because the ASS format is
          far more complex than SRT. Understanding what changes during this conversion helps you decide
          whether SRT is the right output format for your subtitle workflow.
        </p>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Section removal:</span>
            ASS files are structured into three main sections: [Script Info] containing metadata like
            title and resolution, [V4+ Styles] defining named style presets, and [Events] holding the
            actual dialogue. During conversion, only the [Events] section is preserved — the
            script metadata and all style definitions are discarded because SRT has no equivalent.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Timestamp conversion:</span>
            ASS timestamps use the format H:MM:SS.cc where cc represents centiseconds (hundredths of a
            second), while SRT uses HH:MM:SS,mmm with milliseconds. During conversion, centisecond
            values are multiplied by 10 to produce the correct millisecond value. For example, an ASS
            timestamp of 0:01:23.45 becomes 00:01:23,450 in SRT format.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Override tags stripped:</span>
            ASS supports rich inline styling through override tags enclosed in curly braces. Tags like
            {"\\fs24"} (font size), {"\\c&H0000FF&"} (color), {"\\pos(320,50)"} (positioning),
            {"\\an8"} (alignment), {"\\fad(500,500)"} (fade effects), and {"\\t(\\fs48)"} (animations)
            are all removed. These styling features have no equivalent in the SRT format.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Line break handling:</span>
            ASS uses {"\\N"} for hard line breaks and {"\\n"} for soft line breaks within dialogue text.
            During conversion, both types of line breaks are converted to standard newline
            characters that SRT players understand.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Style tracks merged:</span>
            ASS allows multiple named styles (e.g., &quot;Default&quot;, &quot;Speaker1&quot;,
            &quot;Sign&quot;) where different speakers or subtitle types have completely different visual
            appearances. Since SRT does not support multiple style tracks, all dialogue lines from every
            style are combined into a single sequential subtitle stream sorted by timestamp.
          </li>
        </ul>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">
          ASS vs SRT — Detailed Format Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-semibold">Feature</th>
                <th className="text-left p-3 font-semibold">ASS (Advanced SubStation Alpha)</th>
                <th className="text-left p-3 font-semibold">SRT (SubRip)</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-3 font-medium">Styling</td>
                <td className="p-3 text-muted-foreground">Rich override tags: {"\\fs"} (font size), {"\\c"} (color), {"\\pos"} (positioning), {"\\an"} (alignment), {"\\fad"} (fade), {"\\t"} (animation)</td>
                <td className="p-3 text-muted-foreground">Basic HTML only: bold, italic, underline</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">File structure</td>
                <td className="p-3 text-muted-foreground">[Script Info], [V4+ Styles], and [Events] sections</td>
                <td className="p-3 text-muted-foreground">No header, sequential numbered entries</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Timestamp format</td>
                <td className="p-3 text-muted-foreground">H:MM:SS.cc (centiseconds)</td>
                <td className="p-3 text-muted-foreground">HH:MM:SS,mmm (milliseconds)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Style tracks</td>
                <td className="p-3 text-muted-foreground">Multiple named styles for different speakers</td>
                <td className="p-3 text-muted-foreground">Single style stream, no named tracks</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Compatibility</td>
                <td className="p-3 text-muted-foreground">VLC, MPC-HC, mpv, Aegisub</td>
                <td className="p-3 text-muted-foreground">Almost all video players and platforms</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">File size</td>
                <td className="p-3 text-muted-foreground">Larger (includes style definitions and metadata)</td>
                <td className="p-3 text-muted-foreground">Smaller (plain text with timestamps)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Primary use case</td>
                <td className="p-3 text-muted-foreground">Anime fansubs, styled karaoke subtitles</td>
                <td className="p-3 text-muted-foreground">Universal subtitle format, streaming platforms</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Line breaks</td>
                <td className="p-3 text-muted-foreground">{"\\N"} (hard) and {"\\n"} (soft) newlines</td>
                <td className="p-3 text-muted-foreground">Standard newline characters</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          The primary reason to convert ASS to SRT is compatibility. While ASS delivers stunning visual
          effects in players like VLC and mpv, many platforms and video editors do not support the ASS
          format. SRT is accepted by virtually every video player, streaming platform, and editing
          application. If you have anime fansub files in ASS format and need to use them in Premiere Pro,
          DaVinci Resolve, or upload them to a platform that only accepts SRT, converting ASS to SRT is
          the fastest and most reliable solution.
        </p>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Common Use Cases for ASS to SRT Conversion</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Anime fansubs:</span>
            Anime fansub groups typically distribute subtitles in ASS format because it supports the rich
            typesetting their work requires. When you need to use these fansub subtitles on a device or
            player that only supports SRT, converting ASS to SRT ensures you can still enjoy the dialogue
            even without the visual styling.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Video editing:</span>
            Import subtitles into Premiere Pro, DaVinci Resolve, or Final Cut Pro. These editors prefer
            SRT format and may not properly parse the [V4+ Styles] and override tags found in ASS files.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Platform upload:</span>
            YouTube, Vimeo, and most video hosting platforms accept SRT but not ASS. Converting ASS to
            SRT lets you upload your subtitles to these services without manual reformatting.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Mobile playback:</span>
            Many mobile video players have limited or no support for ASS rendering. SRT is universally
            supported on both iOS and Android media players, ensuring your subtitles display correctly.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Karaoke cleanup:</span>
            ASS karaoke subtitles use complex timing tags like {"\\k"} and {"\\kf"} for syllable-by-syllable
            highlighting. Converting ASS to SRT strips these tags and produces clean, readable subtitle
            text suitable for standard playback.
          </li>
        </ul>
      </section>

      {/* ===== Zone 3: FAQ + Related Tools ===== */}
      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">
          Frequently Asked Questions
        </h2>
        <Accordion className="w-full">
          <AccordionItem value="what-is-ass">
            <AccordionTrigger>What is an ASS subtitle file?</AccordionTrigger>
            <AccordionContent>
              ASS (Advanced SubStation Alpha) is a subtitle format widely used in anime fansubs and karaoke
              subtitles. It supports rich styling through override tags including {"\\fs"} for font size,
              {"\\c"} for color, {"\\pos"} for positioning, {"\\an"} for alignment, {"\\fad"} for fade effects,
              and {"\\t"} for animations. ASS files are structured into three sections: [Script Info] for
              metadata, [V4+ Styles] for style definitions, and [Events] for the actual dialogue lines. The
              format is commonly created and edited with Aegisub, the most popular ASS subtitle editor.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="what-happens">
            <AccordionTrigger>What exactly happens during ASS to SRT conversion?</AccordionTrigger>
            <AccordionContent>
              During ASS to SRT conversion, the converter extracts dialogue lines from the [Events] section
              and discards the [Script Info] and [V4+ Styles] sections entirely. All override tags inside
              curly braces are stripped from the dialogue text. Timestamps are converted from the ASS format
              (H:MM:SS.cc with centiseconds) to SRT format (HH:MM:SS,mmm with milliseconds) by multiplying
              centisecond values by 10. Line breaks {"\\N"} and {"\\n"} are converted to standard newlines.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="aegisub">
            <AccordionTrigger>Can I convert ASS files created with Aegisub?</AccordionTrigger>
            <AccordionContent>
              Yes, our ASS to SRT converter fully supports ASS files exported from Aegisub, which is the
              most popular software for creating and editing ASS subtitles. Aegisub-generated files may
              include complex style definitions, multiple style tracks for different speakers, and advanced
              override tags — all of which are properly handled during ASS to SRT conversion. The dialogue
              text and timing from every style track are preserved in the output SRT file.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="styling">
            <AccordionTrigger>Does ASS to SRT conversion preserve subtitle styling?</AccordionTrigger>
            <AccordionContent>
              SRT format has very limited styling support compared to ASS. During ASS to SRT conversion,
              all ASS-specific override tags are removed, including {"\\fs24"} (font size), {"\\c&H0000FF&"}
              (color), {"\\pos(320,50)"} (positioning), {"\\an8"} (alignment), {"\\fad(500,500)"} (fade),
              and {"\\t"} (animation) tags. The dialogue text and all timing information are fully preserved.
              If you need to retain rich styling, consider keeping the ASS format or converting to WebVTT
              using our{" "}
              <Link href="/tools/srt-to-vtt" className="font-medium underline underline-offset-4 hover:text-foreground/70">
                SRT to VTT converter
              </Link>{" "}after the conversion.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="timestamps">
            <AccordionTrigger>How are ASS timestamps converted to SRT format?</AccordionTrigger>
            <AccordionContent>
              ASS uses the timestamp format H:MM:SS.cc where cc represents centiseconds (hundredths of a
              second), while SRT uses HH:MM:SS,mmm with milliseconds (thousandths of a second). During ASS
              to SRT conversion, the centisecond value is multiplied by 10 to produce the correct millisecond
              value. For example, 0:02:15.38 in ASS becomes 00:02:15,380 in SRT. The single-digit hour in
              ASS is also zero-padded to two digits as required by the SRT specification.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="batch">
            <AccordionTrigger>Can I batch convert multiple ASS files to SRT?</AccordionTrigger>
            <AccordionContent>
              The free version of our ASS to SRT converter processes one file at a time. Batch ASS to SRT
              conversion for multiple files will be available in our premium plan. Each file is processed
              entirely in your browser for maximum privacy and speed — no files are ever uploaded to a server.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="privacy">
            <AccordionTrigger>Is my ASS subtitle file safe and private?</AccordionTrigger>
            <AccordionContent>
              Absolutely. All ASS to SRT conversion processing happens directly in your web browser using
              client-side JavaScript. Your subtitle file is never uploaded to any server, never transmitted
              over the internet, and never stored anywhere. We have zero access to your files. This makes
              our ASS to SRT converter the most private option available — your data stays on your device.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Related Tools */}
      <section className="pb-16">
        <h2 className="text-lg font-semibold mb-4">Related Subtitle Tools</h2>
        <div className="flex flex-wrap gap-2">
          {relatedTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="inline-flex items-center rounded-lg border bg-card px-4 py-2 text-sm hover:bg-accent hover:border-primary/50 transition-colors"
            >
              {tool.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
