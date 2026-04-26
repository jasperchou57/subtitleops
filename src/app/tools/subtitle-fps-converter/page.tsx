import type { Metadata } from "next";
import Link from "next/link";
import { SubtitleFpsConverter } from "./converter";
import { VibeBackgroundGlow } from "@/components/ui/vibe-background-glow";
import { JsonLd, toolPageJsonLd } from "@/components/seo/json-ld";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Subtitle FPS Converter — Rescale Subtitle Timing Online",
  description:
    "Convert subtitle timing between frame rates. Rescale SRT and VTT files from 23.976 to 25 fps, 29.97 to 30, or any custom ratio. Free, browser-based, no upload.",
  keywords: [
    "subtitle fps converter",
    "subtitle frame rate converter",
    "subtitle rescale",
    "23.976 to 25 fps subtitles",
    "29.97 to 30 subtitles",
    "srt fps conversion",
  ],
  alternates: { canonical: "/tools/subtitle-fps-converter" },
  openGraph: { url: "/tools/subtitle-fps-converter" },
};

const jsonLdData = toolPageJsonLd({
  name: "Subtitle FPS Converter",
  description:
    "Rescale subtitle timing between frame rates. Fix SRT and VTT files timed for the wrong FPS. Free, browser-based, no upload needed.",
  url: "/tools/subtitle-fps-converter",
  faqs: [
    {
      question: "What does subtitle FPS conversion actually do?",
      answer:
        "It rescales every timestamp in the subtitle file by the ratio of source to target FPS. A file timed for 23.976 fps but played against 25 fps drifts further off as the video progresses. Rescaling re-aligns every cue with the spoken dialogue.",
    },
    {
      question: "How do I know my subtitles need FPS conversion and not a shift?",
      answer:
        "If the subtitles start close to correct but drift further out of sync over time, the problem is frame rate — not a fixed delay. If you can fix the first scene with a shift but the end still drifts, you need FPS conversion.",
    },
    {
      question: "Which FPS values should I pick?",
      answer:
        "Set Source FPS to the frame rate the subtitles were originally timed for, and Target FPS to the frame rate of the video you are now playing. The most common mismatches are 23.976 ↔ 25 (NTSC film vs PAL) and 29.97 ↔ 30.",
    },
    {
      question: "What if my source or target FPS is unusual?",
      answer:
        "Pick Custom from either dropdown and enter the exact value you need. The tool accepts decimals, so non-integer rates like 47.952 or 119.88 work fine.",
    },
    {
      question: "Which subtitle formats are supported?",
      answer:
        "The first version supports SRT (SubRip) and VTT (WebVTT). ASS files are not yet supported because ASS karaoke and transition tags require additional scaling logic.",
    },
    {
      question: "Is my subtitle file uploaded anywhere?",
      answer:
        "No. The FPS conversion runs entirely in your browser. Your file never leaves your device.",
    },
    {
      question: "Do I need to shift subtitles after FPS conversion?",
      answer:
        "Sometimes. If the file is both rescaled for the wrong frame rate and offset by a constant amount, run FPS conversion first to fix the pacing, then use the Subtitle Timing Shift tool to correct the remaining constant offset.",
    },
  ],
});

const relatedTools = [
  { name: "Subtitle Timing Shift", href: "/tools/subtitle-shift", title: "Shift subtitles forward or backward by a fixed offset" },
  { name: "SRT to VTT", href: "/tools/srt-to-vtt", title: "Convert SRT to VTT subtitle format" },
  { name: "VTT to SRT", href: "/tools/vtt-to-srt", title: "Convert VTT to SRT subtitle format" },
  { name: "ASS to SRT", href: "/tools/ass-to-srt", title: "Convert ASS to SRT subtitle format" },
];

