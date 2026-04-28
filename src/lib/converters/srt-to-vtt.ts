/**
 * Convert SRT content to WebVTT format.
 * - Adds WEBVTT header
 * - Converts comma in timestamps to dot
 * - Preserves text and timing
 *
 * Parses SRT as cue blocks (separated by blank lines) rather than line-by-line
 * so that subtitle text consisting purely of digits (e.g. "5", "2025") is not
 * misidentified as a cue index and dropped.
 */
export function convertSrtToVtt(srtContent: string): string {
  const blocks = srtContent
    .replace(/\r\n/g, "\n")
    .trim()
    .split(/\n\s*\n/)
    .filter(Boolean);

  const cues: string[] = [];
  for (const block of blocks) {
    const lines = block.split("\n");
    const tsIdx = lines.findIndex((l) => l.includes("-->"));
    if (tsIdx < 0) continue;

    const tsLine = lines[tsIdx].replace(/,/g, ".");
    const text = lines.slice(tsIdx + 1).join("\n").replace(/\s+$/, "");
    if (!text) continue;

    cues.push(`${tsLine}\n${text}`);
  }

  return ["WEBVTT", ...cues].join("\n\n") + "\n";
}

export function parseSrtForPreview(srtContent: string): { count: number; firstLines: string } {
  const blocks = srtContent.trim().split(/\n\s*\n/).filter(Boolean);
  return {
    count: blocks.length,
    firstLines: blocks.slice(0, 3).join("\n\n"),
  };
}
