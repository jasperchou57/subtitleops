import Link from "next/link";
import { VibeBackgroundGlow } from "@/components/ui/vibe-background-glow";
import { LazyUniversalConverter } from "@/components/tools/lazy-universal-converter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { JsonLd, homepageJsonLd } from "@/components/seo/json-ld";

const homepageFaqs = [
  { question: "Is SubtitleOps a free subtitle converter?", answer: "Yes. SubtitleOps is a free subtitle converter for text-based subtitle workflows in the browser. All tools are free to use with no file size limits." },
  { question: "Can I use this as a subtitle converter to SRT?", answer: "Yes. ASS to SRT, VTT to SRT, and TXT to SRT are the clearest routes depending on the source material you start with." },
  { question: "Is this also a transcript to subtitle converter?", answer: "For plain-text transcripts, yes. The TXT to SRT tool covers that workflow directly by generating subtitle timing from raw text." },
  { question: "Can I fix out-of-sync subtitles on SubtitleOps?", answer: "Yes. The Subtitle Timing Shift tool moves every cue forward or backward by a fixed number of seconds. For subtitles that drift further off over time due to a frame-rate mismatch, the Subtitle FPS Converter rescales the whole timeline." },
  { question: "Do you support subtitle FPS conversion?", answer: "Yes. The Subtitle FPS Converter rescales SRT and VTT subtitle timing between frame rates such as 23.976, 25, 29.97, and 30 fps, with a custom FPS option for non-standard rates." },
  { question: "Do you support subtitle language conversion?", answer: "Not as a dedicated translation product today. The current scope is format conversion, subtitle text extraction, subtitle drafting, and timing correction. Subtitle language conversion is on our roadmap." },
  { question: "Is this an audio to subtitle converter or video to subtitle converter?", answer: "Not today. The current product focus is subtitle files and transcript text rather than direct speech-to-text transcription. If you already have a transcript, use the TXT to SRT tool." },
];

const homepageJsonLdData = homepageJsonLd(homepageFaqs);

const tools = [
  {
    name: "ASS to SRT",
    description: "Keep text and timing, remove ASS-only styling, and produce a clean SRT file that works almost everywhere.",
    href: "/tools/ass-to-srt",
    title: "Convert ASS to SRT subtitle format",
  },
  {
    name: "VTT to SRT",
    description: "Remove WebVTT-specific syntax while preserving subtitle content for desktop players and editors.",
    href: "/tools/vtt-to-srt",
    title: "Convert VTT to SRT subtitle format",
  },
  {
    name: "TXT to SRT",
    description: "Turn dialogue, lyrics, or a transcript into a usable subtitle draft that can be refined later.",
    href: "/tools/txt-to-srt",
    title: "Convert TXT to SRT subtitle format",
  },
  {
    name: "SRT to VTT",
    description: "Add the WEBVTT header, rewrite timestamps, and produce browser-ready caption output.",
    href: "/tools/srt-to-vtt",
    title: "Convert SRT to VTT subtitle format",
  },
  {
    name: "SRT to TXT",
    description: "Extract readable text from subtitle files by removing timestamps and formatting in one step.",
    href: "/tools/srt-to-txt",
    title: "Convert SRT to TXT plain text",
  },
  {
    name: "SBV to SRT",
    description: "Convert YouTube SBV caption files to universally compatible SRT format with proper cue numbers.",
    href: "/tools/sbv-to-srt",
    title: "Convert SBV to SRT subtitle format",
  },
  {
    name: "SRT to ASS",
    description: "Generate a styled ASS file from plain SRT subtitles for editing in Aegisub with fonts, colors, and positioning.",
    href: "/tools/srt-to-ass",
    title: "Convert SRT to ASS subtitle format",
  },
  {
    name: "VTT to TXT",
    description: "Extract clean transcript text from WebVTT caption files by stripping timestamps, headers, and cue settings.",
    href: "/tools/vtt-to-txt",
    title: "Extract text from VTT captions",
  },
  {
    name: "Subtitle Timing Shift",
    description: "Fix out-of-sync subtitles by shifting every cue forward or backward by a fixed number of seconds. Supports decimals and negative values.",
    href: "/tools/subtitle-shift",
    title: "Shift subtitles forward or backward by a fixed offset",
  },
  {
    name: "Subtitle FPS Converter",
    description: "Rescale subtitle timing between frame rates like 23.976, 25, 29.97, and 30 fps. Fixes subtitles that drift further off as the video plays.",
    href: "/tools/subtitle-fps-converter",
    title: "Rescale subtitle timing between frame rates",
  },
];

