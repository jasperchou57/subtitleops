import type { Metadata } from "next";
import Link from "next/link";
import { SbvToSrtConverter } from "./converter";
import { VibeBackgroundGlow } from "@/components/ui/vibe-background-glow";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { JsonLd, toolPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Free SBV to SRT Converter Online",
  description:
    "Convert YouTube SBV subtitle files to SRT format in your browser. Rewrite timestamps, add cue numbers, and download a clean SubRip file.",
  keywords: ["sbv to srt", "convert sbv to srt", "youtube subtitle converter", "sbv file converter"],
  alternates: { canonical: "/tools/sbv-to-srt" },
  openGraph: { url: "/tools/sbv-to-srt" },
};

const jsonLdData = toolPageJsonLd({
  name: "SBV to SRT Converter",
  description: "Convert YouTube SBV subtitle files to SRT format. Free, browser-based, no upload needed.",
  url: "/tools/sbv-to-srt",
  faqs: [
    { question: "What is an SBV file?", answer: "SBV is the subtitle format used by YouTube. When you download auto-generated or manually uploaded captions from YouTube Studio, the file is typically exported as .sbv. It stores timestamps and text in a simpler structure than SRT." },
    { question: "Why convert SBV to SRT?", answer: "Because SRT is supported by virtually every video player, editor, and subtitle tool. SBV is mainly useful inside YouTube. Once the file leaves YouTube, SRT is the more practical format for editing, archiving, and re-uploading to other platforms." },
    { question: "What changes during SBV to SRT conversion?", answer: "The converter rewrites timestamps from SBV format (H:MM:SS.mmm,H:MM:SS.mmm) to SRT format (HH:MM:SS,mmm --> HH:MM:SS,mmm), adds sequential cue numbers, and preserves the original subtitle text." },
    { question: "Does the conversion affect subtitle timing?", answer: "No. Timestamps are reformatted but the actual timing values stay the same. Your subtitles will appear at the same moments in the video." },
    { question: "Is my file uploaded anywhere?", answer: "No. The SBV to SRT conversion runs entirely in your browser. Your file never leaves your device." },
    { question: "Can I convert YouTube auto-captions with this tool?", answer: "Yes. YouTube auto-generated captions can be downloaded as SBV files from YouTube Studio. This converter handles those files and produces a clean SRT that you can edit or use in other tools." },
  ],
});

const relatedTools = [
  { name: "ASS to SRT", href: "/tools/ass-to-srt", title: "Convert ASS to SRT subtitle format" },
  { name: "VTT to SRT", href: "/tools/vtt-to-srt", title: "Convert VTT to SRT subtitle format" },
  { name: "SRT to VTT", href: "/tools/srt-to-vtt", title: "Convert SRT to VTT subtitle format" },
  { name: "SRT to TXT", href: "/tools/srt-to-txt", title: "Convert SRT to TXT plain text" },
];

