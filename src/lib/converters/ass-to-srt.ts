export interface SrtEntry {
  index: number;
  start: string;
  end: string;
  text: string;
}

/**
 * Convert ASS/SSA timestamp (H:MM:SS.cc) to SRT timestamp (HH:MM:SS,mmm)
 */
function assTimeToSrt(assTime: string): string {
  const match = assTime.trim().match(/(\d+):(\d{2}):(\d{2})\.(\d{2})/);
  if (!match) return "00:00:00,000";
  const [, h, m, s, cs] = match;
  const hours = h.padStart(2, "0");
  const ms = (parseInt(cs, 10) * 10).toString().padStart(3, "0");
  return `${hours}:${m}:${s},${ms}`;
}

/**
 * Strip ASS styling tags like {\b1}, {\i1}, {\c&H...}, {\pos(x,y)}, etc.
 * Convert \N and \n to actual newlines.
 */
function cleanAssText(text: string): string {
  return text
    .replace(/\{[^}]*\}/g, "") // remove {...} override tags
    .replace(/\\N/g, "\n")      // ASS hard newline
    .replace(/\\n/g, "\n")      // ASS soft newline
    .trim();
}

/**
 * Parse ASS/SSA content and convert to SRT entries
 */
export function convertAssToSrt(assContent: string): SrtEntry[] {
  const lines = assContent.split(/\r?\n/);
  const entries: SrtEntry[] = [];
  let inEvents = false;
  let formatFields: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.toLowerCase() === "[events]") {
      inEvents = true;
      continue;
    }

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      inEvents = false;
      continue;
    }

    if (!inEvents) continue;

    if (trimmed.toLowerCase().startsWith("format:")) {
      formatFields = trimmed
        .substring(7)
        .split(",")
        .map((f) => f.trim().toLowerCase());
      continue;
    }

    if (!trimmed.toLowerCase().startsWith("dialogue:")) continue;

    const valuesPart = trimmed.substring(trimmed.indexOf(":") + 1);
    // Split only up to the number of format fields - 1, so the last field (Text) can contain commas
    const values = valuesPart.split(",");
    if (values.length < formatFields.length) continue;

    const startIdx = formatFields.indexOf("start");
    const endIdx = formatFields.indexOf("end");
    const textIdx = formatFields.indexOf("text");

    if (startIdx === -1 || endIdx === -1 || textIdx === -1) continue;

    const startTime = values[startIdx]?.trim();
    const endTime = values[endIdx]?.trim();
    // Text field is the last one and may contain commas
    const text = values.slice(textIdx).join(",").trim();

    const cleanedText = cleanAssText(text);
    if (!cleanedText) continue;

    entries.push({
      index: entries.length + 1,
      start: assTimeToSrt(startTime),
      end: assTimeToSrt(endTime),
      text: cleanedText,
    });
  }

  // Sort by start time
  entries.sort((a, b) => a.start.localeCompare(b.start));

  // Re-index after sorting
  return entries.map((e, i) => ({ ...e, index: i + 1 }));
}

/**
 * Format SRT entries to SRT string
 */
export function formatSrt(entries: SrtEntry[]): string {
  return entries
    .map(
      (e) =>
        `${e.index}\n${e.start} --> ${e.end}\n${e.text}\n`
    )
    .join("\n");
}
