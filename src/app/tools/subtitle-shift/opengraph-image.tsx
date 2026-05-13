import {
  createSubtitleOpsOgImage,
  subtitleOpsOgContentType as contentType,
  subtitleOpsOgSize as size,
} from "@/lib/og-image";

export const runtime = "edge";
export const alt = "Subtitle Timing Shift by SubtitleOps";
export { contentType, size };

export default function Image() {
  return createSubtitleOpsOgImage({
    title: "Subtitle Timing Shift",
    description: "Fix subtitles that are consistently early or late by shifting every cue.",
    chips: ["SRT", "VTT", "Delay Fix", "No Upload"],
  });
}
