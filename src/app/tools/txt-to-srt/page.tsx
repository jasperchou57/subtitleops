import type { Metadata } from "next";
import Link from "next/link";
import { TxtToSrtConverter } from "./converter";
import { VibeBackgroundGlow } from "@/components/ui/vibe-background-glow";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { JsonLd, toolPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Free TXT to SRT Converter Online - Turn Plain Text into Subtitles",
  description:
    "Convert plain text to SRT subtitle format with auto-generated timestamps. Paste or upload a script, transcript, or lyrics file and get a ready-to-edit subtitle draft instantly.",
  keywords: ["txt to srt", "text to srt", "convert text to srt", "create srt from text"],
  alternates: { canonical: "/tools/txt-to-srt" },
};

const jsonLdData = toolPageJsonLd({
  name: "TXT to SRT Converter",
  description: "Convert plain text to SRT subtitle format with auto-generated timestamps. Paste or upload a script, transcript, or lyrics file and get a ready-to-edit subtitle draft instantly.",
  url: "/tools/txt-to-srt",
  faqs: [
    { question: "How are timestamps generated when converting TXT to SRT?", answer: "The converter creates sequential timestamps automatically. Each non-empty line becomes a subtitle entry with a default duration and a short gap before the next cue." },
    { question: "Can I edit the timing later?", answer: "Yes. The generated timing is meant as a starting point. You can shift the file later or fine-tune entries in a subtitle editor." },
    { question: "What happens to blank lines?", answer: "Blank lines are skipped. They do not create empty subtitle entries in the output." },
    { question: "Does this support non-English text?", answer: "Yes. The TXT to SRT workflow preserves UTF-8 text, so it works with multilingual subtitle content." },
    { question: "Is the text uploaded anywhere?", answer: "No. The tool runs in the browser, and your file stays on your device." },
    { question: "Can I convert song lyrics from TXT to SRT for a music video?", answer: "Yes. Converting lyrics from TXT to SRT is a common use case. Each line of your lyrics becomes a subtitle entry with default timing. You will likely need to adjust the timing afterward to match the song tempo." },
    { question: "Can I use TXT to SRT for scripts, not just subtitle text?", answer: "Yes. As long as the text is structured line by line, the converter can turn it into a subtitle draft. Many users start with scripts, dialogue lists, notes, or lyric sheets rather than a ready-made subtitle file." },
  ],
});

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
      {jsonLdData.map((data, i) => <JsonLd key={i} data={data} />)}

      {/* ===== Zone 1: Tool (Hero) ===== */}
      <section className="relative py-10 md:py-14">
        <VibeBackgroundGlow />
        <h1 className="relative text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center">
          Convert TXT to SRT - Turn Plain Text into Subtitles
        </h1>
        <p className="relative mt-3 text-center text-muted-foreground max-w-2xl mx-auto">
          Use this free TXT to SRT converter when you have dialogue, lyrics, a script, or a transcript but no subtitle
          timing yet. Unlike format-to-format tools, this page creates subtitle structure from scratch. Each non-empty
          line becomes one subtitle entry, and the converter generates sequential timestamps automatically so you can
          start editing from a usable SRT draft instead of a raw text file.
        </p>
        <div className="mt-8"><TxtToSrtConverter /></div>
        <div className="mt-6 rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Already have an SRT file and need the text back out?</span>{" "}
          Use the{" "}
          <Link href="/tools/srt-to-txt" className="font-medium underline underline-offset-4 hover:text-foreground/70">SRT to TXT</Link>{" "}
          page to extract a plain transcript.
        </div>
      </section>

      {/* ===== Zone 2: Landing Page Content ===== */}
      <section className="pb-12 border-t pt-10">
        <h2 className="text-2xl font-bold mb-6">How to Convert TXT to SRT in 3 Steps</h2>
        <ol className="grid gap-4 md:grid-cols-3 mb-8">
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">1</span>
            <h3 className="font-semibold mb-1">Upload or Paste Your Plain Text</h3>
            <p className="text-sm text-muted-foreground">
              Add a .txt file or paste text directly into the tool. This works well for scripts, lyric sheets,
              transcript drafts, or dialogue lists.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">2</span>
            <h3 className="font-semibold mb-1">Generate Subtitle Timing Automatically</h3>
            <p className="text-sm text-muted-foreground">
              Because plain text has no timestamps, the converter creates them for you. Each line becomes a subtitle
              cue with a default display duration and a small gap before the next line begins.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">3</span>
            <h3 className="font-semibold mb-1">Download a Ready-to-Edit SRT File</h3>
            <p className="text-sm text-muted-foreground">
              The result is a valid SRT file you can import into an editor and refine later if you need tighter timing.
            </p>
          </li>
        </ol>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">How Timestamp Generation Works</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          This page is fundamentally different from VTT to SRT or ASS to SRT. Those conversions begin with a file that
          already has timing. TXT to SRT does not. It has to create timing logic from zero.
        </p>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Every non-empty line becomes one subtitle entry:</span>
            The converter treats each line as one subtitle block. That makes it easy to build a first draft from structured dialogue or lyrics. If a single line is too long, you may want to split it into two lines before converting so the on-screen text stays readable.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">The first subtitle starts at zero:</span>
            The generated SRT begins at 00:00:00,000, giving you a clean starting point for later editing. You can use a subtitle shifter afterward to offset all timestamps if your video has an intro or delay before dialogue begins.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">A default duration is assigned to each line:</span>
            Each subtitle line gets a readable default on-screen duration. This is not meant to replace detailed subtitle timing, but it gives you a useful first pass. Longer lines may need extended durations, which you can adjust in any SRT-compatible editor.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">A small gap separates entries:</span>
            The gap prevents the subtitles from feeling like one continuous wall of text and makes the output easier to review. This spacing also ensures that most video players render the transition between cues cleanly without overlap.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Blank lines are ignored:</span>
            Blank lines in the source text do not create empty subtitle entries. You can use them to separate sections in the source file without breaking the output. This means you can organize your script with whitespace for readability and the converter will handle it gracefully.
          </li>
        </ul>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">When TXT to SRT Is the Right Tool</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Building subtitles from a transcript:</span>
            If you already have an AI transcription, meeting notes, or a cleaned-up transcript, this tool can turn it into an editable subtitle draft quickly. This is especially helpful when you need to create srt from text that was generated by a speech-to-text service that outputs plain text without timing data.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Turning lyrics into subtitle lines:</span>
            Music video workflows often begin with lyric text rather than a subtitle format. This page gives you a starting subtitle file that can be aligned later. Once the SRT is generated, you can fine-tune each cue to match the beat or vocal timing of the track.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Drafting subtitle structure before fine timing:</span>
            Sometimes teams want to get subtitle blocks into an editor first and refine timing later. TXT to SRT is useful for that intermediate step. It saves time compared to manually creating each numbered cue and timestamp pair from scratch in a text editor.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Creating a first-pass subtitle file for editors:</span>
            Video editors that accept SRT need subtitle structure, not just text. This tool creates that structure automatically. Whether you are working in Premiere Pro, DaVinci Resolve, or a web-based editor, the generated SRT file can be imported directly and refined on the timeline.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Converting drafts before fine-grained timing work starts:</span>
            Many subtitle workflows are staged. First, get the dialogue into subtitle form. Second, adjust timing against the actual video. TXT to SRT is valuable because it shortens the first stage dramatically and gives editors a file they can work with immediately.
          </li>
        </ul>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">TXT vs SRT</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          A plain text file contains text only. It has no timestamps, no cue numbers, and no playback logic. SRT is
          different because every subtitle entry includes a number, a start and end time, and the displayed text. That
          is why this converter has to do more than rewrite syntax. It has to generate the missing subtitle logic that
          plain text does not carry. Most subtitle format converters simply remap existing data from one structure to
          another, but TXT to SRT must infer structure where none exists. The converter fills in sequential numbering,
          calculates start and end timestamps, and inserts the required blank-line delimiters that the SRT specification
          demands between cues.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          That is also why TXT to SRT should be described honestly. It is not a perfect timing solution. It is a fast drafting tool. The value is that it turns a raw text document into a structured subtitle file that can be previewed, shifted, imported, and refined. For many users that is exactly the bridge they need between transcript text and true subtitle editing.
        </p>
      </section>

      {/* ===== Zone 3: FAQ + Related Tools ===== */}
      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <Accordion className="w-full">
          <AccordionItem value="timestamps">
            <AccordionTrigger>How are timestamps generated when converting TXT to SRT?</AccordionTrigger>
            <AccordionContent>
              The converter creates sequential timestamps automatically. Each non-empty line becomes a subtitle entry
              with a default duration and a short gap before the next cue.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="edit-timing">
            <AccordionTrigger>Can I edit the timing later?</AccordionTrigger>
            <AccordionContent>
              Yes. The generated timing is meant as a starting point. You can shift the file later or fine-tune entries
              in a subtitle editor.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="blank-lines">
            <AccordionTrigger>What happens to blank lines?</AccordionTrigger>
            <AccordionContent>
              Blank lines are skipped. They do not create empty subtitle entries in the output.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="languages">
            <AccordionTrigger>Does this support non-English text?</AccordionTrigger>
            <AccordionContent>
              Yes. The TXT to SRT workflow preserves UTF-8 text, so it works with multilingual subtitle content.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="privacy">
            <AccordionTrigger>Is the text uploaded anywhere?</AccordionTrigger>
            <AccordionContent>
              No. The tool runs in the browser, and your file stays on your device.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="lyrics">
            <AccordionTrigger>Can I convert song lyrics from TXT to SRT for a music video?</AccordionTrigger>
            <AccordionContent>
              Yes. Converting lyrics from TXT to SRT is a common use case. Each line of your lyrics becomes a subtitle
              entry with default timing. You will likely need to adjust the timing afterward to match the song tempo.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="scripts">
            <AccordionTrigger>Can I use TXT to SRT for scripts, not just subtitle text?</AccordionTrigger>
            <AccordionContent>
              Yes. As long as the text is structured line by line, the converter can turn it into a subtitle draft. Many
              users start with scripts, dialogue lists, notes, or lyric sheets rather than a ready-made subtitle file.
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
