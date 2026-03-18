import type { Metadata } from "next";
import Link from "next/link";
import { VttToSrtConverter } from "./converter";
import { VibeBackgroundGlow } from "@/components/ui/vibe-background-glow";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Free VTT to SRT Converter Online",
  description:
    "Convert WebVTT (.vtt) subtitle files to SRT format instantly in your browser. Strips cue settings, preserves timing. No upload — 100% private.",
  keywords: ["vtt to srt", "convert vtt to srt", "webvtt to srt", "vtt subtitle converter", "webvtt converter"],
  alternates: { canonical: "/tools/vtt-to-srt" },
};

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
      <section className="relative py-10 md:py-14">
        <VibeBackgroundGlow />
        <h1 className="relative text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center">
          Convert VTT to SRT Instantly
        </h1>
        <p className="relative mt-3 text-center text-muted-foreground max-w-2xl mx-auto">
          Convert WebVTT (.vtt) subtitle files to SubRip (.srt) format. Cue settings like positioning
          and alignment are stripped while all timing and text are preserved.
        </p>
        <div className="mt-8"><VttToSrtConverter /></div>
        <div className="mt-6 rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Need the reverse?</span>{" "}
          Convert SRT back to VTT with our{" "}
          <Link href="/tools/srt-to-vtt" className="font-medium underline underline-offset-4 hover:text-foreground/70">SRT to VTT converter</Link>.
        </div>
      </section>

      <section className="pb-12 border-t pt-10">
        <h2 className="text-2xl font-bold mb-6">How to Convert VTT to SRT in 3 Steps</h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {["Upload your .vtt file by dragging it into the converter above.", "The file is parsed locally in your browser. WebVTT headers and cue settings are removed, timestamps are reformatted.", "Preview the before/after comparison and download your .srt file."].map((text, i) => (
            <li key={i} className="rounded-lg border bg-card p-5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">{i + 1}</span>
              <p className="text-sm text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">VTT vs SRT — Key Differences</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead><tr className="bg-muted/50"><th className="text-left p-3 font-semibold">Feature</th><th className="text-left p-3 font-semibold">WebVTT</th><th className="text-left p-3 font-semibold">SRT</th></tr></thead>
            <tbody className="divide-y">
              <tr><td className="p-3 font-medium">Header</td><td className="p-3 text-muted-foreground">Requires &quot;WEBVTT&quot; header</td><td className="p-3 text-muted-foreground">No header needed</td></tr>
              <tr><td className="p-3 font-medium">Timestamp format</td><td className="p-3 text-muted-foreground">HH:MM:SS.mmm (dot separator)</td><td className="p-3 text-muted-foreground">HH:MM:SS,mmm (comma separator)</td></tr>
              <tr><td className="p-3 font-medium">Cue settings</td><td className="p-3 text-muted-foreground">position, align, line, size</td><td className="p-3 text-muted-foreground">Not supported</td></tr>
              <tr><td className="p-3 font-medium">Use case</td><td className="p-3 text-muted-foreground">HTML5 video, web streaming</td><td className="p-3 text-muted-foreground">Universal, desktop players</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          WebVTT is the native subtitle format for HTML5 video elements and is widely used by streaming platforms.
          When converting to SRT, the WEBVTT header is removed, dot-separated milliseconds are converted to comma-separated,
          and cue settings (position, align, line) are stripped since SRT has no equivalent.
        </p>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <Accordion className="w-full">
          <AccordionItem value="what-is-vtt"><AccordionTrigger>What is a WebVTT file?</AccordionTrigger><AccordionContent>WebVTT (Web Video Text Tracks) is a W3C standard subtitle format designed for use with HTML5 video. It supports styling, positioning, and cue settings that SRT does not.</AccordionContent></AccordionItem>
          <AccordionItem value="difference"><AccordionTrigger>What changes during VTT to SRT conversion?</AccordionTrigger><AccordionContent>The WEBVTT header is removed, timestamp separators change from dots to commas, cue settings (position, align) are stripped, and HTML-like styling tags are removed. All dialogue text and timing are preserved.</AccordionContent></AccordionItem>
          <AccordionItem value="privacy"><AccordionTrigger>Is my file uploaded to a server?</AccordionTrigger><AccordionContent>No. All processing happens in your browser using JavaScript. Your file never leaves your device.</AccordionContent></AccordionItem>
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
