/**
 * VTT to TXT converter.
 *
 * Strips the WEBVTT header, timestamps, cue settings, and cue identifiers,
 * leaving only the visible subtitle text as clean plain text. Lines within a
 * cue stay together, and separate cues have one blank line between them.
 */

export function convertVttToTxt(content: string): string {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const cues: string[] = [];
  const cueTextLines: string[] = [];
  let pastHeader = false;

  const flushCue = () => {
    if (cueTextLines.length > 0) {
      cues.push(cueTextLines.join('\n'));
      cueTextLines.length = 0;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith('NOTE')) {
      flushCue();
      while (i + 1 < lines.length && lines[i + 1].trim() !== '') i++;
      continue;
    }

    // Skip the WEBVTT header and any metadata lines following it
    if (!pastHeader) {
      if (line.startsWith('WEBVTT')) continue;
      if (line.startsWith('Kind:') || line.startsWith('Language:')) continue;
      if (line.trim() === '') continue;
      pastHeader = true;
    }

    // Skip timestamp lines (contain -->)
    if (line.includes('-->')) {
      flushCue();
      continue;
    }

    // Skip cue identifiers (standalone numbers or identifiers before timestamps)
    if (
      i + 1 < lines.length &&
      lines[i + 1] &&
      lines[i + 1].includes('-->') &&
      line.trim() !== ''
    ) {
      flushCue();
      continue;
    }

    // A blank line marks the end of a VTT cue
    if (line.trim() === '') {
      flushCue();
      continue;
    }

    // Strip VTT tags like <v Speaker>, <c.classname>, <b>, <i>, etc.
    const cleaned = line
      .replace(/<v\s+[^>]*>/g, '')
      .replace(/<\/v>/g, '')
      .replace(/<c[^>]*>/g, '')
      .replace(/<\/c>/g, '')
      .replace(/<\/?[biuBIU]>/g, '')
      .replace(/<\d{2}:\d{2}:\d{2}\.\d{3}>/g, '') // timestamp tags
      .replace(/<\/?[^>]+>/g, '')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .trim();

    if (cleaned) {
      cueTextLines.push(cleaned);
    }
  }

  flushCue();
  return cues.join('\n\n');
}
