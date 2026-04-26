/**
 * Shared timing-adjustment utilities for shift and FPS conversion.
 * Supports SRT (HH:MM:SS,mmm) and VTT (HH:MM:SS.mmm or MM:SS.mmm).
 */

export type TimingFormat = "srt" | "vtt";

export function detectTimingFormat(content: string, fileName: string): TimingFormat | null {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "srt") return "srt";
  if (ext === "vtt") return "vtt";

  const trimmed = content.trim();
  if (trimmed.startsWith("WEBVTT")) return "vtt";
  if (/^\d+\s*\r?\n\d{2}:\d{2}:\d{2},\d{3}\s*-->/.test(trimmed)) return "srt";
  return null;
}

function msToSrtTimestamp(totalMs: number): string {
  const clamped = Math.max(0, Math.round(totalMs));
  const h = Math.floor(clamped / 3600_000);
  const m = Math.floor((clamped % 3600_000) / 60_000);
  const s = Math.floor((clamped % 60_000) / 1_000);
  const ms = clamped % 1_000;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

function msToVttTimestamp(totalMs: number): string {
  return msToSrtTimestamp(totalMs).replace(",", ".");
}

const TIMESTAMP_RE = /(?:(\d{1,2}):)?(\d{1,2}):(\d{2})[,.](\d{3})/g;

/**
 * Transform every timestamp on every line of the file that contains `-->`.
 * Preserves cue ids, text, blank lines, WEBVTT header, and cue settings.
 */
function transformTimestamps(
  content: string,
  format: TimingFormat,
  transform: (ms: number) => number
): { output: string; cueCount: number; clampedCount: number } {
  const formatTs = format === "srt" ? msToSrtTimestamp : msToVttTimestamp;
  let cueCount = 0;
  let clampedCount = 0;

  const outputLines = content.split(/\r?\n/).map((line) => {
    if (!line.includes("-->")) return line;
    cueCount += 1;

    return line.replace(TIMESTAMP_RE, (_whole, hOpt, m, s, ms) => {
      const hours = hOpt ? parseInt(hOpt, 10) : 0;
      const totalMs = hours * 3600_000 + parseInt(m, 10) * 60_000 + parseInt(s, 10) * 1_000 + parseInt(ms, 10);
      const next = transform(totalMs);
      if (next < 0) clampedCount += 1;
      return formatTs(next);
    });
  });

  return { output: outputLines.join("\n"), cueCount, clampedCount };
}

export interface ShiftResult {
  output: string;
  cueCount: number;
  /** Number of timestamps that fell below zero and were clamped to 00:00:00,000. */
  clampedCount: number;
}

/**
 * Shift every timestamp by `shiftMs` milliseconds. Negative values shift earlier.
 * Timestamps that would become negative are clamped to zero.
 */
export function shiftSubtitles(content: string, format: TimingFormat, shiftMs: number): ShiftResult {
  return transformTimestamps(content, format, (ms) => ms + shiftMs);
}

export interface FpsResult {
  output: string;
  cueCount: number;
  clampedCount: number;
  ratio: number;
}

/**
 * Scale every timestamp by `sourceFps / targetFps`.
 *
 * A subtitle timed for 23.976 fps played against a 25 fps video runs ~4.3% too slow relative to the
 * spoken dialogue. Multiplying every timestamp by sourceFps/targetFps (= 0.959) re-syncs the cues.
 */
export function convertFps(
  content: string,
  format: TimingFormat,
  sourceFps: number,
  targetFps: number
): FpsResult {
  if (!isFinite(sourceFps) || !isFinite(targetFps) || sourceFps <= 0 || targetFps <= 0) {
    throw new Error("FPS values must be positive numbers.");
  }
  const ratio = sourceFps / targetFps;
  const result = transformTimestamps(content, format, (ms) => ms * ratio);
  return { ...result, ratio };
}

export const COMMON_FPS: { value: number; label: string }[] = [
  { value: 23.976, label: "23.976 (NTSC film)" },
  { value: 24, label: "24 (Cinema)" },
  { value: 25, label: "25 (PAL)" },
  { value: 29.97, label: "29.97 (NTSC)" },
  { value: 30, label: "30" },
  { value: 48, label: "48" },
  { value: 50, label: "50 (PAL HFR)" },
  { value: 59.94, label: "59.94 (NTSC HFR)" },
  { value: 60, label: "60" },
];
