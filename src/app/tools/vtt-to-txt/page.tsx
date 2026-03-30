import type { Metadata } from "next";
import Link from "next/link";
import { VttToTxtConverter } from "./converter";
import { VibeBackgroundGlow } from "@/components/ui/vibe-background-glow";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { JsonLd, toolPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Free VTT to TXT Converter Online",
  description:
    "Extract plain text from WebVTT caption files. Remove timestamps, headers, and cue settings to get a clean transcript for translation, review, or analysis.",
  keywords: ["vtt to txt", "vtt to text", "extract text from vtt", "webvtt to text", "webvtt transcript"],
  alternates: { canonical: "/tools/vtt-to-txt" },
  openGraph: { url: "/tools/vtt-to-txt" },
};

const jsonLdData = toolPageJsonLd({
  name: "VTT to TXT Converter",
  description: "Extract plain text from WebVTT caption files. Free, browser-based, no upload needed.",
  url: "/tools/vtt-to-txt",
  faqs: [
    { question: "What gets removed when converting VTT to TXT?", answer: "The converter strips the WEBVTT header, all timestamps, cue identifiers, cue settings (position, alignment, size), NOTE blocks, and HTML-like tags (<v>, <c>, <b>, <i>). Only the visible caption text remains." },
    { question: "Why extract text from a VTT file?", answer: "Common reasons include creating transcripts for translation, building study materials from lecture captions, running text analysis on spoken content, and producing review documents without timestamp noise." },
    { question: "Does this work with YouTube VTT exports?", answer: "Yes. If you download captions from a web platform as .vtt files, this converter will extract the text cleanly regardless of which platform generated the file." },
    { question: "Can I turn the text back into subtitles later?", answer: "Yes. Use the TXT to SRT tool to generate a new subtitle draft with auto-generated timestamps from the extracted text." },
    { question: "Is my file uploaded anywhere?", answer: "No. The VTT to TXT extraction runs entirely in your browser. Your file never leaves your device." },
    { question: "Does the converter handle speaker labels in VTT?", answer: "VTT voice tags like <v Speaker Name> are stripped during conversion. The spoken text is kept but the speaker attribution markup is removed since plain text has no way to represent it structurally." },
  ],
});

const relatedTools = [
  { name: "SRT to TXT", href: "/tools/srt-to-txt", title: "Convert SRT to TXT plain text" },
  { name: "VTT to SRT", href: "/tools/vtt-to-srt", title: "Convert VTT to SRT subtitle format" },
  { name: "TXT to SRT", href: "/tools/txt-to-srt", title: "Convert TXT to SRT subtitle format" },
  { name: "SRT to VTT", href: "/tools/srt-to-vtt", title: "Convert SRT to VTT subtitle format" },
];

