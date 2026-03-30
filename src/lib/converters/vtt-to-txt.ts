/**
 * VTT to TXT converter.
 *
 * Strips the WEBVTT header, timestamps, cue settings, and cue identifiers,
 * leaving only the visible subtitle text as clean plain text.
 */

export function convertVttToTxt(content: string): string {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const textLines: string[] = [];
  let pastHeader = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip the WEBVTT header and any metadata lines following it
    if (!pastHeader) {
      if (line.startsWith("WEBVTT")) continue;
      if (line.startsWith("Kind:") || line.startsWith("Language:")) continue;
      if (line.startsWith("NOTE")) {
        // Skip multi-line NOTE blocks
        while (i + 1 < lines.length && lines[i + 1].trim() !== "") i++;
        continue;
      }
      if (line.trim() === "") continue;
      pastHeader = true;
    }

    // Skip timestamp lines (contain -->)
    if (line.includes("-->")) continue;

    // Skip cue identifiers (standalone numbers or identifiers before timestamps)
    if (
      i + 1 < lines.length &&
      lines[i + 1] &&
      lines[i + 1].includes("-->") &&
      line.trim() !== ""
    ) {
      continue;
    }

    // Skip blank lines
    if (line.trim() === "") continue;

    // Strip VTT tags like <v Speaker>, <c.classname>, <b>, <i>, etc.
    const cleaned = line
      .replace(/<v\s+[^>]*>/g, "")
      .replace(/<\/v>/g, "")
      .replace(/<c[^>]*>/g, "")
      .replace(/<\/c>/g, "")
      .replace(/<\/?[biuBIU]>/g, "")
      .replace(/<\d{2}:\d{2}:\d{2}\.\d{3}>/g, "") // timestamp tags
      .trim();

    if (cleaned) {
      textLines.push(cleaned);
    }
  }

  return textLines.join("\n");
}