export default function HomePage() {
  return (
    <>
      {homepageJsonLdData.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}

      {/* Hero + Tool */}
      <section className="relative py-16 md:py-24">
        <VibeBackgroundGlow />

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Free Online Subtitle Converter & Tools
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Convert subtitle files between SRT, ASS, VTT, and TXT without leaving your browser.
              SubtitleOps gives you a fast universal subtitle converter for quick jobs, plus dedicated
              tool pages for format-specific workflows like ASS to SRT, VTT to SRT, TXT to SRT,
              SRT to VTT, and SRT to TXT. If you arrived looking for a subtitle converter to SRT or
              a transcript to subtitle converter, this page is designed to route you into the right
              workflow without pretending every subtitle job is the same.
            </p>
          </div>

          {/* Universal Converter */}
          <LazyUniversalConverter />
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y py-6">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-muted-foreground tracking-wide uppercase">
          <span>100% Free</span>
          <span className="hidden sm:inline">&middot;</span>
          <span>No Upload Required</span>
          <span className="hidden sm:inline">&middot;</span>
          <span>Browser-based</span>
          <span className="hidden sm:inline">&middot;</span>
          <span>Private and Secure</span>
        </div>
      </section>

      {/* Why SubtitleOps Exists */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Why SubtitleOps Exists
          </h2>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-4">
            <p>
              Most subtitle tools do only one of two things: they either give you a button with no
              explanation, or they bury a simple converter under generic SEO filler. SubtitleOps is
              built for a different kind of user. Sometimes you need a clean subtitle conversion right
              away. Sometimes you need to understand why a styled ASS file breaks in your editor, why
              a WebVTT export does not work in VLC, or why a plain text transcript still is not a
              usable subtitle file.
            </p>
            <p>
              That is why each page on SubtitleOps has two jobs. First, it does the actual subtitle
              work in the browser. Second, it explains what changes during the conversion so you can
              make better format decisions. The result is a subtitle converter that is useful both for
              one-click tasks and for real workflow decisions.
            </p>
            <p>
              People searching for a subtitle converter are often not sure which specific page they need
              yet. Some have an ASS file from a fansub workflow. Others have a VTT export from a course
              platform. Others only have raw text. This homepage makes that decision easier by showing
              which subtitle workflow each tool actually solves, so you land in the right place quickly.
            </p>
          </div>
        </div>
      </section>

      {/* What This Subtitle Converter Covers */}
      <section className="py-16 md:py-20 border-t">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            What This Subtitle Converter Covers Today
          </h2>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-4">
            <p>
              People use the term &ldquo;subtitle converter&rdquo; loosely, so this page sorts intent
              instead of flattening it. Today SubtitleOps covers four categories: subtitle format
              conversion between existing subtitle files, subtitle-to-text extraction for transcript and
              review workflows, transcript-to-subtitle drafting through TXT to SRT, and subtitle timing
              correction through shift and FPS conversion.
            </p>
            <p>
              That means the site already answers a meaningful share of searches like &ldquo;subtitle
              converter to SRT&rdquo;, &ldquo;SRT to subtitle converter&rdquo;, &ldquo;transcript
              to subtitle converter&rdquo;, &ldquo;fix subtitle delay&rdquo;, and &ldquo;subtitle FPS
              converter&rdquo;. Looking for subtitle language conversion? That workflow is still on our
              roadmap. Today SubtitleOps focuses on format conversion, text extraction, and timing
              correction — the foundation most subtitle workflows need first.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Subtitle Workflows */}
      <section className="py-16 md:py-20 border-t">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Popular Subtitle Workflows
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border bg-card p-6">
              <h3 className="text-lg font-semibold mb-2">From styled subtitle files to universal playback</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you downloaded a heavily styled subtitle file from a fansub release or a karaoke
                workflow, you usually need compatibility more than styling. The{" "}
                <Link href="/tools/ass-to-srt" title="Convert ASS to SRT subtitle format" className="font-medium underline underline-offset-4 hover:text-foreground/70">ASS to SRT</Link>{" "}
                page is designed for that exact job: keep text and timing, remove ASS-only styling, and
                produce a clean SRT file that works almost everywhere.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <h3 className="text-lg font-semibold mb-2">From web captions to desktop and editing tools</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                WebVTT is common on modern platforms, course sites, and browser-based players. But when
                you move that subtitle file into a desktop player, editor, or archive, SRT is often the
                format people expect. The{" "}
                <Link href="/tools/vtt-to-srt" title="Convert VTT to SRT subtitle format" className="font-medium underline underline-offset-4 hover:text-foreground/70">VTT to SRT</Link>{" "}
                page handles that shift cleanly by removing WebVTT-specific syntax while preserving subtitle content.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <h3 className="text-lg font-semibold mb-2">From scripts and transcripts to usable subtitles</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Plain text is not a subtitle format. It has no timestamps, no cue structure, and no
                playback logic. The{" "}
                <Link href="/tools/txt-to-srt" title="Convert TXT to SRT subtitle format" className="font-medium underline underline-offset-4 hover:text-foreground/70">TXT to SRT</Link>{" "}
                page exists for users who already have dialogue, lyrics, or a transcript and need a
                usable subtitle draft that can be refined later.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <h3 className="text-lg font-semibold mb-2">From subtitle files to clean transcript text</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sometimes the timing is the problem, not the solution. If you want to translate dialogue,
                build a transcript, run text analysis, or review the spoken content without timestamp
                noise, the{" "}
                <Link href="/tools/srt-to-txt" title="Convert SRT to TXT plain text" className="font-medium underline underline-offset-4 hover:text-foreground/70">SRT to TXT</Link>{" "}
                page extracts readable text from subtitle files in one step.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6 md:col-span-2">
              <h3 className="text-lg font-semibold mb-2">From a quick conversion into a larger subtitle workflow</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A single conversion is rarely the end of the job. A user may convert ASS to SRT, then
                realize the file needs timing adjustments. Another may extract plain text from an SRT file,
                translate it, and rebuild subtitles from the translated text. SubtitleOps is designed as a
                connected workflow, not just a loose collection of standalone converters. Each tool links to
                the next logical step so you can keep moving.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-16 md:py-20 border-t">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            All tools
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Pick a specific tool for dedicated features and format-specific guides.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                title={tool.title}
                className="group flex items-center justify-between rounded-xl border p-5 hover:bg-accent transition-colors"
              >
                <div>
                  <h3 className="font-semibold group-hover:underline underline-offset-4">
                    {tool.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
                <svg
                  className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors ml-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-20 border-t">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid gap-10 md:grid-cols-3 text-center">
            <div>
              <div className="mx-auto mb-4 text-4xl font-bold text-muted-foreground/30">01</div>
              <h3 className="text-lg font-semibold mb-2">Drop any subtitle file</h3>
              <p className="text-sm text-muted-foreground">
                Start with the universal subtitle converter if you want the quickest route. SubtitleOps
                detects common subtitle formats like SRT, ASS, VTT, and TXT automatically.
              </p>
            </div>
            <div>
              <div className="mx-auto mb-4 text-4xl font-bold text-muted-foreground/30">02</div>
              <h3 className="text-lg font-semibold mb-2">Pick the output you need</h3>
              <p className="text-sm text-muted-foreground">
                Choose the output format based on where the file is going next. Some jobs are about
                compatibility. Others are about web delivery, transcript extraction, or building
                subtitles from plain text.
              </p>
            </div>
            <div>
              <div className="mx-auto mb-4 text-4xl font-bold text-muted-foreground/30">03</div>
              <h3 className="text-lg font-semibold mb-2">Preview and download</h3>
              <p className="text-sm text-muted-foreground">
                Each tool gives you a quick before-and-after view so you can verify the result before
                downloading. Everything runs in the browser, so the workflow stays fast and private.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Homepage FAQ */}
      <section className="py-16 md:py-20 border-t">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <Accordion className="w-full">
            <AccordionItem value="free">
              <AccordionTrigger>Is SubtitleOps a free subtitle converter?</AccordionTrigger>
              <AccordionContent>
                Yes. SubtitleOps is a free subtitle converter for text-based subtitle workflows in the browser. All tools are free to use with no file size limits.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="to-srt">
              <AccordionTrigger>Can I use this as a subtitle converter to SRT?</AccordionTrigger>
              <AccordionContent>
                Yes. ASS to SRT, VTT to SRT, and TXT to SRT are the clearest routes depending on the source material you start with.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="transcript">
              <AccordionTrigger>Is this also a transcript to subtitle converter?</AccordionTrigger>
              <AccordionContent>
                For plain-text transcripts, yes. The TXT to SRT tool covers that workflow directly by generating subtitle timing from raw text.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="sync">
              <AccordionTrigger>Can I fix out-of-sync subtitles on SubtitleOps?</AccordionTrigger>
              <AccordionContent>
                Yes. The{" "}
                <Link href="/tools/subtitle-shift" title="Shift subtitles forward or backward by a fixed offset" className="font-medium underline underline-offset-4">Subtitle Timing Shift</Link>{" "}
                tool moves every cue forward or backward by a fixed number of seconds. For subtitles that drift further off over time due to a frame-rate mismatch, use the{" "}
                <Link href="/tools/subtitle-fps-converter" title="Rescale subtitle timing between frame rates" className="font-medium underline underline-offset-4">Subtitle FPS Converter</Link>.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="fps">
              <AccordionTrigger>Do you support subtitle FPS conversion?</AccordionTrigger>
              <AccordionContent>
                Yes. The Subtitle FPS Converter rescales SRT and VTT subtitle timing between frame rates such as 23.976, 25, 29.97, and 30 fps, with a custom FPS option for non-standard rates.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="language">
              <AccordionTrigger>Do you support subtitle language conversion?</AccordionTrigger>
              <AccordionContent>
                Not as a dedicated translation product today. The current scope is format conversion, subtitle text extraction, subtitle drafting, and timing correction. Subtitle language conversion is on our roadmap.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="audio-video">
              <AccordionTrigger>Is this an audio to subtitle converter or video to subtitle converter?</AccordionTrigger>
              <AccordionContent>
                Not today. The current product focus is subtitle files and transcript text rather than direct speech-to-text transcription. If you already have a transcript, use the TXT to SRT tool.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </>
  );
}
