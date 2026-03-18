import type { Metadata } from "next";
import Link from "next/link";
import { VttToSrtConverter } from "./converter";
import { VibeBackgroundGlow } from "@/components/ui/vibe-background-glow";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { JsonLd, toolPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Free VTT to SRT Converter Online",
  description:
    "Convert WebVTT (.vtt) subtitle files to SRT format instantly in your browser. Strips cue settings, preserves timing. No upload — 100% private and free.",
  keywords: ["vtt to srt", "convert vtt to srt", "webvtt to srt", "vtt subtitle converter", "webvtt converter", "vtt to srt online"],
  alternates: { canonical: "/tools/vtt-to-srt" },
};

const jsonLdData = toolPageJsonLd({
  name: "VTT to SRT Converter",
  description: "Convert WebVTT subtitle files to SRT format instantly. Free, browser-based, no upload needed.",
  url: "/tools/vtt-to-srt",
  faqs: [
    { question: "What is a WebVTT file?", answer: "WebVTT (Web Video Text Tracks) is a W3C standard subtitle format for HTML5 video. Files use .vtt extension and begin with a WEBVTT header." },
    { question: "What changes during VTT to SRT conversion?", answer: "The WEBVTT header is removed, timestamp dot separators become commas, cue settings (position, align, line) are stripped, and HTML-like tags are removed." },
    { question: "Is my file uploaded to a server?", answer: "No. All VTT to SRT conversion happens in your browser using JavaScript. Your file never leaves your device." },
    { question: "Can I convert VTT to SRT with styling preserved?", answer: "SRT supports only basic HTML tags like <b>, <i>, and <u>. WebVTT cue settings and CSS styling are removed during conversion since SRT has no equivalent." },
    { question: "Does this VTT to SRT converter support multiple languages?", answer: "Yes. The converter handles UTF-8 encoded text, supporting all languages including Chinese, Japanese, Korean, Arabic, and Cyrillic characters." },
    { question: "What is the difference between VTT and SRT timestamp format?", answer: "VTT uses dots for milliseconds (00:01:23.456) while SRT uses commas (00:01:23,456). VTT also allows omitting the hours portion." },
  ],
});

