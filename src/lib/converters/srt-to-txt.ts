/**
 * Extract plain text from SRT content.
 * Strips index numbers, timestamps, and empty lines.
 *
 * Parses SRT as cue blocks (separated by blank lines) rather than line-by-line
 * so that subtitle text consisting purely of digits (e.g. "5", "2025") is not
 * misidentified as a cue index and dropped.
 */
export function convertSrtToTxt(srtContent: string): string {
  const blocks = srtContent
    .replace(/\r\n/g, "\n")
    .trim()
    .split(/\n\s*\n/)
    .filter(Boolean);

  const textLines: string[] = [];
  for (const block of blocks) {
    const lines = block.split("\n");
    const tsIdx = lines.findIndex((l) => l.includes("-->"));
    if (tsIdx < 0) continue;

    const text = lines
      .slice(tsIdx + 1)
      .map((l) => l.replace(/<\/?[^>]+>/g, "").trim())
      .filter((l) => l.length > 0)
      .join("\n");

    if (text) textLines.push(text);
  }

  return textLines.join("\n");
}
