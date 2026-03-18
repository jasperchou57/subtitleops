import type { Metadata } from "next";
import Link from "next/link";
import { TxtToSrtConverter } from "./converter";
import { VibeBackgroundGlow } from "@/components/ui/vibe-background-glow";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Free TXT to SRT Converter Online",
  description: "Convert plain text files to SRT subtitle format with auto-generated timestamps. Paste or upload your script and get a ready-to-use .srt file instantly.",
  keywords: ["txt to srt", "text to srt", "convert text to srt", "plain text to subtitle", "create srt from text"],
  alternates: { canonical: "/tools/txt-to-srt" },
};

const relatedTools = [
  { name: "ASS to SRT", href: "/tools/ass-to-srt" },
  { name: "VTT to SRT", href: "/tools/vtt-to-srt" },
  { name: "SRT to VTT", href: "/tools/srt-to-vtt" },
  { name: "SRT to TXT", href: "/tools/srt-to-txt" },
  { name: "Subtitle Shifter", href: "/tools/subtitle-shifter" },
];

export default function TxtToSrtPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <section className="relative py-10 md:py-14">
        <VibeBackgroundGlow />
        <h1 className="relative text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center">
          Convert Text to SRT Instantly
        </h1>
        <p className="relative mt-3 text-center text-muted-foreground max-w-2xl mx-auto">
          Turn plain text scripts into properly formatted SRT subtitle files with auto-generated timestamps.
          Each line becomes one subtitle entry with 3-second default duration.
        </p>
        <div className="mt-8"><TxtToSrtConverter /></div>
        <div className="mt-6 rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Need to extract text from subtitles?</span>{" "}
          Try our{" "}
          <Link href="/tools/srt-to-txt" className="font-medium underline underline-offset-4 hover:text-foreground/70">SRT to TXT extractor</Link>.
        </div>
      </section>

      <section className="pb-12 border-t pt-10">
        <h2 className="text-2xl font-bold mb-6">How TXT to SRT Conversion Works</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Unlike other subtitle converters that transform between existing subtitle formats, the TXT to SRT tool
          creates subtitle timing from scratch. Each non-empty line in your text file becomes a separate subtitle entry
          with automatically generated timestamps. The default timing is 3 seconds per line with a 0.5-second gap,
          which you can adjust after conversion using our{" "}
          <Link href="/tools/subtitle-shifter" className="font-medium underline underline-offset-4 hover:text-foreground/70">Subtitle Shifter</Link>.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This is particularly useful when you have a transcript or script and need to quickly generate a subtitle file
          for video editing software. The generated SRT can be imported into Premiere Pro, DaVinci Resolve, Final Cut Pro,
          or any video player that supports subtitles.
        </p>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <Accordion className="w-full">
          <AccordionItem value="timing"><AccordionTrigger>How are the timestamps generated?</AccordionTrigger><AccordionContent>Each line gets 3 seconds of display time with a 0.5-second gap between entries. The first subtitle starts at 00:00:00. You can adjust timing after conversion using our Subtitle Shifter tool.</AccordionContent></AccordionItem>
          <AccordionItem value="multiline"><AccordionTrigger>Can I have multi-line subtitles?</AccordionTrigger><AccordionContent>Currently each line in the text file becomes one subtitle entry. For multi-line subtitles, you would need to edit the generated SRT file manually or use a subtitle editor.</AccordionContent></AccordionItem>
          <AccordionItem value="encoding"><AccordionTrigger>What text encoding is supported?</AccordionTrigger><AccordionContent>The tool supports UTF-8 encoded text files, which covers all major languages including CJK characters, Arabic, Cyrillic, and more.</AccordionContent></AccordionItem>
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
