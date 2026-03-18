/**
 * Extract plain text from SRT content.
 * Strips index numbers, timestamps, and empty lines.
 */
export function convertSrtToTxt(srtContent: string): string {
  const lines = srtContent.split(/\r?\n/);
  const textLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Skip empty lines
    if (!trimmed) continue;
    // Skip index numbers (pure digits)
    if (/^\d+$/.test(trimmed)) continue;
    // Skip timestamp lines
    if (trimmed.includes("-->")) continue;
    // Strip basic HTML tags
    const clean = trimmed.replace(/<\/?[^>]+>/g, "").trim();
    if (clean) textLines.push(clean);
  }

  return textLines.join("\n");
}
