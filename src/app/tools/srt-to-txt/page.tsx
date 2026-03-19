import type { Metadata } from "next";
import Link from "next/link";
import { SrtToTxtConverter } from "./converter";
import { VibeBackgroundGlow } from "@/components/ui/vibe-background-glow";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { JsonLd, toolPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Free SRT to TXT Converter - Extract Text from SRT Subtitles Online",
  description: "Convert SRT to TXT instantly by removing subtitle timing, index numbers, and basic formatting. Extract a clean subtitle transcript for translation, review, or text analysis.",
  keywords: ["srt to txt", "srt to text", "subtitle to text", "subtitle transcript"],
  alternates: { canonical: "/tools/srt-to-txt" },
};

const jsonLdData = toolPageJsonLd({
  name: "SRT to TXT Converter",
  description: "Convert SRT to TXT instantly by removing subtitle timing, index numbers, and basic formatting. Extract a clean subtitle transcript for translation, review, or text analysis.",
  url: "/tools/srt-to-txt",
  faqs: [
    { question: "What gets removed when I convert SRT to TXT?", answer: "The converter strips subtitle cue numbers, timestamp lines, separator syntax, and basic formatting tags so only readable text remains." },
    { question: "Does the tool remove SDH annotations like [music] automatically?", answer: "Not by default. If those annotations matter, you can keep them. If you want them removed, use a cleaning step before extracting text." },
    { question: "Can I use the output as a subtitle transcript?", answer: "Yes. That is one of the main reasons people use this page. The output is designed to be readable outside a subtitle player." },
    { question: "Does this work for non-English subtitles?", answer: "Yes. The SRT to TXT flow preserves UTF-8 text, so it works with multilingual subtitle content." },
    { question: "Is the subtitle file uploaded anywhere?", answer: "No. The extraction runs locally in the browser, and your file stays on your device." },
    { question: "Can I use the output for language learning?", answer: "Yes. Language learners often extract dialogue from foreign-language subtitle files to build vocabulary lists, study sentence patterns, and create study materials without timestamp distractions." },
    { question: "Can I use the output for translation or review?", answer: "Yes. That is one of the strongest reasons to convert subtitle files into plain text. Once the timing layer is removed, the dialogue becomes easier to read, annotate, translate, and process in tools that are not designed for subtitle syntax." },
  ],
});

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
      {jsonLdData.map((data, i) => <JsonLd key={i} data={data} />)}

      {/* ===== Zone 1: Tool (Hero) ===== */}
      <section className="relative py-10 md:py-14">
        <VibeBackgroundGlow />
        <h1 className="relative text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center">
          SRT to TXT - Extract Text from SRT Subtitles
        </h1>
        <p className="relative mt-3 text-center text-muted-foreground max-w-2xl mx-auto">
          Use this free SRT to TXT converter to pull readable text out of subtitle files.
          The tool removes timestamps, cue numbers, and basic subtitle markup so you get a clean plain text output
          that works as a subtitle transcript, translation input, review document, or text-analysis source.
        </p>
        <div className="mt-8"><SrtToTxtConverter /></div>
        <div className="mt-6 rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Need to turn transcript text back into timed subtitles later?</span>{" "}
          Use the{" "}
          <Link href="/tools/txt-to-srt" className="font-medium underline underline-offset-4 hover:text-foreground/70">TXT to SRT</Link>{" "}
          page to rebuild subtitle structure from plain text.
        </div>
      </section>

      {/* ===== Zone 2: Landing Page Content ===== */}
      <section className="pb-12 border-t pt-10">
        <h2 className="text-2xl font-bold mb-6">How to Convert SRT to TXT in 3 Steps</h2>
        <ol className="grid gap-4 md:grid-cols-3 mb-8">
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">1</span>
            <h3 className="font-semibold mb-1">Upload Your SRT File</h3>
            <p className="text-sm text-muted-foreground">
              Add the subtitle file you want to clean. The converter reads standard SRT structure directly in the browser.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">2</span>
            <h3 className="font-semibold mb-1">Strip Subtitle Structure and Keep the Text</h3>
            <p className="text-sm text-muted-foreground">
              The tool removes cue numbers, timestamp lines, separator syntax, and basic formatting tags so the dialogue becomes readable plain text.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">3</span>
            <h3 className="font-semibold mb-1">Download the TXT Output</h3>
            <p className="text-sm text-muted-foreground">
              Save the cleaned text as a .txt file that you can open, search, translate, review, or process further.
            </p>
          </li>
        </ol>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">What Gets Removed During SRT to TXT Extraction</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          SRT files are built for playback, not reading. That is why this page focuses on text extraction rather than subtitle compatibility.
        </p>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Index numbers are removed:</span>
            Subtitle cue numbers are useful for subtitle players and editors, but they add noise to transcript-style reading. Removing them lets you focus on the actual dialogue when reviewing a subtitle transcript.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Timestamp lines disappear:</span>
            The 00:00:00,000 --&gt; 00:00:03,000 layer is essential for video playback and unnecessary for plain text output. Without timestamps the file size drops and the text becomes easy to scan or paste into other tools.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Basic markup is stripped:</span>
            If the subtitle file includes simple formatting tags such as bold or italic, the output removes them to keep the result clean. This ensures the subtitle to text conversion produces a universally compatible plain text file.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Multi-line blocks are joined:</span>
            Screen-optimized line breaks do not always make sense in transcript form. The converter joins them into cleaner text output. The result reads more like a continuous document than a series of fragmented caption blocks.
          </li>
        </ul>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">When SRT to TXT Is Useful</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Building a subtitle transcript:</span>
            If you want the spoken content as text instead of timed captions, this is the fastest route. Many content creators convert their subtitle files to generate a readable transcript they can publish alongside a video or podcast episode.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Translation workflows:</span>
            Some translation workflows are easier in plain text first, especially when you want to remove timing noise before moving into the next tool. Translators can work through the dialogue line by line without being distracted by timestamp formatting.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Review and compliance reading:</span>
            Editors and reviewers often want to scan dialogue without watching the full video. Plain text is easier to search and annotate. Compliance teams also use the subtitle to text output to check scripts against brand guidelines or regulatory standards.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">NLP and text analysis:</span>
            Subtitle text can be useful for word frequency, topic analysis, sentiment experiments, vocabulary extraction, and other language workflows once the timing syntax is removed. Researchers regularly feed cleaned subtitle transcripts into analysis pipelines to study dialogue patterns across large media collections.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Language learning:</span>
            Extracting dialogue from foreign-language subtitles to build vocabulary lists and study materials. Learners can read through the full conversation at their own pace and highlight unfamiliar words without the visual clutter of timestamps.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Building transcript documents for people who do not want subtitle formatting:</span>
            Not everyone reading subtitle content wants to see timestamps every few seconds. Teachers, editors, legal reviewers, translators, and researchers often want the dialogue in a simpler reading form. That is where subtitle to text extraction becomes much more useful than keeping the original subtitle container.
          </li>
        </ul>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">SRT to TXT vs SRT Cleaner</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          These are not the same job. SRT to TXT extracts text only. It removes the subtitle container entirely and gives you a plain text file.{" "}
          <Link href="/tools/srt-cleaner" className="font-medium underline underline-offset-4 hover:text-foreground/70">SRT Cleaner</Link>{" "}
          is different because it keeps the SRT format while removing things like SDH annotations or formatting artifacts.
          If you still need timestamps, use SRT Cleaner. If you need readable text, use SRT to TXT.
          Think of it this way: SRT Cleaner tidies a subtitle file so it plays back better, while the subtitle to text converter produces a subtitle transcript that stands on its own as a readable document.
          Choosing the right tool depends on the next step in your workflow. If the next step requires timed captions for playback, SRT Cleaner keeps the subtitle structure while removing noise. If the next step is reading, translating, or analyzing the spoken content as plain text, use SRT to TXT.
        </p>
      </section>

      {/* ===== Zone 3: FAQ + Related Tools ===== */}
      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <Accordion className="w-full">
          <AccordionItem value="what-removed">
            <AccordionTrigger>What gets removed when I convert SRT to TXT?</AccordionTrigger>
            <AccordionContent>
              The converter strips subtitle cue numbers, timestamp lines, separator syntax, and basic formatting tags so only readable text remains.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="sdh">
            <AccordionTrigger>Does the tool remove SDH annotations like [music] automatically?</AccordionTrigger>
            <AccordionContent>
              Not by default. If those annotations matter, you can keep them. If you want them removed, use a cleaning step before extracting text.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="transcript">
            <AccordionTrigger>Can I use the output as a subtitle transcript?</AccordionTrigger>
            <AccordionContent>
              Yes. That is one of the main reasons people use this page. The output is designed to be readable outside a subtitle player.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="languages">
            <AccordionTrigger>Does this work for non-English subtitles?</AccordionTrigger>
            <AccordionContent>
              Yes. The SRT to TXT flow preserves UTF-8 text, so it works with multilingual subtitle content.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="privacy">
            <AccordionTrigger>Is the subtitle file uploaded anywhere?</AccordionTrigger>
            <AccordionContent>
              No. The extraction runs locally in the browser, and your file stays on your device.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="language-learning">
            <AccordionTrigger>Can I use the output for language learning?</AccordionTrigger>
            <AccordionContent>
              Yes. Language learners often extract dialogue from foreign-language subtitle files to build vocabulary lists, study sentence patterns, and create study materials without timestamp distractions.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="translation-review">
            <AccordionTrigger>Can I use the output for translation or review?</AccordionTrigger>
            <AccordionContent>
              Yes. That is one of the strongest reasons to convert subtitle files into plain text. Once the timing layer is removed, the dialogue becomes easier to read, annotate, translate, and process in tools that are not designed for subtitle syntax.
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
