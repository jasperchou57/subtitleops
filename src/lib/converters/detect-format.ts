export type SubtitleFormat = "srt" | "ass" | "vtt" | "txt" | "sbv";

export function detectFormat(content: string, fileName: string): SubtitleFormat {
  const ext = fileName.split(".").pop()?.toLowerCase();

  // Extension-based detection first
  if (ext === "ass" || ext === "ssa") return "ass";
  if (ext === "vtt") return "vtt";
  if (ext === "srt") return "srt";
  if (ext === "sbv") return "sbv";

  // Content-based fallback
  const trimmed = content.trim();
  if (trimmed.startsWith("WEBVTT")) return "vtt";
  if (trimmed.includes("[Script Info]") || trimmed.includes("[V4+ Styles]") || trimmed.includes("[Events]")) return "ass";
  if (/^\d+\s*\r?\n\d{2}:\d{2}:\d{2},\d{3}\s*-->/.test(trimmed)) return "srt";
  // SBV: H:MM:SS.mmm,H:MM:SS.mmm
  if (/^\d{1,2}:\d{2}:\d{2}\.\d{3},\d{1,2}:\d{2}:\d{2}\.\d{3}/.test(trimmed)) return "sbv";

  return "txt";
}

export function getAvailableOutputFormats(input: SubtitleFormat): { value: SubtitleFormat; label: string }[] {
  const all: { value: SubtitleFormat; label: string }[] = [
    { value: "srt", label: "SRT (SubRip)" },
    { value: "ass", label: "ASS (SubStation Alpha)" },
    { value: "vtt", label: "VTT (WebVTT)" },
    { value: "txt", label: "TXT (Plain Text)" },
  ];
  // Don't show the same format or incompatible conversions as output
  return all.filter((f) => f.value !== input && f.value !== "sbv");
}

export const formatLabels: Record<SubtitleFormat, string> = {
  srt: "SRT (SubRip)",
  ass: "ASS (Advanced SubStation Alpha)",
  vtt: "VTT (WebVTT)",
  txt: "TXT (Plain Text)",
  sbv: "SBV (YouTube)",
};