export default function VttToTxtPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      {jsonLdData.map((data, i) => <JsonLd key={i} data={data} />)}

      {/* ===== Zone 1: Tool (Hero) ===== */}
      <section className="relative py-10 md:py-14">
        <VibeBackgroundGlow />
        <h1 className="relative text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center">
          VTT to TXT — Extract Text from WebVTT Captions
        </h1>
        <p className="relative mt-3 text-center text-muted-foreground max-w-2xl mx-auto">
          Use this free VTT to TXT converter to pull clean, readable text out of WebVTT caption files. The tool
          strips the WEBVTT header, timestamps, cue settings, voice tags, and formatting markup so you get a
          plain text output ready for translation, review, text analysis, or study material creation.
        </p>
        <div className="mt-8"><VttToTxtConverter /></div>
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
          <svg className="h-5 w-5 shrink-0 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
          <div className="text-sm">
            <p className="font-medium text-foreground">Don&apos;t lose the subtitle structure</p>
            <p className="text-muted-foreground mt-0.5">
              Need timed subtitles instead of plain text?{" "}
              <Link href="/tools/vtt-to-srt" title="Convert VTT to SRT subtitle format" className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800">Convert VTT to SRT</Link>.
              Need to rebuild subtitles from this text later?{" "}
              <Link href="/tools/txt-to-srt" title="Convert TXT to SRT subtitle format" className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800">Use TXT to SRT</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Zone 2: Landing Page Content ===== */}
      <section className="pb-12 border-t pt-10">
        <h2 className="text-2xl font-bold mb-6">How to Extract Text from VTT in 3 Steps</h2>
        <ol className="grid gap-4 md:grid-cols-3 mb-8">
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">1</span>
            <h3 className="font-semibold mb-1">Upload your VTT caption file</h3>
            <p className="text-sm text-muted-foreground">Drop a .vtt file from any source — course platforms, YouTube, streaming services, or browser-based video tools.</p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">2</span>
            <h3 className="font-semibold mb-1">Strip all caption metadata</h3>
            <p className="text-sm text-muted-foreground">The converter removes the WEBVTT header, timestamps, cue settings, voice tags, and formatting to isolate the spoken text.</p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">3</span>
            <h3 className="font-semibold mb-1">Download the plain text transcript</h3>
            <p className="text-sm text-muted-foreground">Save the .txt file for translation, review, text analysis, or any workflow where you need the spoken content without subtitle syntax.</p>
          </li>
        </ol>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">What Gets Removed During VTT to TXT Extraction</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">WEBVTT header:</span>
            The required header line and any metadata fields (Kind, Language) that follow it are removed entirely.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Timestamp lines:</span>
            All timing information including start time, end time, and the arrow separator are stripped. The text output has no timing references.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Cue settings:</span>
            WebVTT cue settings like position, size, alignment, and line placement are removed because plain text has no layout model.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Voice and class tags:</span>
            Tags like {`<v Speaker>`} for voice identification and {`<c.classname>`} for CSS styling are stripped. Only the visible spoken text remains.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">NOTE blocks:</span>
            WebVTT comment blocks (NOTE followed by text) are editorial metadata and are removed from the text output.
          </li>
        </ul>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Common Use Cases for VTT to TXT</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Creating transcripts from course captions:</span>
            Online learning platforms (Coursera, Udemy, edX) often provide captions as VTT files. Extracting the text gives students a study document they can annotate, search, and review offline.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Preparing text for translation:</span>
            Translators work with clean text, not subtitle syntax. Extracting dialogue from VTT produces a document that can go directly into translation tools or CAT software.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Running text analysis or NLP processing:</span>
            Researchers and content teams sometimes need to analyze the spoken content of videos. Stripping VTT to plain text removes the structural noise that would interfere with word frequency analysis, sentiment analysis, or keyword extraction.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Building accessible content archives:</span>
            Plain text transcripts are the most accessible format for screen readers, search indexing, and long-term archiving. Converting VTT to TXT creates a permanent text record of the spoken content.
          </li>
        </ul>
      </section>

      {/* ===== Zone 3: FAQ + Related Tools ===== */}
      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <Accordion className="w-full">
          <AccordionItem value="what-removed">
            <AccordionTrigger>What gets removed when converting VTT to TXT?</AccordionTrigger>
            <AccordionContent>The converter strips the WEBVTT header, all timestamps, cue identifiers, cue settings, NOTE blocks, and HTML-like tags. Only the visible caption text remains.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="why-extract">
            <AccordionTrigger>Why extract text from a VTT file?</AccordionTrigger>
            <AccordionContent>Common reasons include creating transcripts for translation, building study materials, running text analysis, and producing review documents without timestamp noise.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="youtube">
            <AccordionTrigger>Does this work with YouTube VTT exports?</AccordionTrigger>
            <AccordionContent>Yes. The converter handles VTT files from any platform including YouTube, Coursera, Udemy, and custom web players.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="rebuild">
            <AccordionTrigger>Can I turn the text back into subtitles later?</AccordionTrigger>
            <AccordionContent>Yes. Use the TXT to SRT tool to generate a new subtitle draft with auto-generated timestamps from the extracted text.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="privacy">
            <AccordionTrigger>Is my file uploaded anywhere?</AccordionTrigger>
            <AccordionContent>No. The VTT to TXT extraction runs entirely in your browser. Your file never leaves your device.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="speaker-labels">
            <AccordionTrigger>Does the converter handle speaker labels in VTT?</AccordionTrigger>
            <AccordionContent>VTT voice tags are stripped during conversion. The spoken text is kept but speaker attribution markup is removed since plain text cannot represent it structurally.</AccordionContent>
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
