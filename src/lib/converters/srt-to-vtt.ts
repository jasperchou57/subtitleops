/**
 * Convert SRT content to WebVTT format.
 * - Adds WEBVTT header
 * - Converts comma in timestamps to dot
 * - Preserves text and timing
 */
export function convertSrtToVtt(srtContent: string): string {
  const lines = srtContent.split(/\r?\n/);
  const outputLines: string[] = ["WEBVTT", ""];

  for (const line of lines) {
    if (line.includes("-->")) {
      // Convert SRT timestamps (comma) to VTT (dot)
      outputLines.push(line.replace(/,/g, "."));
    } else if (/^\d+\s*$/.test(line.trim())) {
      // Skip numeric cue identifiers (SRT index numbers)
      // VTT doesn't need them but we can keep as cue id
      continue;
    } else {
      outputLines.push(line);
    }
  }

  return outputLines.join("\n");
}

export function parseSrtForPreview(srtContent: string): { count: number; firstLines: string } {
  const blocks = srtContent.trim().split(/\n\s*\n/).filter(Boolean);
  return {
    count: blocks.length,
    firstLines: blocks.slice(0, 3).join("\n\n"),
  };
}
