import {
  createSubtitleOpsOgImage,
  subtitleOpsOgContentType as contentType,
  subtitleOpsOgSize as size,
} from "@/lib/og-image";

export const runtime = "edge";
export const alt = "SubtitleOps subtitle tools";
export { contentType, size };

export default function Image() {
  return createSubtitleOpsOgImage({
    title: "All Subtitle Tools",
    description: "Convert, extract, draft, and fix subtitle files directly in your browser.",
    chips: ["SRT", "ASS", "VTT", "TXT", "SBV", "Timing"],
  });
}
