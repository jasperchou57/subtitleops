import type { Metadata } from "next";
import Link from "next/link";
import { SubtitleShiftConverter } from "./converter";
import { VibeBackgroundGlow } from "@/components/ui/vibe-background-glow";
import { JsonLd, toolPageJsonLd } from "@/components/seo/json-ld";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Subtitle Timing Shift — Fix Subtitle Delay Online",
  description:
    "Shift subtitle timing forward or backward by any number of seconds. Fix out-of-sync SRT and VTT files in your browser. Free, no upload, decimals supported.",
  keywords: [
    "subtitle timing shift",
    "fix subtitle delay",
    "subtitle sync",
    "srt timing shift",
    "vtt timing shift",
    "subtitle offset",
  ],
  alternates: { canonical: "/tools/subtitle-shift" },
  openGraph: { url: "/tools/subtitle-shift" },
};

const jsonLdData = toolPageJsonLd({
  name: "Subtitle Timing Shift",
  description:
    "Shift SRT or VTT subtitle timing forward or backward by any number of seconds. Free, browser-based, no upload needed.",
  url: "/tools/subtitle-shift",
  faqs: [
    {
      question: "How do I fix subtitles that are out of sync?",
      answer:
        "Drop your SRT or VTT file into the tool, enter how many seconds off the subtitles are, and click shift. Positive values delay the subtitles; negative values pull them earlier. You can use decimals like 2.5 or -1.25 for fractional-second shifts.",
    },
    {
      question: "What is the difference between shifting and FPS conversion?",
      answer:
        "A shift adds or subtracts the same fixed amount to every cue. FPS conversion scales every cue by a ratio. Use a shift when subtitles are off by a constant amount from start to end. Use FPS conversion when subtitles start close to correct but drift further off as the video plays.",
    },
    {
      question: "Does the tool support negative shifts?",
      answer:
        "Yes. Enter a negative number to pull subtitles earlier. If any timestamp would go below zero, it is clamped to 00:00:00 and the tool shows a warning so you know which cues were affected.",
    },
    {
      question: "Which subtitle formats are supported?",
      answer:
        "The first version supports SRT (SubRip) and VTT (WebVTT). Support for ASS is on the roadmap because ASS karaoke and transition tags require additional timing logic.",
    },
    {
      question: "Is my subtitle file uploaded anywhere?",
      answer:
        "No. The timing shift runs entirely in your browser. Your subtitle file never leaves your device.",
    },
    {
      question: "What value should I enter to sync my subtitles?",
      answer:
        "Play the video with the subtitles and note the delay at a specific cue. If the dialogue is spoken at 00:12 but the subtitle shows at 00:14, subtitles are 2 seconds late — enter -2 to pull them earlier. If the subtitle shows at 00:10 but dialogue is at 00:12, subtitles are 2 seconds early — enter +2.",
    },
    {
      question: "Does the tool preserve my original file?",
      answer:
        "Yes. The tool generates a new shifted file and leaves the original untouched. The download is named with the shift amount so you can tell shifted copies apart.",
    },
  ],
});

const relatedTools = [
  { name: "Subtitle FPS Converter", href: "/tools/subtitle-fps-converter", title: "Rescale subtitle timing between frame rates" },
  { name: "SRT to VTT", href: "/tools/srt-to-vtt", title: "Convert SRT to VTT subtitle format" },
  { name: "VTT to SRT", href: "/tools/vtt-to-srt", title: "Convert VTT to SRT subtitle format" },
  { name: "SRT to TXT", href: "/tools/srt-to-txt", title: "Convert SRT to TXT plain text" },
];

