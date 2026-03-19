import type { Metadata } from "next";
import Link from "next/link";
import { VttToSrtConverter } from "./converter";
import { VibeBackgroundGlow } from "@/components/ui/vibe-background-glow";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { JsonLd, toolPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Free VTT to SRT Converter Online",
  description:
    "Convert WebVTT subtitle files to SRT format in your browser. Remove WebVTT headers and cue settings, keep dialogue and timing, and download a clean SubRip file.",
  keywords: ["vtt to srt", "webvtt to srt", "convert vtt to srt", "vtt subtitle converter"],
  alternates: { canonical: "/tools/vtt-to-srt" },
};

const jsonLdData = toolPageJsonLd({
  name: "VTT to SRT Converter",
  description: "Convert WebVTT subtitle files to SRT format in your browser. Remove WebVTT headers and cue settings, keep dialogue and timing, and download a clean SubRip file.",
  url: "/tools/vtt-to-srt",
  faqs: [
    { question: "What is a WebVTT file?", answer: "WebVTT is a caption format designed for web video. It uses the .vtt extension and usually begins with a WEBVTT header." },
    { question: "What changes during VTT to SRT conversion?", answer: "The converter removes the WebVTT header, rewrites timestamp punctuation, strips cue settings, and outputs the subtitle content as standard SRT entries." },
    { question: "Will subtitle timing stay the same?", answer: "Yes. The point of the conversion is to keep timing while rewriting the file into SRT syntax." },
    { question: "Can I keep WebVTT styling in SRT?", answer: "Not fully. SRT is a simpler subtitle format and does not support most WebVTT positioning or browser styling features." },
    { question: "Is my file private?", answer: "Yes. The VTT to SRT conversion runs in the browser and does not upload your file to a server." },
    { question: "What is the difference between VTT and SRT timestamp format?", answer: "WebVTT uses dots for milliseconds (00:01:23.456) while SRT uses commas (00:01:23,456). WebVTT also allows omitting the hours portion, which SRT does not." },
    { question: "Why do some VTT files fail in desktop subtitle workflows?", answer: "Because WebVTT carries browser-oriented syntax such as headers, cue settings, and optional web styling logic. Those features are useful on the web but often irrelevant or unsupported in simpler subtitle environments, which is exactly why VTT to SRT exists." },
  ],
});

const relatedTools = [
  { name: "ASS to SRT", href: "/tools/ass-to-srt" },
  { name: "TXT to SRT", href: "/tools/txt-to-srt" },
  { name: "SRT to VTT", href: "/tools/srt-to-vtt" },
  { name: "SRT to TXT", href: "/tools/srt-to-txt" },
];

