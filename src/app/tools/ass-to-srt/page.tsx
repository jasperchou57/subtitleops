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
    { question: "What is an ASS subtitle file?", answer: "ASS (Advanced SubStation Alpha) is a subtitle format used in anime fansubs and karaoke, supporting rich styling like fonts, colors, and positioning." },
    { question: "Is this tool free?", answer: "Yes, 100% free with no file size limits. Processing happens in your browser — files never leave your device." },
    { question: "Does conversion preserve styling?", answer: "SRT has limited styling support. ASS-specific tags like fonts, colors, and positioning are stripped. Text and timing are fully preserved." },
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
          Drop your .ass or .ssa file below. Timing preserved, styling tags stripped automatically.
          100% browser-based — your file never leaves your device.
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
          — adjust timestamps by milliseconds.
        </div>
      </section>

      {/* ===== Zone 2: Landing Page Content (SEO) ===== */}
      <section className="pb-12 border-t pt-10">
        <h2 className="text-2xl font-bold mb-6">
          How to Convert ASS to SRT in 3 Steps
        </h2>
        <ol className="grid gap-4 md:grid-cols-3">
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold mb-3">
              1
            </span>
            <h3 className="font-semibold mb-1">Upload ASS File</h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop your .ass or .ssa file into the converter above, or click to browse.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold mb-3">
              2
            </span>
            <h3 className="font-semibold mb-1">Instant Conversion</h3>
            <p className="text-sm text-muted-foreground">
              The file is processed locally in your browser. Dialogue timing is preserved while ASS-specific styling tags are stripped.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold mb-3">
              3
            </span>
            <h3 className="font-semibold mb-1">Preview & Download</h3>
            <p className="text-sm text-muted-foreground">
              Review the before/after comparison and download your clean .srt file with one click.
            </p>
          </li>
        </ol>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">
          ASS vs SRT — What&apos;s the Difference?
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
                <td className="p-3 text-muted-foreground">Rich styling: fonts, colors, positioning, animations ({"\\fs"}, {"\\c"}, {"\\pos"})</td>
                <td className="p-3 text-muted-foreground">Basic: bold, italic, underline only</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Compatibility</td>
                <td className="p-3 text-muted-foreground">VLC, MPC-HC, mpv, Aegisub</td>
                <td className="p-3 text-muted-foreground">Almost all video players and platforms</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">File Size</td>
                <td className="p-3 text-muted-foreground">Larger (includes style definitions)</td>
                <td className="p-3 text-muted-foreground">Smaller (plain text with timestamps)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Common Use</td>
                <td className="p-3 text-muted-foreground">Anime fansubs, styled karaoke subtitles</td>
                <td className="p-3 text-muted-foreground">Universal subtitle format, streaming platforms</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          When converting ASS to SRT, styling information like custom fonts, colors, and subtitle positioning
          ({"\\fs"}, {"\\c&H..."}, {"\\pos(x,y)"} tags) is stripped because SRT does not support these features.
          The dialogue text and timing are fully preserved. If you need to keep italic or bold formatting,
          consider converting to WebVTT format instead using our{" "}
          <Link href="/tools/srt-to-vtt" className="font-medium underline underline-offset-4 hover:text-foreground/70">
            SRT to VTT converter
          </Link>.
        </p>
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
              ASS (Advanced SubStation Alpha) is a subtitle format widely used in anime fansubs and karaoke.
              It supports rich styling including custom fonts, colors, positioning, and animation effects.
              The format originated from the SubStation Alpha (.ssa) format and is commonly created with
              tools like Aegisub.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="batch">
            <AccordionTrigger>Can I batch convert multiple ASS files?</AccordionTrigger>
            <AccordionContent>
              Currently the free version supports one file at a time. Batch conversion for multiple files
              will be available in our premium plan. Each file is processed entirely in your browser for
              maximum privacy.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="free">
            <AccordionTrigger>Is this tool completely free?</AccordionTrigger>
            <AccordionContent>
              Yes, the ASS to SRT converter is 100% free with no limitations on file size or number of
              conversions. Your files are processed locally in your browser and never uploaded to any server.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="styling">
            <AccordionTrigger>Does the conversion preserve subtitle styling?</AccordionTrigger>
            <AccordionContent>
              SRT format has very limited styling support compared to ASS. During conversion, ASS-specific
              styling tags like {"\\fs24"}, {"\\c&H0000FF&"}, and {"\\pos(320,50)"} are stripped. The dialogue
              text and all timing information are fully preserved. Basic formatting like {"\\i1"} (italic) is
              converted to SRT-compatible HTML tags where possible.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="privacy">
            <AccordionTrigger>Is my subtitle file safe?</AccordionTrigger>
            <AccordionContent>
              Absolutely. All processing happens directly in your browser using JavaScript. Your subtitle
              file is never uploaded to any server. We don&apos;t collect, store, or have access to your files
              in any way.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Related Tools */}
      <section className="pb-16">
        <h2 className="text-lg font-semibold mb-4">Related Tools</h2>
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
