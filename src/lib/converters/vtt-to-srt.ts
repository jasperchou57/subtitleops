import type { SrtEntry } from "./ass-to-srt";

/**
 * Convert VTT timestamp (HH:MM:SS.mmm or MM:SS.mmm) to SRT timestamp (HH:MM:SS,mmm)
 */
function vttTimeToSrt(vttTime: string): string {
  const trimmed = vttTime.trim();
  // VTT uses dot for ms separator, SRT uses comma
  // VTT may omit hours: "01:23.456" → "00:01:23,456"
  const parts = trimmed.split(":");
  if (parts.length === 2) {
    // MM:SS.mmm
    const [mm, rest] = parts;
    return `00:${mm.padStart(2, "0")}:${rest.replace(".", ",")}`;
  }
  // HH:MM:SS.mmm
  const [hh, mm, rest] = parts;
  return `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}:${rest.replace(".", ",")}`;
}

/**
 * Strip VTT-specific cue settings (position, align, line, size) and tags
 */
function cleanVttText(text: string): string {
  return text
    .replace(/<\/?[^>]+>/g, "") // strip HTML-like tags (<b>, <i>, <c.classname>)
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();
}

export function convertVttToSrt(vttContent: string): SrtEntry[] {
  const lines = vttContent.split(/\r?\n/);
  const entries: SrtEntry[] = [];
  let i = 0;

  // Skip WEBVTT header and metadata
  while (i < lines.length && !lines[i].includes("-->")) {
    i++;
  }

  while (i < lines.length) {
    const line = lines[i].trim();

    // Look for timestamp line: "00:00:01.000 --> 00:00:04.000"
    if (line.includes("-->")) {
      // Extract timestamps (ignore cue settings after timestamps)
      const arrowIdx = line.indexOf("-->");
      const startRaw = line.substring(0, arrowIdx).trim();
      const afterArrow = line.substring(arrowIdx + 3).trim();
      // End time may be followed by cue settings (position:50% align:center)
      const endRaw = afterArrow.split(/\s+/)[0];

      const start = vttTimeToSrt(startRaw);
      const end = vttTimeToSrt(endRaw);

      // Collect text lines until empty line or next cue
      i++;
      const textLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== "" && !lines[i].includes("-->")) {
        textLines.push(lines[i]);
        i++;
      }

      const text = cleanVttText(textLines.join("\n"));
      if (text) {
        entries.push({
          index: entries.length + 1,
          start,
          end,
          text,
        });
      }
    } else {
      i++;
    }
  }

  return entries;
}
