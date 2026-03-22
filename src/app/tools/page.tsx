import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Subtitle Tools — Convert, Extract & Draft Subtitles",
  description:
    "Browse all free subtitle tools on SubtitleOps. Convert between SRT, ASS, VTT, and TXT formats, extract transcript text, or draft subtitles from plain text.",
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
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
        All Subtitle Tools
      </h1>
      <p className="text-muted-foreground mb-12">
        Pick a specific tool for dedicated features and format-specific guides.
        Every tool runs in your browser — no uploads, no sign-ups.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            title={tool.title}
            className="group flex items-center justify-between rounded-xl border p-5 hover:bg-accent transition-colors"
          >
            <div>
              <h2 className="font-semibold group-hover:underline underline-offset-4">
                {tool.name}
              </h2>
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
    </div>
  );
}