export default function SubtitleFpsConverterPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      {jsonLdData.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}

      {/* ===== Zone 1: Tool (Hero) ===== */}
      <section className="relative py-10 md:py-14">
        <VibeBackgroundGlow />
        <h1 className="relative text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center">
          Subtitle FPS Converter
        </h1>
        <p className="relative mt-3 text-center text-muted-foreground max-w-2xl mx-auto">
          Rescale subtitle timing between frame rates in your browser. Use this free subtitle FPS converter
          when SRT or VTT subtitles were timed for one frame rate (for example 23.976) but you are playing
          them against a video at a different frame rate (for example 25). The tool multiplies every timestamp
          by the correct ratio so cues line up with spoken dialogue from start to end.
        </p>

        <div className="mt-8">
          <SubtitleFpsConverter />
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
          <svg className="h-5 w-5 shrink-0 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
          <div className="text-sm">
            <p className="font-medium text-foreground">Subtitles off by a constant amount instead of drifting?</p>
            <p className="text-muted-foreground mt-0.5">
              Use the{" "}
              <Link
                href="/tools/subtitle-shift"
                title="Shift subtitles forward or backward by a fixed offset"
                className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800"
              >
                Subtitle Timing Shift
              </Link>{" "}
              tool instead — FPS conversion is the wrong fix for a uniform delay.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Zone 2: Landing Page Content ===== */}
      <section className="pb-12 border-t pt-10">
        <h2 className="text-2xl font-bold mb-6">How to Convert Subtitle FPS in 3 Steps</h2>
        <ol className="grid gap-4 md:grid-cols-3 mb-8">
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">1</span>
            <h3 className="font-semibold mb-1">Drop your SRT or VTT file</h3>
            <p className="text-sm text-muted-foreground">
              Start with the subtitle file you need to rescale. The tool detects SRT and VTT automatically
              and runs the entire conversion locally so nothing is uploaded.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">2</span>
            <h3 className="font-semibold mb-1">Pick source and target FPS</h3>
            <p className="text-sm text-muted-foreground">
              Source FPS is the frame rate the subtitles were originally timed for. Target FPS is the frame
              rate of the video you are now playing. Common presets cover film, PAL, and NTSC rates; custom
              values are supported for non-standard frame rates.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">3</span>
            <h3 className="font-semibold mb-1">Preview and download</h3>
            <p className="text-sm text-muted-foreground">
              Review the before-and-after preview, then download the rescaled file. The output filename
              records the FPS conversion so you can tell rescaled copies apart from the original.
            </p>
          </li>
        </ol>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Why Frame-Rate Mismatches Happen</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Subtitle timestamps are recorded in wall-clock hours, minutes, seconds, and milliseconds — not in
          frame numbers. But the person who timed them usually worked against a specific video cut. When the
          same subtitle file is played against a version of the video with a different frame rate, every cue
          drifts because the video is playing the dialogue at a slightly different pace.
        </p>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-52">23.976 ↔ 25 (film ↔ PAL):</span>
            Cinema film is typically 23.976 fps. European broadcast (PAL) is 25 fps. Films released on PAL
            are sped up by about 4%, so subtitles timed for the cinema release drift further behind over a
            90-minute film by nearly four minutes if played on a PAL transfer.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-52">29.97 ↔ 30 (NTSC drift):</span>
            True 30 fps and 29.97 fps look identical to the eye but drift apart over long runtimes. The 0.1%
            difference compounds to several seconds over a feature film, which is enough to notice on the
            final act of a long movie.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-52">23.976 ↔ 29.97 (telecine):</span>
            Film-to-NTSC conversions apply 3:2 pulldown. Subtitles timed for the theatrical release often
            need rescaling when paired with an NTSC broadcast or DVD copy.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-52">High frame rate content:</span>
            HFR releases at 48, 50, or 60 fps need corresponding subtitle rescaling if the subtitle file
            comes from a standard-rate master.
          </li>
        </ul>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">How FPS Rescaling Actually Works</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Every timestamp in the subtitle file is multiplied by the ratio of source to target FPS. If the
          source FPS is lower than the target, the ratio is less than one, which pulls cues earlier in the
          timeline. If the source is higher than the target, the ratio is greater than one and cues move
          later. The pattern below shows how a single timestamp moves during a 23.976 → 25 conversion.
        </p>
        <div className="rounded-xl border bg-card p-5 text-sm font-mono text-muted-foreground">
          <p>source_fps = 23.976</p>
          <p>target_fps = 25</p>
          <p>ratio = source_fps / target_fps = 0.95904</p>
          <p className="mt-2">
            original 00:10:00,000 &rarr; rescaled 00:09:35,424
          </p>
          <p>
            original 01:30:00,000 &rarr; rescaled 01:26:18,816
          </p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mt-4">
          Because the tool rescales every cue in one pass, both start and end times of every line stay
          internally consistent. No cue is stretched relative to another — the whole timeline just shifts to
          the new frame rate.
        </p>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Common Use Cases</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Subtitles from a PAL release paired with an NTSC video:</span>
            European DVD rips often ship with 25 fps-timed subtitles that drift when paired with a 23.976
            NTSC source. Convert 25 → 23.976 to realign them.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Cinema subtitle files paired with a broadcast cut:</span>
            A theatrical 23.976 fps subtitle file drifts against a PAL broadcast at 25 fps or an NTSC
            broadcast at 29.97 fps. Pick the appropriate pair to rescale.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Blu-ray remux with subtitles from a DVD:</span>
            DVD subtitles are often authored at 29.97 fps, and Blu-ray remuxes frequently play at 23.976 fps.
            The mismatch is a classic home-theater FPS conversion case.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Fan-provided subtitles for the wrong video source:</span>
            Community-created subtitle files often specify which video source they were timed for. If that
            does not match what you have, FPS conversion is usually the fix.
          </li>
        </ul>
      </section>

      {/* ===== Zone 3: FAQ + Related Tools ===== */}
      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <Accordion className="w-full">
          <AccordionItem value="what-does">
            <AccordionTrigger>What does subtitle FPS conversion actually do?</AccordionTrigger>
            <AccordionContent>
              It rescales every timestamp in the subtitle file by the ratio of source to target FPS. A file
              timed for 23.976 fps but played against 25 fps drifts further off as the video progresses.
              Rescaling re-aligns every cue with the spoken dialogue.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="shift-or-fps">
            <AccordionTrigger>How do I know my subtitles need FPS conversion and not a shift?</AccordionTrigger>
            <AccordionContent>
              If the subtitles start close to correct but drift further out of sync over time, the problem
              is frame rate, not a fixed delay. If you can fix the first scene with a shift but the end
              still drifts, you need FPS conversion.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="which-fps">
            <AccordionTrigger>Which FPS values should I pick?</AccordionTrigger>
            <AccordionContent>
              Set Source FPS to the frame rate the subtitles were originally timed for, and Target FPS to
              the frame rate of the video you are now playing. The most common mismatches are 23.976 ↔ 25
              (NTSC film vs PAL) and 29.97 ↔ 30.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="custom">
            <AccordionTrigger>What if my source or target FPS is unusual?</AccordionTrigger>
            <AccordionContent>
              Pick Custom from either dropdown and enter the exact value you need. The tool accepts
              decimals, so non-integer rates like 47.952 or 119.88 work fine.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="formats">
            <AccordionTrigger>Which subtitle formats are supported?</AccordionTrigger>
            <AccordionContent>
              The first version supports SRT and VTT. ASS files are not yet supported because ASS karaoke
              and transition tags require additional scaling logic.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="privacy">
            <AccordionTrigger>Is my subtitle file uploaded anywhere?</AccordionTrigger>
            <AccordionContent>
              No. The FPS conversion runs entirely in your browser. Your file never leaves your device.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="shift-after">
            <AccordionTrigger>Do I need to shift subtitles after FPS conversion?</AccordionTrigger>
            <AccordionContent>
              Sometimes. If the file is both rescaled for the wrong frame rate and offset by a constant
              amount, run FPS conversion first to fix the pacing, then use the Subtitle Timing Shift tool
              to correct the remaining constant offset.
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
