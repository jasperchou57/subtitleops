import type { Metadata } from "next";
import Link from "next/link";
import { SrtToAssConverter } from "./converter";
import { VibeBackgroundGlow } from "@/components/ui/vibe-background-glow";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { JsonLd, toolPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Free SRT to ASS Converter Online",
  description:
    "Convert SRT subtitle files to ASS (Advanced SubStation Alpha) format. Add default styling, rewrite timestamps, and export a ready-to-edit ASS file.",
  keywords: ["srt to ass", "convert srt to ass", "srt to ssa", "subtitle to ass"],
  alternates: { canonical: "/tools/srt-to-ass" },
  openGraph: { url: "/tools/srt-to-ass" },
};

const jsonLdData = toolPageJsonLd({
  name: "SRT to ASS Converter",
  description: "Convert SRT subtitle files to ASS format with default styling. Free, browser-based, no upload needed.",
  url: "/tools/srt-to-ass",
  faqs: [
    { question: "Why convert SRT to ASS?", answer: "ASS supports rich styling, precise positioning, karaoke timing, and visual effects that SRT cannot represent. Converting gives you a starting point for adding those features in a subtitle editor like Aegisub." },
    { question: "Does the converter add styling to my subtitles?", answer: "The converter generates a default ASS style (Arial, 48px, white text with black outline). You can customize fonts, colors, positioning, and effects in any ASS-compatible editor after conversion." },
    { question: "Will my subtitle timing change?", answer: "No. The timing is converted from SRT format (HH:MM:SS,mmm) to ASS format (H:MM:SS.cc) but the actual values remain the same." },
    { question: "Can I edit the ASS file in Aegisub after conversion?", answer: "Yes. The output is a valid ASS file with proper Script Info, V4+ Styles, and Events sections. Aegisub will open it directly and let you add styling, positioning, and effects." },
    { question: "Is my file uploaded anywhere?", answer: "No. The SRT to ASS conversion runs entirely in your browser. Your file never leaves your device." },
    { question: "What resolution does the converted ASS file use?", answer: "The default PlayResX is 1920 and PlayResY is 1080 (Full HD). You can change these values in Aegisub or any text editor if your video uses a different resolution." },
  ],
});

const relatedTools = [
  { name: "ASS to SRT", href: "/tools/ass-to-srt", title: "Convert ASS to SRT subtitle format" },
  { name: "VTT to SRT", href: "/tools/vtt-to-srt", title: "Convert VTT to SRT subtitle format" },
  { name: "SRT to VTT", href: "/tools/srt-to-vtt", title: "Convert SRT to VTT subtitle format" },
  { name: "SRT to TXT", href: "/tools/srt-to-txt", title: "Convert SRT to TXT plain text" },
];

