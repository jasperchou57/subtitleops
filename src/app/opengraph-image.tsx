import {
  createSubtitleOpsOgImage,
  subtitleOpsOgContentType as contentType,
  subtitleOpsOgSize as size,
} from "@/lib/og-image";

export const runtime = "edge";
export const alt = "SubtitleOps - Free Online Subtitle Converter & Tools";
export { contentType, size };

export default function Image() {
  return createSubtitleOpsOgImage({
    title: "Free Online Subtitle Converter & Tools",
    description:
      "Convert subtitle files in your browser with private format, transcript, timing, and FPS tools.",
    chips: ["SRT", "ASS", "VTT", "TXT", "SBV", "Timing"],
  });
}
