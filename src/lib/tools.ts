export type SubtitleToolCategoryId = "format" | "transcript" | "timing";

export type SubtitleTool = {
  id: string;
  name: string;
  description: string;
  href: string;
  title: string;
  category: SubtitleToolCategoryId;
  featured: boolean;
};

export const subtitleTools: SubtitleTool[] = [
  {
    id: "ass-to-srt",
    name: "ASS to SRT",
    description:
      "Keep text and timing, remove ASS-only styling, and produce a clean SRT file that works almost everywhere.",
    href: "/tools/ass-to-srt",
    title: "Convert ASS to SRT subtitle format",
    category: "format",
    featured: true,
  },
  {
    id: "vtt-to-srt",
    name: "VTT to SRT",
    description:
      "Remove WebVTT-specific syntax while preserving subtitle content for desktop players and editors.",
    href: "/tools/vtt-to-srt",
    title: "Convert VTT to SRT subtitle format",
    category: "format",
    featured: true,
  },
  {
    id: "txt-to-srt",
    name: "TXT to SRT",
    description:
      "Turn dialogue, lyrics, or a transcript into a usable subtitle draft that can be refined later.",
    href: "/tools/txt-to-srt",
    title: "Convert TXT to SRT subtitle format",
    category: "transcript",
    featured: true,
  },
  {
    id: "srt-to-vtt",
    name: "SRT to VTT",
    description:
      "Add the WEBVTT header, rewrite timestamps, and produce browser-ready caption output.",
    href: "/tools/srt-to-vtt",
    title: "Convert SRT to VTT subtitle format",
    category: "format",
    featured: true,
  },
  {
    id: "srt-to-txt",
    name: "SRT to TXT",
    description:
      "Extract readable text from subtitle files by removing timestamps and formatting in one step.",
    href: "/tools/srt-to-txt",
    title: "Convert SRT to TXT plain text",
    category: "transcript",
    featured: false,
  },
  {
    id: "sbv-to-srt",
    name: "SBV to SRT",
    description:
      "Convert YouTube SBV caption files to universally compatible SRT format with proper cue numbers.",
    href: "/tools/sbv-to-srt",
    title: "Convert SBV to SRT subtitle format",
    category: "format",
    featured: false,
  },
  {
    id: "srt-to-ass",
    name: "SRT to ASS",
    description:
      "Generate a styled ASS file from plain SRT subtitles for editing in Aegisub with fonts, colors, and positioning.",
    href: "/tools/srt-to-ass",
    title: "Convert SRT to ASS subtitle format",
    category: "format",
    featured: false,
  },
  {
    id: "vtt-to-txt",
    name: "VTT to TXT",
    description:
      "Extract clean transcript text from WebVTT caption files by stripping timestamps, headers, and cue settings.",
    href: "/tools/vtt-to-txt",
    title: "Extract text from VTT captions",
    category: "transcript",
    featured: false,
  },
  {
    id: "subtitle-shift",
    name: "Subtitle Timing Shift",
    description:
      "Fix out-of-sync subtitles by shifting every cue forward or backward by a fixed number of seconds. Supports decimals and negative values.",
    href: "/tools/subtitle-shift",
    title: "Shift subtitles forward or backward by a fixed offset",
    category: "timing",
    featured: true,
  },
  {
    id: "subtitle-fps-converter",
    name: "Subtitle FPS Converter",
    description:
      "Rescale subtitle timing between frame rates like 23.976, 25, 29.97, and 30 fps. Fixes subtitles that drift further off as the video plays.",
    href: "/tools/subtitle-fps-converter",
    title: "Rescale subtitle timing between frame rates",
    category: "timing",
    featured: true,
  },
];

export const featuredSubtitleTools = subtitleTools.filter((tool) => tool.featured);

export const subtitleToolCategories: {
  id: SubtitleToolCategoryId;
  name: string;
  description: string;
  intro: string;
}[] = [
  {
    id: "format",
    name: "Format Converters",
    description: "Move subtitle files between SRT, ASS, VTT, SBV, and related working formats.",
    intro:
      "Use format converters when you need compatibility between players, editors, web captions, and YouTube caption exports.",
  },
  {
    id: "transcript",
    name: "Transcript Tools",
    description: "Extract readable text from subtitle files or create a first subtitle draft from plain text.",
    intro:
      "Use transcript tools when you need plain text for review, translation, analysis, or a first timed subtitle draft.",
  },
  {
    id: "timing",
    name: "Timing Tools",
    description: "Fix subtitle delay, constant offsets, and frame-rate drift without uploading files.",
    intro:
      "Use timing tools when subtitles are consistently delayed or drift because the video frame rate does not match the file.",
  },
];

export function getSubtitleToolsByCategory(category: SubtitleToolCategoryId) {
  return subtitleTools.filter((tool) => tool.category === category);
}