const relatedTools = [
  { name: "ASS to SRT", href: "/tools/ass-to-srt" },
  { name: "TXT to SRT", href: "/tools/txt-to-srt" },
  { name: "SRT to VTT", href: "/tools/srt-to-vtt" },
  { name: "SRT to TXT", href: "/tools/srt-to-txt" },
  { name: "Subtitle Shifter", href: "/tools/subtitle-shifter" },
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
          Convert WebVTT (.vtt) subtitle files to SubRip (.srt) format with this free online VTT to SRT converter.
          Cue settings like positioning and alignment are stripped while all dialogue timing and text are preserved.
          Your VTT file is processed entirely in your browser — nothing is uploaded to any server.
        </p>
        <div className="mt-8"><VttToSrtConverter /></div>
        <div className="mt-6 rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Need the reverse?</span>{" "}
          Convert SRT back to WebVTT with our{" "}
          <Link href="/tools/srt-to-vtt" className="font-medium underline underline-offset-4 hover:text-foreground/70">SRT to VTT converter</Link>.
        </div>
      </section>

      {/* ===== Zone 2: Landing Page Content ===== */}
      <section className="pb-12 border-t pt-10">
        <h2 className="text-2xl font-bold mb-6">How to Convert VTT to SRT in 3 Steps</h2>
        <ol className="grid gap-4 md:grid-cols-3 mb-8">
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">1</span>
            <h3 className="font-semibold mb-1">Upload VTT File</h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop your .vtt subtitle file into the VTT to SRT converter above, or click the upload area to browse your files. The converter accepts any valid WebVTT file regardless of size.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">2</span>
            <h3 className="font-semibold mb-1">Automatic VTT to SRT Conversion</h3>
            <p className="text-sm text-muted-foreground">
              The VTT to SRT conversion happens instantly in your browser. The WEBVTT header is removed, dot-separated timestamps are converted to comma-separated format, and cue settings are stripped.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">3</span>
            <h3 className="font-semibold mb-1">Preview and Download SRT</h3>
            <p className="text-sm text-muted-foreground">
              Review the before and after comparison showing your original VTT content alongside the converted SRT output. When satisfied, download the .srt file with a single click.
            </p>
          </li>
        </ol>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">What Happens During VTT to SRT Conversion</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          When you convert VTT to SRT, several specific transformations occur to bridge the differences between these two subtitle formats. Understanding what changes during VTT to SRT conversion helps you decide whether SRT is the right output format for your workflow.
        </p>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-40">Header removal:</span>
            The mandatory WEBVTT header line (and any optional metadata like Kind, Language, or NOTE blocks) is removed entirely. SRT files have no header — they start directly with the first subtitle entry.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-40">Timestamp conversion:</span>
            VTT timestamps use a dot to separate milliseconds (00:01:23.456), while SRT uses a comma (00:01:23,456). Additionally, VTT allows omitting the hours portion (01:23.456), which is expanded to the full HH:MM:SS,mmm format required by SRT.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-40">Cue settings stripped:</span>
            WebVTT supports positioning settings after the timestamp arrow (like position:50% align:center line:80%), which control where subtitles appear on screen. SRT has no equivalent, so these cue settings are removed during VTT to SRT conversion.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-40">Styling tags:</span>
            VTT supports HTML-like tags including {"<b>"}, {"<i>"}, {"<u>"}, and class-based styling with {"<c.classname>"}. Basic tags like bold and italic are preserved where possible, but class-based and Ruby annotation tags are stripped.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-40">Cue identifiers:</span>
            VTT allows optional cue identifiers (text labels before timestamps). These are replaced with sequential numeric indices (1, 2, 3...) as required by the SRT format specification.
          </li>
        </ul>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">VTT vs SRT — Detailed Format Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead><tr className="bg-muted/50"><th className="text-left p-3 font-semibold">Feature</th><th className="text-left p-3 font-semibold">WebVTT (.vtt)</th><th className="text-left p-3 font-semibold">SRT (.srt)</th></tr></thead>
            <tbody className="divide-y">
              <tr><td className="p-3 font-medium">File header</td><td className="p-3 text-muted-foreground">Required WEBVTT header on first line</td><td className="p-3 text-muted-foreground">No header, starts with index number</td></tr>
              <tr><td className="p-3 font-medium">Timestamp separator</td><td className="p-3 text-muted-foreground">Dot for milliseconds (00:01:23.456)</td><td className="p-3 text-muted-foreground">Comma for milliseconds (00:01:23,456)</td></tr>
              <tr><td className="p-3 font-medium">Hours in timestamp</td><td className="p-3 text-muted-foreground">Optional (can use MM:SS.mmm)</td><td className="p-3 text-muted-foreground">Required (must use HH:MM:SS,mmm)</td></tr>
              <tr><td className="p-3 font-medium">Cue positioning</td><td className="p-3 text-muted-foreground">position, align, line, size, vertical</td><td className="p-3 text-muted-foreground">Not supported natively</td></tr>
              <tr><td className="p-3 font-medium">CSS styling</td><td className="p-3 text-muted-foreground">Supports ::cue pseudo-element</td><td className="p-3 text-muted-foreground">No CSS support</td></tr>
              <tr><td className="p-3 font-medium">Metadata/notes</td><td className="p-3 text-muted-foreground">Supports NOTE blocks and metadata</td><td className="p-3 text-muted-foreground">No metadata support</td></tr>
              <tr><td className="p-3 font-medium">Primary use case</td><td className="p-3 text-muted-foreground">HTML5 video, web browsers, streaming</td><td className="p-3 text-muted-foreground">Universal player support, desktop apps</td></tr>
              <tr><td className="p-3 font-medium">Player support</td><td className="p-3 text-muted-foreground">Browsers, modern streaming platforms</td><td className="p-3 text-muted-foreground">VLC, MPC-HC, mpv, Premiere, DaVinci</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          The main reason to convert VTT to SRT is compatibility. While WebVTT is the standard for web-based video players and HTML5 {"<track>"} elements, SRT enjoys near-universal support across desktop video players, video editing software, and legacy systems. If you downloaded subtitles from a streaming platform in VTT format and need to use them in VLC, Premiere Pro, or DaVinci Resolve, converting VTT to SRT is the simplest solution.
        </p>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Common Use Cases for VTT to SRT Conversion</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3"><span className="font-medium text-foreground shrink-0">Video editing:</span> Import subtitles into Premiere Pro, DaVinci Resolve, or Final Cut Pro. These editors prefer SRT format over VTT for timeline-based subtitle editing.</li>
          <li className="flex gap-3"><span className="font-medium text-foreground shrink-0">Desktop playback:</span> Load subtitles in VLC, MPC-HC, or mpv. While VLC does support VTT, SRT is the default expected format and avoids potential rendering issues with VTT cue settings.</li>
          <li className="flex gap-3"><span className="font-medium text-foreground shrink-0">Platform migration:</span> Move subtitles from web-based platforms (YouTube, Coursera, Udemy) that export in VTT to systems that require SRT format.</li>
          <li className="flex gap-3"><span className="font-medium text-foreground shrink-0">Subtitle distribution:</span> SRT is the most widely accepted format for subtitle sharing communities like OpenSubtitles and Subscene. Converting VTT to SRT ensures maximum compatibility.</li>
          <li className="flex gap-3"><span className="font-medium text-foreground shrink-0">Archival purposes:</span> SRT is a simpler, more portable format without platform-specific styling, making it ideal for long-term subtitle archival alongside video files.</li>
        </ul>
      </section>

      {/* ===== Zone 3: FAQ + Related Tools ===== */}
      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <Accordion className="w-full">
          <AccordionItem value="what-is-vtt">
            <AccordionTrigger>What is a WebVTT file?</AccordionTrigger>
            <AccordionContent>
              WebVTT (Web Video Text Tracks) is a W3C standard subtitle format designed specifically for HTML5 video elements and web browsers. WebVTT files use the .vtt extension and must begin with a WEBVTT header on the first line. The format supports features that SRT does not, including cue positioning (vertical, line, position, size, align), CSS-based styling through the ::cue pseudo-element, NOTE comment blocks, and metadata headers. Major streaming platforms like YouTube, Netflix, and Coursera use VTT as their primary subtitle format for web delivery.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="what-changes">
            <AccordionTrigger>What exactly changes during VTT to SRT conversion?</AccordionTrigger>
            <AccordionContent>
              During VTT to SRT conversion, four main changes occur: (1) The WEBVTT header and any NOTE blocks are removed. (2) Timestamp separators change from dots to commas, and missing hours are added. (3) Cue settings after the timestamp arrow (like position:50% align:center) are stripped. (4) HTML-like class tags and Ruby annotations are removed, while basic formatting tags like bold and italic are preserved. All dialogue text and timing remain intact.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="styling">
            <AccordionTrigger>Can I keep subtitle styling when converting VTT to SRT?</AccordionTrigger>
            <AccordionContent>
              SRT has very limited styling support compared to WebVTT. Basic HTML formatting tags like {"<b>"} (bold), {"<i>"} (italic), and {"<u>"} (underline) are preserved during conversion. However, VTT-specific features like CSS ::cue styling, position/align cue settings, vertical text, and class-based styling are lost because SRT has no equivalent. If you need rich styling, consider keeping the VTT format or using the ASS format instead.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="languages">
            <AccordionTrigger>Does this VTT to SRT converter support multiple languages?</AccordionTrigger>
            <AccordionContent>
              Yes. The VTT to SRT converter handles UTF-8 encoded text, which means it supports all languages and writing systems including Chinese, Japanese, Korean, Arabic, Hebrew, Cyrillic, Thai, and all European languages. Character encoding is preserved exactly during the conversion process.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="privacy">
            <AccordionTrigger>Is my VTT file safe and private?</AccordionTrigger>
            <AccordionContent>
              Absolutely. All VTT to SRT conversion processing happens directly in your web browser using client-side JavaScript. Your subtitle file is never uploaded to any server, never transmitted over the internet, and never stored anywhere. We have zero access to your files. This makes our VTT to SRT converter the most private option available — your data never leaves your device.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="timestamp">
            <AccordionTrigger>What is the difference between VTT and SRT timestamps?</AccordionTrigger>
            <AccordionContent>
              The two key timestamp differences between VTT and SRT are: (1) Millisecond separator — VTT uses a dot (00:01:23.456) while SRT uses a comma (00:01:23,456). (2) Hours requirement — VTT allows the hours portion to be omitted (01:23.456 is valid), while SRT always requires hours (00:01:23,456). Our converter handles both cases automatically, expanding short timestamps and swapping separators.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="batch">
            <AccordionTrigger>Can I batch convert multiple VTT files to SRT?</AccordionTrigger>
            <AccordionContent>
              The free version of our VTT to SRT converter processes one file at a time. Batch VTT to SRT conversion for multiple files will be available in our premium plan. Each file is processed entirely in your browser for maximum privacy and speed.
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
