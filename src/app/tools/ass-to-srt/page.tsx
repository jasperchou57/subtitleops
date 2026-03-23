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
    "Convert ASS or SSA subtitle files to SRT in your browser. Keep dialogue and timing, remove styling tags, export a clean SubRip file.",
  keywords: [
    "ass to srt",
    "convert ass to srt",
    "ssa to srt",
    "ass subtitle converter",
  ],
  alternates: {
    canonical: "/tools/ass-to-srt",
  },
  openGraph: { url: "/tools/ass-to-srt" },
};

const relatedTools = [
  { name: "VTT to SRT", href: "/tools/vtt-to-srt", title: "Convert VTT to SRT subtitle format" },
  { name: "TXT to SRT", href: "/tools/txt-to-srt", title: "Convert TXT to SRT subtitle format" },
  { name: "SRT to VTT", href: "/tools/srt-to-vtt", title: "Convert SRT to VTT subtitle format" },
  { name: "SRT to TXT", href: "/tools/srt-to-txt", title: "Convert SRT to TXT plain text" },
];

const jsonLdData = toolPageJsonLd({
  name: "ASS to SRT Converter",
  description: "Convert ASS/SSA subtitle files to SRT format. Free, browser-based, no upload needed.",
  url: "/tools/ass-to-srt",
  faqs: [
    { question: "What is an ASS subtitle file?", answer: "ASS stands for Advanced SubStation Alpha. It is a subtitle format known for rich styling, precise positioning, karaoke timing, and other visual controls that go far beyond standard subtitle formats." },
    { question: "Does this converter also support SSA files?", answer: "Yes. SSA is the older SubStation Alpha variant. If the file follows the same subtitle-event structure, it can be converted with this tool as well." },
    { question: "Does ASS to SRT conversion preserve styling?", answer: "No. SRT is a much simpler format. The converter keeps text and timing, but styling instructions specific to ASS are removed." },
    { question: "Will the timing stay accurate after conversion?", answer: "Yes. The purpose of the conversion is to preserve subtitle timing while rewriting the file into SRT syntax." },
    { question: "Is my subtitle file uploaded anywhere?", answer: "No. The ASS to SRT conversion runs in your browser. Your file is not uploaded to a remote server." },
    { question: "Can I convert ASS to SRT on my phone?", answer: "Yes. Because the converter runs entirely in the browser, it works on any device with a modern browser, including phones and tablets. No app installation is required." },
    { question: "When should I keep ASS instead of converting to SRT?", answer: "Keep ASS when the visual layer is essential to the viewing experience. If subtitle placement, karaoke timing, signs, or animations carry meaning, ASS should remain the master version and SRT should only be used as a compatibility copy." },
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
          Use this free online ASS to SRT converter to turn Advanced SubStation Alpha subtitle files
          into clean, widely compatible SRT output. The converter also handles SSA to SRT conversion
          for older SubStation Alpha files. It preserves dialogue text and timing while removing
          ASS-only styling such as fonts, colors, positioning, karaoke tags, and animation cues.
          Everything runs in your browser, so your subtitle file never leaves your device.
        </p>

        <div className="mt-8">
          <AssToSrtConverter />
        </div>

        {/* Workflow suggestion */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
          <svg className="h-5 w-5 shrink-0 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
          <div className="text-sm">
            <p className="font-medium text-foreground">Don&apos;t leave timing errors unfixed</p>
            <p className="text-muted-foreground mt-0.5">
              Need clean text for translation?{" "}
              <Link href="/tools/srt-to-txt" title="Convert SRT to TXT plain text" className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800">Extract text with SRT to TXT</Link>.
              Need browser-ready captions?{" "}
              <Link href="/tools/srt-to-vtt" title="Convert SRT to VTT subtitle format" className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800">Convert to VTT</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Zone 2: Landing Page Content (SEO) ===== */}
      <section className="pb-12 border-t pt-10">
        <h2 className="text-2xl font-bold mb-6">
          How to Convert ASS to SRT in 3 Steps
        </h2>
        <ol className="grid gap-4 md:grid-cols-3 mb-8">
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">
              1
            </span>
            <h3 className="font-semibold mb-1">Upload your ASS or SSA file</h3>
            <p className="text-sm text-muted-foreground">
              Drop a .ass or .ssa file into the converter or browse from your device. This works
              with subtitle files created in Aegisub and with older SubStation Alpha variants that
              still use the same event-based subtitle structure.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">
              2
            </span>
            <h3 className="font-semibold mb-1">Let the converter strip styling and reformat timing</h3>
            <p className="text-sm text-muted-foreground">
              During the conversion, the tool keeps the dialogue layer and discards what SRT cannot
              represent. That includes style definitions, positioning tags, karaoke instructions,
              and other ASS-specific formatting logic.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">
              3
            </span>
            <h3 className="font-semibold mb-1">Preview the clean SRT output and download</h3>
            <p className="text-sm text-muted-foreground">
              Review the converted result before saving it. If your goal is universal playback,
              editor import, or platform upload, the output SRT file is the cleaner and more
              practical delivery format.
            </p>
          </li>
        </ol>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">What Changes During ASS to SRT Conversion</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          ASS is much richer than SRT. That is why this conversion is not just a simple extension swap.
        </p>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Style definitions are removed:</span>
            ASS subtitle files include sections like [Script Info] and [V4+ Styles] that define how
            subtitles should look. SRT has no equivalent for those sections, so they are dropped completely.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Only dialogue events are kept:</span>
            The actual subtitle text lives in the [Events] section. That is the part the converter
            extracts and reformats into SRT cue entries.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Centiseconds become milliseconds:</span>
            ASS timestamps use H:MM:SS.cc, where cc means centiseconds. SRT uses HH:MM:SS,mmm, so
            the converter expands and reformats those values into SRT-compatible timing.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Override tags are stripped:</span>
            Tags such as {"\\fs"}, {"\\c"}, {"\\pos"}, {"\\an"}, {"\\fad"}, {"\\move"}, and karaoke
            timing tags are removed because SRT cannot carry that styling model.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Multi-style tracks collapse:</span>
            ASS can separate signs, dialogue, and speaker styles visually. SRT cannot do that. The
            output becomes a single timeline of subtitle entries ordered by time rather than by style name.
          </li>
        </ul>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">
          ASS vs SRT in Real Workflows
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          ASS is powerful when presentation matters. It is common in anime fansubs, karaoke, and
          projects where subtitle placement, effects, or multiple visual tracks are part of the
          viewing experience. SRT is different. It is the practical format people choose when
          compatibility matters more than styling. If your subtitle file needs to work in desktop
          players, non-specialized mobile players, editing software, or upload flows that reject
          ASS, converting ASS to SRT is the cleanest compromise. You lose visual styling, but you
          gain a format that almost every subtitle workflow understands. That said, there are times
          when you should keep the ASS format. If your target player fully supports ASS rendering,
          such as mpv or VLC with libass, converting to SRT would strip the very styling that
          enhances the viewing experience. For projects where typesetting, sign translations, or
          karaoke effects are essential to the content, staying with ASS is the better choice.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-4">
          It is also worth knowing when not to convert. If your subtitles depend heavily on styling
          for meaning, such as karaoke timing, sign placement, or layered text effects, SRT may be
          too destructive. In those cases the cleaner editorial decision is to keep the ASS master
          file and only create an SRT derivative for the systems that cannot handle the richer format.
        </p>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Common Use Cases for ASS to SRT</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Anime fansubs on unsupported players:</span>
            Many anime subtitle files use ASS because it supports typesetting and karaoke effects.
            When the target player cannot render those features, SRT gives you at least the dialogue
            and timing in a usable format. This is especially common when watching on smart TVs,
            game consoles, or streaming devices that lack full ASS rendering support.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Importing subtitles into editors:</span>
            Editors and post-production tools often handle SRT more reliably than ASS. If the next
            step is Premiere Pro, DaVinci Resolve, or another editing environment, SRT is usually
            the safer intermediate format. Many editors will import SRT natively as a caption track,
            letting you adjust timing on the timeline without manual cleanup.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Uploading subtitles to platforms that expect SRT:</span>
            Many upload flows are built around SRT. If the target platform rejects ASS or ignores
            its styling, converting to SRT avoids manual cleanup. YouTube, Vimeo, and most social
            media platforms accept SRT directly, making it the go-to format for online distribution.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Stripping karaoke and heavy formatting for readability:</span>
            Sometimes the styling is not helping. If you only need the spoken lines without visual
            effects, converting ASS to SRT creates a much cleaner file. This is useful when
            repurposing subtitles as plain transcripts or feeding them into translation workflows
            where formatting tags would interfere with the process.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Creating a simpler working copy for translators or reviewers:</span>
            Some teams do not want to inspect ASS tags or style logic while reviewing subtitle text.
            An SRT version can function as a cleaner review copy even when the styled ASS master
            still exists in the project.
          </li>
        </ul>
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
              ASS stands for Advanced SubStation Alpha. It is a subtitle format known for rich
              styling, precise positioning, karaoke timing, and other visual controls that go far
              beyond standard subtitle formats.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="ssa-support">
            <AccordionTrigger>Does this converter also support SSA files?</AccordionTrigger>
            <AccordionContent>
              Yes. SSA is the older SubStation Alpha variant. If the file follows the same
              subtitle-event structure, it can be converted with this tool as well.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="styling">
            <AccordionTrigger>Does ASS to SRT conversion preserve styling?</AccordionTrigger>
            <AccordionContent>
              No. SRT is a much simpler format. The converter keeps text and timing, but styling
              instructions specific to ASS are removed.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="timing">
            <AccordionTrigger>Will the timing stay accurate after conversion?</AccordionTrigger>
            <AccordionContent>
              Yes. The purpose of the conversion is to preserve subtitle timing while rewriting the
              file into SRT syntax.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="privacy">
            <AccordionTrigger>Is my subtitle file uploaded anywhere?</AccordionTrigger>
            <AccordionContent>
              No. The ASS to SRT conversion runs in your browser. Your file is not uploaded to a
              remote server.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="mobile">
            <AccordionTrigger>Can I convert ASS to SRT on my phone?</AccordionTrigger>
            <AccordionContent>
              Yes. Because the converter runs entirely in the browser, it works on any device with a
              modern browser, including phones and tablets. No app installation is required.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="keep-ass">
            <AccordionTrigger>When should I keep ASS instead of converting to SRT?</AccordionTrigger>
            <AccordionContent>
              Keep ASS when the visual layer is essential to the viewing experience. If subtitle
              placement, karaoke timing, signs, or animations carry meaning, ASS should remain the
              master version and SRT should only be used as a compatibility copy.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Related Tools */}
      <section className="pb-16">
        <h2 className="text-lg font-semibold mb-4">Related Subtitle Tools</h2>
        <div className="flex flex-wrap gap-2">
          {relatedTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              title={tool.title}
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
