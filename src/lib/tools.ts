export type SubtitleToolCategoryId = 'format' | 'extract' | 'create' | 'timing';

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
    id: 'ass-to-srt',
    name: 'ASS to SRT',
    description:
      'Keep text and timing, remove ASS-only styling, and produce a clean SRT file that works almost everywhere.',
    href: '/tools/ass-to-srt',
    title: 'Convert ASS to SRT subtitle format',
    category: 'format',
    featured: true,
  },
  {
    id: 'vtt-to-srt',
    name: 'VTT to SRT',
    description:
      'Keep cue text and timing while removing WebVTT-only headers and settings for wider compatibility.',
    href: '/tools/vtt-to-srt',
    title: 'Convert VTT to SRT subtitle format',
    category: 'format',
    featured: true,
  },
  {
    id: 'txt-to-srt',
    name: 'TXT to SRT',
    description:
      'Turn dialogue, lyrics, or a transcript into a rule-based SRT draft that can be timed more precisely later.',
    href: '/tools/txt-to-srt',
    title: 'Convert TXT to SRT subtitle format',
    category: 'create',
    featured: true,
  },
  {
    id: 'srt-to-vtt',
    name: 'SRT to VTT',
    description:
      'Add the WEBVTT header, rewrite timestamps, and produce browser-ready caption output.',
    href: '/tools/srt-to-vtt',
    title: 'Convert SRT to VTT subtitle format',
    category: 'format',
    featured: true,
  },
  {
    id: 'srt-to-txt',
    name: 'SRT to TXT',
    description:
      'Keep readable text and cue boundaries while removing SRT timestamps, cue numbers, and basic tags.',
    href: '/tools/srt-to-txt',
    title: 'Convert SRT to TXT plain text',
    category: 'extract',
    featured: false,
  },
  {
    id: 'sbv-to-srt',
    name: 'SBV to SRT',
    description:
      'Convert YouTube SBV caption files to universally compatible SRT format with proper cue numbers.',
    href: '/tools/sbv-to-srt',
    title: 'Convert SBV to SRT subtitle format',
    category: 'format',
    featured: false,
  },
  {
    id: 'srt-to-ass',
    name: 'SRT to ASS',
    description:
      'Create a valid ASS base file with SRT text and timing, ready for styling in a subtitle editor.',
    href: '/tools/srt-to-ass',
    title: 'Convert SRT to ASS subtitle format',
    category: 'format',
    featured: false,
  },
  {
    id: 'vtt-to-txt',
    name: 'VTT to TXT',
    description:
      'Extract clean text by removing WebVTT timestamps, headers, cue settings, and caption metadata.',
    href: '/tools/vtt-to-txt',
    title: 'Extract text from VTT captions',
    category: 'extract',
    featured: false,
  },
  {
    id: 'subtitle-shift',
    name: 'Subtitle Timing Shift',
    description:
      'Fix out-of-sync subtitles by shifting every cue forward or backward by a fixed number of seconds. Supports decimals and negative values.',
    href: '/tools/subtitle-shift',
    title: 'Shift subtitles forward or backward by a fixed offset',
    category: 'timing',
    featured: true,
  },
  {
    id: 'subtitle-fps-converter',
    name: 'Subtitle FPS Converter',
    description:
      'Rescale subtitle timing between frame rates like 23.976, 25, 29.97, and 30 fps. Fixes subtitles that drift further off as the video plays.',
    href: '/tools/subtitle-fps-converter',
    title: 'Rescale subtitle timing between frame rates',
    category: 'timing',
    featured: true,
  },
];

export const featuredSubtitleTools = subtitleTools.filter(
  (tool) => tool.featured
);

export const subtitleToolCategories: {
  id: SubtitleToolCategoryId;
  name: string;
  description: string;
  intro: string;
}[] = [
  {
    id: 'format',
    name: 'Convert a Format',
    description:
      'Move subtitle files between SRT, ASS, VTT, SBV, and related working formats.',
    intro:
      'Use format converters when you need compatibility between players, editors, web captions, and YouTube caption exports.',
  },
  {
    id: 'extract',
    name: 'Extract Clean Text',
    description:
      'Remove subtitle timing and file syntax when the next job needs readable transcript text.',
    intro:
      'Use extraction tools when you need plain text for review, translation, analysis, or publishing.',
  },
  {
    id: 'create',
    name: 'Create an SRT Draft',
    description:
      'Turn plain text into numbered SRT cues with rule-based, adjustable timing.',
    intro:
      'Use the draft tool when you have text but no subtitle structure or speech-aligned timestamps yet.',
  },
  {
    id: 'timing',
    name: 'Fix Subtitle Timing',
    description:
      'Fix subtitle delay, constant offsets, and frame-rate drift without uploading files.',
    intro:
      'Use timing tools when subtitles are consistently delayed or drift because the video frame rate does not match the file.',
  },
];

export function getSubtitleToolsByCategory(category: SubtitleToolCategoryId) {
  return subtitleTools.filter((tool) => tool.category === category);
}
