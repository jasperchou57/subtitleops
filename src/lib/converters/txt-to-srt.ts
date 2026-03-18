import type { SrtEntry } from "./ass-to-srt";

/**
 * Convert plain text lines to SRT format.
 * Each non-empty line becomes one subtitle entry.
 * Default duration: 3 seconds per line with 0.5s gap.
 */
export function convertTxtToSrt(txtContent: string, secondsPerLine = 3, gap = 0.5): SrtEntry[] {
  const lines = txtContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const entries: SrtEntry[] = [];
  let currentTime = 0;

  for (let i = 0; i < lines.length; i++) {
    const start = formatSrtTime(currentTime);
    const end = formatSrtTime(currentTime + secondsPerLine);

    entries.push({
      index: i + 1,
      start,
      end,
      text: lines[i],
    });

    currentTime += secondsPerLine + gap;
  }

  return entries;
}

function formatSrtTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const ms = Math.round((totalSeconds % 1) * 1000);

  return (
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0") +
    "," +
    String(ms).padStart(3, "0")
  );
}
