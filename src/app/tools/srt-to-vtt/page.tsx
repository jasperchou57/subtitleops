import type { Metadata } from "next";
import Link from "next/link";
import { SrtToVttConverter } from "./converter";
import { VibeBackgroundGlow } from "@/components/ui/vibe-background-glow";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Free SRT to VTT Converter Online",
  description: "Convert SubRip (.srt) subtitle files to WebVTT (.vtt) format for HTML5 video. Adds WEBVTT header, converts timestamps. No upload — 100% private.",
  keywords: ["srt to vtt", "convert srt to vtt", "srt to webvtt", "subtitle to vtt", "html5 subtitle converter"],
  alternates: { canonical: "/tools/srt-to-vtt" },
};

const relatedTools = [
  { name: "VTT to SRT", href: "/tools/vtt-to-srt" },
  { name: "ASS to SRT", href: "/tools/ass-to-srt" },
  { name: "TXT to SRT", href: "/tools/txt-to-srt" },
  { name: "SRT to TXT", href: "/tools/srt-to-txt" },
  { name: "Subtitle Merger", href: "/tools/subtitle-merger" },
];

export default function SrtToVttPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <section className="relative py-10 md:py-14">
        <VibeBackgroundGlow />
        <h1 className="relative text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center">
          Convert SRT to VTT Instantly
        </h1>
        <p className="relative mt-3 text-center text-muted-foreground max-w-2xl mx-auto">
          Convert SubRip (.srt) subtitle files to WebVTT (.vtt) format — the standard for HTML5 video.
          Adds the required WEBVTT header and converts comma timestamps to dot notation.
        </p>
        <div className="mt-8"><SrtToVttConverter /></div>
        <div className="mt-6 rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Why convert to VTT?</span>{" "}
          WebVTT is required by the HTML5 {"<track>"} element. If you&apos;re embedding subtitles in a web page, you need .vtt files.
        </div>
      </section>

      <section className="pb-12 border-t pt-10">
        <h2 className="text-2xl font-bold mb-4">When to Use VTT Instead of SRT</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          WebVTT (Web Video Text Tracks) is the W3C standard for displaying timed text in HTML5 video players.
          If you&apos;re building a website with embedded video and need subtitle support, the HTML5 {"<track>"} element
          only accepts .vtt files — not .srt. Converting your existing SRT subtitles to VTT is the simplest path
          to adding captions to your web videos.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The conversion is straightforward: SRT uses comma-separated milliseconds (00:01:23,456) while VTT uses
          dots (00:01:23.456). A WEBVTT header line is added, and SRT index numbers are removed.
          All timing and text content are preserved exactly.
        </p>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <Accordion className="w-full">
          <AccordionItem value="why-vtt"><AccordionTrigger>Why do I need VTT format?</AccordionTrigger><AccordionContent>HTML5 video players and the {"<track>"} element require WebVTT format. Browsers cannot natively load SRT files as subtitles. If you&apos;re adding captions to a web-based video player, VTT is the standard format.</AccordionContent></AccordionItem>
          <AccordionItem value="styling"><AccordionTrigger>Does VTT support more styling than SRT?</AccordionTrigger><AccordionContent>Yes. WebVTT supports cue settings for positioning (vertical, line, position, size, align) and CSS-like styling through ::cue pseudo-elements. However, this basic converter preserves the text content without adding VTT-specific styling.</AccordionContent></AccordionItem>
          <AccordionItem value="privacy"><AccordionTrigger>Is my file uploaded anywhere?</AccordionTrigger><AccordionContent>No. The conversion runs entirely in your browser. Your file is never sent to any server.</AccordionContent></AccordionItem>
        </Accordion>
      </section>

      <section className="pb-16">
        <h2 className="text-lg font-semibold mb-4">Related Tools</h2>
        <div className="flex flex-wrap gap-2">
          {relatedTools.map((t) => (<Link key={t.href} href={t.href} className="inline-flex items-center rounded-lg border bg-card px-4 py-2 text-sm hover:bg-accent transition-colors">{t.name}</Link>))}
        </div>
      </section>
    </div>
  );
}