export default function SrtToAssPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      {jsonLdData.map((data, i) => <JsonLd key={i} data={data} />)}

      {/* ===== Zone 1: Tool (Hero) ===== */}
      <section className="relative py-10 md:py-14">
        <VibeBackgroundGlow />
        <h1 className="relative text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center">
          Convert SRT to ASS for Styled Subtitles
        </h1>
        <p className="relative mt-3 text-center text-muted-foreground max-w-2xl mx-auto">
          Use this free SRT to ASS converter when you need to add visual styling, positioning, or effects to a plain
          SRT subtitle file. The converter generates a valid ASS file with default styling, proper script metadata,
          and correctly formatted timestamps. Open the result in Aegisub or any ASS editor to start customizing.
        </p>
        <div className="mt-8"><SrtToAssConverter /></div>
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
          <svg className="h-5 w-5 shrink-0 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
          <div className="text-sm">
            <p className="font-medium text-foreground">Don&apos;t lose your styling work</p>
            <p className="text-muted-foreground mt-0.5">
              Need to go back to SRT later?{" "}
              <Link href="/tools/ass-to-srt" title="Convert ASS to SRT subtitle format" className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800">Convert ASS to SRT</Link>.
              Need just the dialogue text?{" "}
              <Link href="/tools/srt-to-txt" title="Convert SRT to TXT plain text" className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800">Extract with SRT to TXT</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Zone 2: Landing Page Content ===== */}
      <section className="pb-12 border-t pt-10">
        <h2 className="text-2xl font-bold mb-6">How to Convert SRT to ASS in 3 Steps</h2>
        <ol className="grid gap-4 md:grid-cols-3 mb-8">
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">1</span>
            <h3 className="font-semibold mb-1">Upload your SRT file</h3>
            <p className="text-sm text-muted-foreground">Drop a standard .srt subtitle file into the converter. This works with files from any transcription tool, editor, or platform.</p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">2</span>
            <h3 className="font-semibold mb-1">Generate the ASS structure</h3>
            <p className="text-sm text-muted-foreground">The converter creates [Script Info], [V4+ Styles], and [Events] sections with default styling. Timestamps are converted from SRT to ASS notation.</p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">3</span>
            <h3 className="font-semibold mb-1">Download and customize in Aegisub</h3>
            <p className="text-sm text-muted-foreground">Save the .ass file and open it in Aegisub or another ASS editor. From there you can add fonts, colors, positioning, karaoke timing, and effects.</p>
          </li>
        </ol>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">What the Converter Generates</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">[Script Info] section:</span>
            Contains metadata including ScriptType v4.00+, PlayRes of 1920x1080, and WrapStyle 0 (smart wrapping). These are sensible defaults for most video projects.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">[V4+ Styles] section:</span>
            A single &ldquo;Default&rdquo; style using Arial 48px, white text with black outline (2px) and shadow (2px), bottom-center alignment. This is the standard starting point for ASS subtitle work.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">[Events] section:</span>
            Each SRT entry becomes a Dialogue line with ASS-formatted timestamps (H:MM:SS.cc instead of HH:MM:SS,mmm). Multi-line SRT text is joined with \N (ASS line break).
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Basic HTML tags stripped:</span>
            SRT supports {`<b>`}, {`<i>`}, {`<u>`} tags. These are removed during conversion because ASS uses its own override tag system ({`{\\b1}`}, {`{\\i1}`}) which you can add in Aegisub.
          </li>
        </ul>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">When to Convert SRT to ASS</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Fansub projects that need visual styling:</span>
            Anime fansubs, karaoke videos, and sign translations all require positioning and effects that SRT cannot provide. Converting to ASS is the first step before adding those visual layers.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Adding speaker identification with colors:</span>
            ASS lets you assign different styles to different speakers using named styles or inline color overrides. Start with the converted default style, then duplicate and customize per speaker.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Precise subtitle positioning:</span>
            When subtitles need to appear at specific screen positions to avoid overlapping signs, logos, or graphics, ASS provides pixel-level control that SRT does not have.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Building karaoke or lyric videos:</span>
            ASS supports syllable-level timing for karaoke effects. The converted file gives you the base timing from SRT, and you can add karaoke tags in Aegisub.
          </li>
        </ul>
      </section>

      {/* ===== Zone 3: FAQ + Related Tools ===== */}
      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <Accordion className="w-full">
          <AccordionItem value="why-convert">
            <AccordionTrigger>Why convert SRT to ASS?</AccordionTrigger>
            <AccordionContent>ASS supports rich styling, precise positioning, karaoke timing, and visual effects that SRT cannot represent. Converting gives you a starting point for adding those features.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="styling">
            <AccordionTrigger>Does the converter add styling to my subtitles?</AccordionTrigger>
            <AccordionContent>The converter generates a default ASS style (Arial, 48px, white text with black outline). You can customize everything in an ASS editor after conversion.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="timing">
            <AccordionTrigger>Will my subtitle timing change?</AccordionTrigger>
            <AccordionContent>No. The timing is converted from SRT format to ASS format but the actual values remain the same.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="aegisub">
            <AccordionTrigger>Can I edit the ASS file in Aegisub?</AccordionTrigger>
            <AccordionContent>Yes. The output is a valid ASS file with proper Script Info, V4+ Styles, and Events sections. Aegisub will open it directly.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="privacy">
            <AccordionTrigger>Is my file uploaded anywhere?</AccordionTrigger>
            <AccordionContent>No. The conversion runs entirely in your browser. Your file never leaves your device.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="resolution">
            <AccordionTrigger>What resolution does the converted ASS file use?</AccordionTrigger>
            <AccordionContent>The default PlayResX is 1920 and PlayResY is 1080 (Full HD). You can change these in Aegisub if your video uses a different resolution.</AccordionContent>
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