export default function SubtitleShiftPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      {jsonLdData.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}

      {/* ===== Zone 1: Tool (Hero) ===== */}
      <section className="relative py-10 md:py-14">
        <VibeBackgroundGlow />
        <h1 className="relative text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center">
          Subtitle Timing Shift
        </h1>
        <p className="relative mt-3 text-center text-muted-foreground max-w-2xl mx-auto">
          Fix out-of-sync subtitles by shifting every cue forward or backward by a fixed number of seconds.
          This free subtitle timing shift tool works on SRT and VTT files directly in your browser — no upload,
          no install, no sign-up. Supports decimals, negative values, and produces a clean shifted copy with the
          original file left untouched.
        </p>

        <div className="mt-8">
          <SubtitleShiftConverter />
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
          <svg className="h-5 w-5 shrink-0 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
          <div className="text-sm">
            <p className="font-medium text-foreground">Subtitles drift further off as the video plays?</p>
            <p className="text-muted-foreground mt-0.5">
              That is a frame-rate mismatch, not a simple shift. Try the{" "}
              <Link
                href="/tools/subtitle-fps-converter"
                title="Rescale subtitle timing between frame rates"
                className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800"
              >
                Subtitle FPS Converter
              </Link>{" "}
              instead.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Zone 2: Landing Page Content ===== */}
      <section className="pb-12 border-t pt-10">
        <h2 className="text-2xl font-bold mb-6">How to Shift Subtitle Timing in 3 Steps</h2>
        <ol className="grid gap-4 md:grid-cols-3 mb-8">
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">1</span>
            <h3 className="font-semibold mb-1">Drop your SRT or VTT file</h3>
            <p className="text-sm text-muted-foreground">
              Start with the subtitle file you need to re-sync. The tool detects SRT and VTT automatically
              by extension and content, and runs the entire shift locally so nothing is uploaded.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">2</span>
            <h3 className="font-semibold mb-1">Enter the shift in seconds</h3>
            <p className="text-sm text-muted-foreground">
              Type the number of seconds you need to move the subtitles. Positive values push cues later,
              negative values pull them earlier. Decimal values are supported, so you can shift by fractional
              amounts like 1.25 seconds.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">3</span>
            <h3 className="font-semibold mb-1">Preview and download</h3>
            <p className="text-sm text-muted-foreground">
              The tool shows a before-and-after preview of the first few cues so you can sanity-check the
              shift. When it looks right, download the shifted SRT or VTT file. The filename includes the
              shift amount so you can tell copies apart.
            </p>
          </li>
        </ol>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">How to Figure Out the Right Shift Value</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          The tool does the timestamp math. The harder question is figuring out how many seconds off the
          subtitles are in the first place. The fastest way is to pick a single line of dialogue near the
          start of the video, note the time at which the character actually speaks it, and compare that to
          the start time the subtitle file assigns to the same line.
        </p>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-48">Subtitles appear too late:</span>
            If dialogue is spoken at 00:12 but the caption appears at 00:14, the subtitles are 2 seconds
            behind the audio. Enter <span className="font-mono">-2</span> to pull them forward.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-48">Subtitles appear too early:</span>
            If the caption shows at 00:10 but dialogue does not start until 00:12, the subtitles are running
            2 seconds ahead. Enter <span className="font-mono">+2</span> to delay them.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-48">Fractional delays:</span>
            Small sync errors are often fractions of a second. Values like <span className="font-mono">0.3</span>{" "}
            or <span className="font-mono">-0.75</span> are fully supported. Enter values with up to
            millisecond precision.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-48">Check at the end too:</span>
            If the shift that fixes the beginning does not also fix the end, the problem is probably not a
            pure shift. The first and last lines should both match after a correct shift — if only the first
            line syncs, the subtitles likely need FPS conversion instead.
          </li>
        </ul>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">When to Use Shift vs FPS Conversion</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Subtitle sync issues have two common causes, and the right fix depends on which one you are dealing
          with. Using the wrong tool will make part of the file look right while another part still drifts.
        </p>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Constant offset:</span>
            The subtitles are off by the same amount from start to finish — for example, consistently
            two seconds late through the whole video. A shift is the correct fix.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Growing drift:</span>
            The subtitles start close to correct but drift further off over time. By the end of a 90-minute
            film, the gap might be several seconds even though the first scene looked fine. That is a frame-rate
            mismatch, not a shift. Use the{" "}
            <Link
              href="/tools/subtitle-fps-converter"
              title="Rescale subtitle timing between frame rates"
              className="font-medium underline underline-offset-4 hover:text-foreground/70"
            >
              Subtitle FPS Converter
            </Link>{" "}
            instead.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Both at once:</span>
            If you have both a constant offset and frame-rate drift, run FPS conversion first to lock the
            pacing, then run a shift to align the absolute start time. Doing it in the other order still
            works but is harder to reason about because the shift value changes after rescaling.
          </li>
        </ul>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Common Use Cases</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Different video cut than the subtitles were timed for:</span>
            Subtitles from one release sometimes carry over to a different cut of the same video with an
            intro or ad break of a different length. A single shift re-aligns the whole file.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Captions from a streaming source pulled into a local video player:</span>
            Streaming platforms sometimes embed a short pre-roll that the local file does not contain. A
            negative shift usually corrects the gap.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Re-encoded video with a slightly different start point:</span>
            Encoding a video with a trimmed opening can push subtitles a few seconds out of sync. A small
            shift, often under one second, restores alignment.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Manual sync to match dubbed audio:</span>
            Dubbed audio is often timed slightly differently from the original. A shift offers quick manual
            control when your dub and subtitles are close but not perfectly aligned.
          </li>
        </ul>
      </section>

      {/* ===== Zone 3: FAQ + Related Tools ===== */}
      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <Accordion className="w-full">
          <AccordionItem value="how">
            <AccordionTrigger>How do I fix subtitles that are out of sync?</AccordionTrigger>
            <AccordionContent>
              Drop your SRT or VTT file into the tool, enter how many seconds off the subtitles are, and
              click shift. Positive values delay the subtitles; negative values pull them earlier. You can
              use decimals like 2.5 or -1.25 for fractional-second shifts.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="shift-vs-fps">
            <AccordionTrigger>What is the difference between shifting and FPS conversion?</AccordionTrigger>
            <AccordionContent>
              A shift adds or subtracts the same fixed amount to every cue. FPS conversion scales every cue
              by a ratio. Use a shift when subtitles are off by a constant amount from start to end. Use
              FPS conversion when subtitles start close to correct but drift further off as the video plays.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="negative">
            <AccordionTrigger>Does the tool support negative shifts?</AccordionTrigger>
            <AccordionContent>
              Yes. Enter a negative number to pull subtitles earlier. If any timestamp would go below zero,
              it is clamped to 00:00:00 and the tool shows a warning so you know which cues were affected.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="formats">
            <AccordionTrigger>Which subtitle formats are supported?</AccordionTrigger>
            <AccordionContent>
              The first version supports SRT (SubRip) and VTT (WebVTT). Support for ASS is on the roadmap
              because ASS karaoke and transition tags require additional timing logic.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="privacy">
            <AccordionTrigger>Is my subtitle file uploaded anywhere?</AccordionTrigger>
            <AccordionContent>
              No. The timing shift runs entirely in your browser. Your subtitle file never leaves your device.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="find-value">
            <AccordionTrigger>What value should I enter to sync my subtitles?</AccordionTrigger>
            <AccordionContent>
              Play the video with the subtitles and note the delay at a specific cue. If the dialogue is
              spoken at 00:12 but the subtitle shows at 00:14, subtitles are 2 seconds late — enter -2 to
              pull them earlier. If the subtitle shows at 00:10 but dialogue is at 00:12, subtitles are
              2 seconds early — enter +2.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="original">
            <AccordionTrigger>Does the tool preserve my original file?</AccordionTrigger>
            <AccordionContent>
              Yes. The tool generates a new shifted file and leaves the original untouched. The download is
              named with the shift amount so you can tell shifted copies apart.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

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
