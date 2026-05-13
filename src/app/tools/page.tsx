import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, toolsItemListJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Free Subtitle Tools — Convert, Extract & Draft Subtitles",
  description:
    "Browse all free subtitle tools on SubtitleOps. Convert between SRT, ASS, VTT, SBV, and TXT formats, extract transcript text, draft subtitles, or fix timing.",
  alternates: { canonical: "/tools" },
  openGraph: { url: "/tools" },
};

const tools = [
  {
    name: "ASS to SRT",
    description:
      "Keep text and timing, remove ASS-only styling, and produce a clean SRT file that works almost everywhere.",
    href: "/tools/ass-to-srt",
    title: "Convert ASS to SRT subtitle format",
  },
  {
    name: "VTT to SRT",
    description:
      "Remove WebVTT-specific syntax while preserving subtitle content for desktop players and editors.",
    href: "/tools/vtt-to-srt",
    title: "Convert VTT to SRT subtitle format",
  },
  {
    name: "TXT to SRT",
    description:
      "Turn dialogue, lyrics, or a transcript into a usable subtitle draft that can be refined later.",
    href: "/tools/txt-to-srt",
    title: "Convert TXT to SRT subtitle format",
  },
  {
    name: "SRT to VTT",
    description:
      "Add the WEBVTT header, rewrite timestamps, and produce browser-ready caption output.",
    href: "/tools/srt-to-vtt",
    title: "Convert SRT to VTT subtitle format",
  },
  {
    name: "SRT to TXT",
    description:
      "Extract readable text from subtitle files by removing timestamps and formatting in one step.",
    href: "/tools/srt-to-txt",
    title: "Convert SRT to TXT plain text",
  },
  {
    name: "SBV to SRT",
    description:
      "Convert YouTube SBV caption files to universally compatible SRT format with proper cue numbers.",
    href: "/tools/sbv-to-srt",
    title: "Convert SBV to SRT subtitle format",
  },
  {
    name: "SRT to ASS",
    description:
      "Generate a styled ASS file from plain SRT subtitles for editing in Aegisub with fonts, colors, and positioning.",
    href: "/tools/srt-to-ass",
    title: "Convert SRT to ASS subtitle format",
  },
  {
    name: "VTT to TXT",
    description:
      "Extract clean transcript text from WebVTT caption files by stripping timestamps, headers, and cue settings.",
    href: "/tools/vtt-to-txt",
    title: "Extract text from VTT captions",
  },
  {
    name: "Subtitle Timing Shift",
    description:
      "Fix out-of-sync subtitles by shifting every cue forward or backward by a fixed number of seconds. Supports decimals and negative values.",
    href: "/tools/subtitle-shift",
    title: "Shift subtitles forward or backward by a fixed offset",
  },
  {
    name: "Subtitle FPS Converter",
    description:
      "Rescale subtitle timing between frame rates like 23.976, 25, 29.97, and 30 fps. Fixes subtitles that drift further off as the video plays.",
    href: "/tools/subtitle-fps-converter",
    title: "Rescale subtitle timing between frame rates",
  },
];

const toolCategories = [
  {
    name: "Format Converters",
    description: "Move subtitle files between SRT, ASS, VTT, SBV, and related working formats.",
    tools: tools.filter((tool) =>
      ["ASS to SRT", "VTT to SRT", "SRT to VTT", "SBV to SRT", "SRT to ASS"].includes(tool.name)
    ),
  },
  {
    name: "Transcript Tools",
    description: "Extract readable text from subtitle files or create a first subtitle draft from plain text.",
    tools: tools.filter((tool) => ["TXT to SRT", "SRT to TXT", "VTT to TXT"].includes(tool.name)),
  },
  {
    name: "Timing Tools",
    description: "Fix subtitle delay, constant offsets, and frame-rate drift without uploading files.",
    tools: tools.filter((tool) => tool.name.startsWith("Subtitle")),
  },
];

const toolsJsonLd = toolsItemListJsonLd(tools);

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <JsonLd data={toolsJsonLd} />
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
        All Subtitle Tools
      </h1>
      <p className="text-muted-foreground mb-12">
        Pick a specific tool for dedicated features and format-specific guides.
        Every tool runs in your browser — no uploads, no sign-ups.
      </p>

      <div className="mb-12 grid gap-4 text-sm text-muted-foreground md:grid-cols-3">
        <p>
          Use format converters when you need compatibility between players, editors, web captions,
          and YouTube caption exports.
        </p>
        <p>
          Use transcript tools when you need plain text for review, translation, analysis, or a first
          timed subtitle draft.
        </p>
        <p>
          Use timing tools when subtitles are consistently delayed or drift because the video frame
          rate does not match the file.
        </p>
      </div>

      <div className="space-y-12">
        {toolCategories.map((category) => (
          <section key={category.name}>
            <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
            <p className="text-sm text-muted-foreground mb-5">{category.description}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {category.tools.map((tool) => (
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
