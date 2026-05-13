import {
  createSubtitleOpsOgImage,
  subtitleOpsOgContentType as contentType,
  subtitleOpsOgSize as size,
} from "@/lib/og-image";

export const runtime = "edge";
export const alt = "SBV to SRT converter by SubtitleOps";
export { contentType, size };

export default function Image() {
  return createSubtitleOpsOgImage({
    title: "SBV to SRT Converter",
    description: "Convert YouTube SBV caption exports into clean, numbered SRT subtitle files.",
    chips: ["SBV", "YouTube", "SRT", "No Upload"],
  });
}
