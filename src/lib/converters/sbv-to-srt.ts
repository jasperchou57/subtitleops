/**
 * SBV (YouTube) to SRT converter.
 *
 * SBV format:
 *   H:MM:SS.mmm,H:MM:SS.mmm
 *   Subtitle text
 *   (blank line)
 *
 * SRT format:
 *   1
 *   HH:MM:SS,mmm --> HH:MM:SS,mmm
 *   Subtitle text
 *   (blank line)
 */

function padHours(ts: string): string {
  // SBV uses H:MM:SS.mmm, SRT needs HH:MM:SS,mmm
  const parts = ts.trim().split(":");
  if (parts.length === 3) {
    parts[0] = parts[0].padStart(2, "0");
    // Replace dot with comma for milliseconds
    const lastPart = parts[2].replace(".", ",");
    return `${parts[0]}:${parts[1]}:${lastPart}`;
  }
  return ts;
}

export function convertSbvToSrt(content: string): string {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const entries: { start: string; end: string; text: string[] }[] = [];
  let i = 0;

  while (i < lines.length) {
    // Skip blank lines
    if (!lines[i].trim()) {
      i++;
      continue;
    }

    // Try to match SBV timestamp line: H:MM:SS.mmm,H:MM:SS.mmm
    const tsMatch = lines[i].match(
      /^(\d{1,2}:\d{2}:\d{2}\.\d{3})\s*,\s*(\d{1,2}:\d{2}:\d{2}\.\d{3})$/
    );

    if (tsMatch) {
      const start = padHours(tsMatch[1]);
      const end = padHours(tsMatch[2]);
      i++;

      const textLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== "") {
        textLines.push(lines[i]);
        i++;
      }

      if (textLines.length > 0) {
        entries.push({ start, end, text: textLines });
      }
    } else {
      i++;
    }
  }

  return entries
    .map(
      (entry, idx) =>
        `${idx + 1}\n${entry.start} --> ${entry.end}\n${entry.text.join("\n")}`
    )
    .join("\n\n");
}