export default function SbvToSrtPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      {jsonLdData.map((data, i) => <JsonLd key={i} data={data} />)}

      {/* ===== Zone 1: Tool (Hero) ===== */}
      <section className="relative py-10 md:py-14">
        <VibeBackgroundGlow />
        <h1 className="relative text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center">
          Convert SBV to SRT — YouTube Subtitles to SRT
        </h1>
        <p className="relative mt-3 text-center text-muted-foreground max-w-2xl mx-auto">
          Use this free SBV to SRT converter to turn YouTube caption files into clean, universally compatible SRT output.
          The converter rewrites SBV timestamps into SRT syntax, adds sequential cue numbers, and preserves the original
          subtitle text. Everything runs in your browser — your file never leaves your device.
        </p>
        <div className="mt-8"><SbvToSrtConverter /></div>
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
          <svg className="h-5 w-5 shrink-0 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
          <div className="text-sm">
            <p className="font-medium text-foreground">Don&apos;t stop at format conversion</p>
            <p className="text-muted-foreground mt-0.5">
              Need browser-ready captions?{" "}
              <Link href="/tools/srt-to-vtt" title="Convert SRT to VTT subtitle format" className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800">Convert SRT to VTT</Link>.
              Need clean text for translation?{" "}
              <Link href="/tools/srt-to-txt" title="Convert SRT to TXT plain text" className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800">Extract with SRT to TXT</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Zone 2: Landing Page Content ===== */}
      <section className="pb-12 border-t pt-10">
        <h2 className="text-2xl font-bold mb-6">How to Convert SBV to SRT in 3 Steps</h2>
        <ol className="grid gap-4 md:grid-cols-3 mb-8">
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">1</span>
            <h3 className="font-semibold mb-1">Download your SBV file from YouTube</h3>
            <p className="text-sm text-muted-foreground">
              In YouTube Studio, go to Subtitles, select a video, click the three-dot menu on a caption track, and choose
              &ldquo;Download&rdquo; to get the .sbv file. This works for both auto-generated and manually uploaded captions.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">2</span>
            <h3 className="font-semibold mb-1">Drop the SBV file into the converter</h3>
            <p className="text-sm text-muted-foreground">
              The tool detects the SBV format automatically, rewrites timestamps from YouTube&apos;s notation to SRT syntax,
              and adds the sequential cue numbers that SRT requires.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">3</span>
            <h3 className="font-semibold mb-1">Download the SRT file</h3>
            <p className="text-sm text-muted-foreground">
              Preview the converted output, verify that timing and text look correct, and save the .srt file for editing,
              archiving, or uploading to another platform.
            </p>
          </li>
        </ol>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">What Changes During SBV to SRT Conversion</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Timestamp format changes:</span>
            SBV uses <code className="bg-muted px-1.5 py-0.5 rounded text-xs">H:MM:SS.mmm,H:MM:SS.mmm</code> with a comma
            between start and end times. SRT uses <code className="bg-muted px-1.5 py-0.5 rounded text-xs">HH:MM:SS,mmm --&gt; HH:MM:SS,mmm</code> with
            an arrow separator and comma before milliseconds. The converter handles this rewrite automatically.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Cue numbers are added:</span>
            SBV files do not use cue numbers. SRT requires a sequential integer before each timestamp line.
            The converter generates these numbers starting at 1.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Text content is preserved:</span>
            The actual subtitle dialogue stays the same. No text is added, removed, or reformatted during conversion.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Hours are zero-padded:</span>
            SBV allows single-digit hours (0:01:23.456). SRT requires two-digit hours (00:01:23,456). The converter
            pads these values automatically.
          </li>
        </ul>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Common Use Cases for SBV to SRT</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Repurposing YouTube captions for other platforms:</span>
            Vimeo, Wistia, and most social media platforms accept SRT but not SBV. Converting before uploading avoids rejection.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Editing YouTube auto-captions in subtitle editors:</span>
            Aegisub, Subtitle Edit, and most editors import SRT natively. Converting SBV first lets you clean up auto-caption
            errors in a proper editing environment.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Archiving subtitle files in a universal format:</span>
            SBV is YouTube-specific. SRT is the most widely supported archive format for subtitles, readable by every major
            player and tool for decades to come.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Creating translated subtitle tracks:</span>
            Download auto-captions as SBV, convert to SRT, translate the text, and upload the translated SRT to YouTube
            or another platform as a new language track.
          </li>
        </ul>
      </section>

      {/* ===== Zone 3: FAQ + Related Tools ===== */}
      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <Accordion className="w-full">
          <AccordionItem value="what-is-sbv">
            <AccordionTrigger>What is an SBV file?</AccordionTrigger>
            <AccordionContent>
              SBV is the subtitle format used by YouTube. When you download auto-generated or manually uploaded captions
              from YouTube Studio, the file is typically exported as .sbv. It stores timestamps and text in a simpler
              structure than SRT.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="why-convert">
            <AccordionTrigger>Why convert SBV to SRT?</AccordionTrigger>
            <AccordionContent>
              Because SRT is supported by virtually every video player, editor, and subtitle tool. SBV is mainly useful
              inside YouTube. Once the file leaves YouTube, SRT is the more practical format.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="what-changes">
            <AccordionTrigger>What changes during SBV to SRT conversion?</AccordionTrigger>
            <AccordionContent>
              The converter rewrites timestamps from SBV format to SRT format, adds sequential cue numbers, and preserves
              the original subtitle text.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="timing">
            <AccordionTrigger>Does the conversion affect subtitle timing?</AccordionTrigger>
            <AccordionContent>No. Timestamps are reformatted but the actual timing values stay the same.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="privacy">
            <AccordionTrigger>Is my file uploaded anywhere?</AccordionTrigger>
            <AccordionContent>No. The SBV to SRT conversion runs entirely in your browser. Your file never leaves your device.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="auto-captions">
            <AccordionTrigger>Can I convert YouTube auto-captions with this tool?</AccordionTrigger>
            <AccordionContent>
              Yes. YouTube auto-generated captions can be downloaded as SBV files from YouTube Studio. This converter
              handles those files and produces a clean SRT that you can edit or use in other tools.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="pb-16">
        <h2 className="text-lg font-semibold mb-4">Related Subtitle Tools</h2>
        <div className="flex flex-wrap gap-2">
          {relatedTools.map((t) => (
            <Link key={t.href} href={t.href} title={t.title} className="inline-flex items-center rounded-lg border bg-card px-4 py-2 text-sm hover:bg-accent transition-colors">
              {t.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
