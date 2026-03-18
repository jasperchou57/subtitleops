import type { Metadata } from "next";
import Link from "next/link";
import { SrtToTxtConverter } from "./converter";
import { VibeBackgroundGlow } from "@/components/ui/vibe-background-glow";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Free SRT to TXT Converter — Extract Text from Subtitles",
  description: "Extract plain text from SRT subtitle files. Strips timestamps and formatting, keeps only the dialogue. Perfect for creating transcripts.",
  keywords: ["srt to txt", "srt to text", "extract text from srt", "subtitle to text", "srt to plain text", "subtitle transcript"],
  alternates: { canonical: "/tools/srt-to-txt" },
};

const relatedTools = [
  { name: "TXT to SRT", href: "/tools/txt-to-srt" },
  { name: "ASS to SRT", href: "/tools/ass-to-srt" },
  { name: "VTT to SRT", href: "/tools/vtt-to-srt" },
  { name: "SRT to VTT", href: "/tools/srt-to-vtt" },
  { name: "SRT Cleaner", href: "/tools/srt-cleaner" },
];

export default function SrtToTxtPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <section className="relative py-10 md:py-14">
        <VibeBackgroundGlow />
        <h1 className="relative text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center">
          Extract Text from SRT Subtitles
        </h1>
        <p className="relative mt-3 text-center text-muted-foreground max-w-2xl mx-auto">
          Strip all timestamps, index numbers, and formatting from SRT files. Get clean, readable
          plain text — perfect for transcripts, translations, or text analysis.
        </p>
        <div className="mt-8"><SrtToTxtConverter /></div>
        <div className="mt-6 rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Have plain text and need subtitles?</span>{" "}
          Use our{" "}
          <Link href="/tools/txt-to-srt" className="font-medium underline underline-offset-4 hover:text-foreground/70">TXT to SRT converter</Link>{" "}
          to generate timestamps automatically.
        </div>
      </section>

      <section className="pb-12 border-t pt-10">
        <h2 className="text-2xl font-bold mb-4">Use Cases for SRT to Text Extraction</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-2"><span className="font-medium text-foreground shrink-0">Transcripts:</span> Create readable transcripts from movie or TV show subtitles for study, review, or accessibility.</li>
          <li className="flex gap-2"><span className="font-medium text-foreground shrink-0">Translation:</span> Extract dialogue text to feed into translation tools without timestamp noise.</li>
          <li className="flex gap-2"><span className="font-medium text-foreground shrink-0">Text analysis:</span> Analyze subtitle text for word frequency, sentiment analysis, or linguistic research.</li>
          <li className="flex gap-2"><span className="font-medium text-foreground shrink-0">Content review:</span> Quickly scan dialogue content without the distraction of timing codes.</li>
        </ul>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <Accordion className="w-full">
          <AccordionItem value="what-removed"><AccordionTrigger>What gets removed during extraction?</AccordionTrigger><AccordionContent>All SRT-specific data is stripped: subtitle index numbers (1, 2, 3...), timestamp lines (00:00:01,000 --&gt; 00:00:04,000), and basic HTML formatting tags. Only the pure dialogue text remains.</AccordionContent></AccordionItem>
          <AccordionItem value="line-breaks"><AccordionTrigger>Are line breaks preserved?</AccordionTrigger><AccordionContent>Each subtitle entry&apos;s text becomes one line in the output. Multi-line subtitle entries within a single cue are joined. The result is one continuous line of text per subtitle entry.</AccordionContent></AccordionItem>
          <AccordionItem value="sdh"><AccordionTrigger>Does it remove SDH annotations like [music]?</AccordionTrigger><AccordionContent>The basic extractor preserves all text content including SDH annotations. For removing [music], [applause] and other sound descriptions, use our SRT Cleaner tool (coming soon).</AccordionContent></AccordionItem>
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
