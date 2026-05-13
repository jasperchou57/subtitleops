import {
  createSubtitleOpsOgImage,
  subtitleOpsOgContentType as contentType,
  subtitleOpsOgSize as size,
} from "@/lib/og-image";

export const runtime = "edge";
export const alt = "ASS to SRT converter by SubtitleOps";
export { contentType, size };

export default function Image() {
  return createSubtitleOpsOgImage({
    title: "ASS to SRT Converter",
    description: "Keep dialogue and timing while removing ASS-only styling for broad SRT compatibility.",
    chips: ["ASS", "SSA", "SRT", "No Upload"],
  });
}