export default function VttToSrtPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      {jsonLdData.map((data, i) => <JsonLd key={i} data={data} />)}

      {/* ===== Zone 1: Tool (Hero) ===== */}
      <section className="relative py-10 md:py-14">
        <VibeBackgroundGlow />
        <h1 className="relative text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center">
          Convert VTT to SRT Instantly
        </h1>
        <p className="relative mt-3 text-center text-muted-foreground max-w-2xl mx-auto">
          Use this free VTT to SRT converter to turn WebVTT caption files into clean SRT subtitles for editors, desktop players, and archive-friendly workflows. The converter removes the WEBVTT header, rewrites timestamp syntax, strips cue settings that SRT cannot represent, and preserves the subtitle text itself. Your file is processed locally in the browser from start to finish.
        </p>
        <div className="mt-8"><VttToSrtConverter /></div>
        <div className="mt-6 rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Need to go the other way for browser playback?</span>{" "}
          Use the{" "}
          <Link href="/tools/srt-to-vtt" className="font-medium underline underline-offset-4 hover:text-foreground/70">SRT to VTT page</Link>{" "}
          after you finish editing or cleaning your subtitle file.
        </div>
      </section>

      {/* ===== Zone 2: Landing Page Content ===== */}
      <section className="pb-12 border-t pt-10">
        <h2 className="text-2xl font-bold mb-6">How to Convert VTT to SRT in 3 Steps</h2>
        <ol className="grid gap-4 md:grid-cols-3 mb-8">
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">1</span>
            <h3 className="font-semibold mb-1">Upload your WebVTT file</h3>
            <p className="text-sm text-muted-foreground">
              Drop a .vtt file into the converter. This is the format commonly exported by web video platforms, LMS tools, and browser-based subtitle systems.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">2</span>
            <h3 className="font-semibold mb-1">Convert WebVTT syntax into SRT syntax</h3>
            <p className="text-sm text-muted-foreground">
              The conversion rewrites the parts that make WebVTT web-specific. It removes the header, strips cue settings, and converts dot-based timestamps into the comma-based style expected by SRT.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">3</span>
            <h3 className="font-semibold mb-1">Preview and download the SRT file</h3>
            <p className="text-sm text-muted-foreground">
              Once the syntax has been rewritten, you can review the output and save a plain SRT file that is easier to use in general-purpose subtitle workflows.
            </p>
          </li>
        </ol>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">What Changes When You Turn WebVTT Into SRT</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-40">The WEBVTT header disappears:</span>
            Every valid WebVTT file starts with a header. SRT does not use one, so the converter removes it. The header may also contain optional metadata or NOTE blocks, which are likewise discarded during conversion.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-40">Timestamp punctuation changes:</span>
            WebVTT uses dots for milliseconds. SRT uses commas. That difference matters because many players and editors are strict about it. Even a single incorrect separator can cause an entire subtitle track to fail to load in strict parsers.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-40">Cue settings are stripped:</span>
            WebVTT can carry positioning instructions such as position, align, line, and size. SRT does not understand those settings, so the converter removes them. This means any custom caption placement you defined in WebVTT will revert to default bottom-center positioning in the SRT output.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-40">Optional cue identifiers become plain SRT entries:</span>
            If the original WebVTT file includes cue identifiers, the output is normalized into the standard numbered SRT structure. SRT requires sequential numeric indexes starting from 1, so named identifiers are replaced accordingly.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-40">Browser styling logic does not survive:</span>
            WebVTT supports browser-oriented styling approaches, including class-based tags and ::cue styling. SRT is not designed for that layer, so the output focuses on text and timing instead. Basic formatting tags like bold and italic may be preserved where SRT players support them, but advanced CSS-based styling is removed entirely.
          </li>
        </ul>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Why People Convert WebVTT to SRT</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The most common reason is compatibility. WebVTT is excellent for browser-based delivery, but SRT is often the more practical working format once the subtitle file leaves the web player and enters a broader toolchain. If you downloaded captions from a course platform, web app, or HTML5 video workflow, SRT is often the format that makes the next step easier. It is easier to import into editors, easier to share with collaborators who expect subtitle basics rather than browser-specific features, and easier to archive as a simple, readable subtitle file. For archiving purposes, SRT is especially attractive because it is a plain-text format with no dependency on browser rendering engines, meaning the file remains fully readable and usable decades later without specialized software. Many video editors such as DaVinci Resolve, Premiere Pro, and Final Cut Pro handle SRT imports natively, while WebVTT support in those tools is limited or requires an extra webvtt to srt conversion step before importing.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-4">
          There is also a practical maintenance reason. WebVTT often appears in teams because a browser player produced it, not because everybody downstream prefers working with it. Once you leave the publishing surface and move into review, editing, distribution, or archival, the WebVTT-specific pieces can become noise. SRT reduces that complexity and gives you a cleaner base format for general-purpose subtitle work.
        </p>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Common Use Cases for VTT to SRT</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3"><span className="font-medium text-foreground shrink-0">Moving captions from web platforms into editors:</span> A lot of platforms export VTT because that is what the browser wants. Editors and post-production workflows often work more comfortably with SRT. This is especially true for tools like Premiere Pro and DaVinci Resolve, which have native SRT import support built in.</li>
          <li className="flex gap-3"><span className="font-medium text-foreground shrink-0">Cleaning web-delivery subtitles for general playback:</span> If the subtitle file no longer needs cue positioning or browser logic, SRT is the simpler format to keep. Desktop players like VLC, MPC-HC, and PotPlayer all handle SRT reliably without any additional configuration.</li>
          <li className="flex gap-3"><span className="font-medium text-foreground shrink-0">Sharing subtitles with teams that expect SRT:</span> Not every collaborator wants to inspect WebVTT syntax. SRT is the lowest-friction exchange format for many subtitle tasks. Translation teams and localization vendors almost universally accept SRT as a standard delivery format.</li>
          <li className="flex gap-3"><span className="font-medium text-foreground shrink-0">Creating a portable archive copy:</span> For long-term storage, plain SRT is often easier to inspect, reuse, and convert later than a more web-specific caption format. Because SRT is plain text with a minimal structure, it can be opened in any text editor and remains human-readable without specialized subtitle software.</li>
          <li className="flex gap-3"><span className="font-medium text-foreground shrink-0">Preparing subtitles for older or stricter software:</span> Some tools accept VTT in theory but behave more predictably with SRT in practice. Converting WebVTT to SRT can reduce surprises when the next system in the workflow is less browser-oriented than the source platform.</li>
        </ul>
      </section>

      {/* ===== Zone 3: FAQ + Related Tools ===== */}
      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <Accordion className="w-full">
          <AccordionItem value="what-is-vtt">
            <AccordionTrigger>What is a WebVTT file?</AccordionTrigger>
            <AccordionContent>
              WebVTT is a caption format designed for web video. It uses the .vtt extension and usually begins with a WEBVTT header.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="what-changes">
            <AccordionTrigger>What changes during VTT to SRT conversion?</AccordionTrigger>
            <AccordionContent>
              The converter removes the WebVTT header, rewrites timestamp punctuation, strips cue settings, and outputs the subtitle content as standard SRT entries.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="timing">
            <AccordionTrigger>Will subtitle timing stay the same?</AccordionTrigger>
            <AccordionContent>
              Yes. The point of the conversion is to keep timing while rewriting the file into SRT syntax.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="styling">
            <AccordionTrigger>Can I keep WebVTT styling in SRT?</AccordionTrigger>
            <AccordionContent>
              Not fully. SRT is a simpler subtitle format and does not support most WebVTT positioning or browser styling features.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="privacy">
            <AccordionTrigger>Is my file private?</AccordionTrigger>
            <AccordionContent>
              Yes. The VTT to SRT conversion runs in the browser and does not upload your file to a server.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="timestamp-format">
            <AccordionTrigger>What is the difference between VTT and SRT timestamp format?</AccordionTrigger>
            <AccordionContent>
              WebVTT uses dots for milliseconds (00:01:23.456) while SRT uses commas (00:01:23,456). WebVTT also allows omitting the hours portion, which SRT does not.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="vtt-desktop-fail">
            <AccordionTrigger>Why do some VTT files fail in desktop subtitle workflows?</AccordionTrigger>
            <AccordionContent>
              Because WebVTT carries browser-oriented syntax such as headers, cue settings, and optional web styling logic. Those features are useful on the web but often irrelevant or unsupported in simpler subtitle environments, which is exactly why VTT to SRT exists.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="pb-16">
        <h2 className="text-lg font-semibold mb-4">Related Subtitle Tools</h2>
        <div className="flex flex-wrap gap-2">
          {relatedTools.map((t) => (
            <Link key={t.href} href={t.href} className="inline-flex items-center rounded-lg border bg-card px-4 py-2 text-sm hover:bg-accent transition-colors">
              {t.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
