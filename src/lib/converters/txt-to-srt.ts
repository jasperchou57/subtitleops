import type { SrtEntry } from "./ass-to-srt";

export interface TxtToSrtOptions {
  secondsPerLine?: number;
  gap?: number;
  startSeconds?: number;
  splitMode?: "line" | "sentence";
  maxCharsPerLine?: number;
}

/**
 * Convert plain text lines to SRT format.
 * Each non-empty line becomes one subtitle entry.
 * Default duration: 3 seconds per line with 0.5s gap.
 */
export function convertTxtToSrt(
  txtContent: string,
  secondsPerLineOrOptions: number | TxtToSrtOptions = 3,
  gap = 0.5
): SrtEntry[] {
  const options =
    typeof secondsPerLineOrOptions === "number"
      ? { secondsPerLine: secondsPerLineOrOptions, gap }
      : secondsPerLineOrOptions;
  const secondsPerLine = options.secondsPerLine ?? 3;
  const gapSeconds = options.gap ?? 0.5;
  const startSeconds = options.startSeconds ?? 0;
  const splitMode = options.splitMode ?? "line";
  const maxCharsPerLine = options.maxCharsPerLine ?? 0;
  const lines = getTextUnits(txtContent, splitMode).map((line) => wrapSubtitleLine(line, maxCharsPerLine));

  const entries: SrtEntry[] = [];
  let currentTime = startSeconds;

  for (let i = 0; i < lines.length; i++) {
    const start = formatSrtTime(currentTime);
    const end = formatSrtTime(currentTime + secondsPerLine);

    entries.push({
      index: i + 1,
      start,
      end,
      text: lines[i],
    });

    currentTime += secondsPerLine + gapSeconds;
  }

  return entries;
}

function getTextUnits(txtContent: string, splitMode: TxtToSrtOptions["splitMode"]): string[] {
  if (splitMode === "sentence") {
    const normalized = txtContent.replace(/\s+/g, " ").trim();
    return (normalized.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [])
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  return txtContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function wrapSubtitleLine(text: string, maxCharsPerLine: number): string {
  if (maxCharsPerLine < 12 || text.length <= maxCharsPerLine) return text;

  const wrapped: string[] = [];
  let currentLine = "";

  for (const word of text.split(/\s+/)) {
    if (!currentLine) {
      currentLine = word;
      continue;
    }

    if (`${currentLine} ${word}`.length <= maxCharsPerLine) {
      currentLine += ` ${word}`;
      continue;
    }

    wrapped.push(currentLine);
    currentLine = word;
  }

  if (currentLine) wrapped.push(currentLine);

  return wrapped.join("\n");
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
