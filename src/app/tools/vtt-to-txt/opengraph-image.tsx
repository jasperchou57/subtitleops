import {
  createSubtitleOpsOgImage,
  subtitleOpsOgContentType as contentType,
  subtitleOpsOgSize as size,
} from "@/lib/og-image";

export const runtime = "edge";
export const alt = "VTT to TXT converter by SubtitleOps";
export { contentType, size };

export default function Image() {
  return createSubtitleOpsOgImage({
    title: "VTT to TXT Converter",
    description: "Extract readable transcript text from WebVTT captions, NOTE blocks, and cue settings.",
    chips: ["VTT", "TXT", "Transcript", "Browser-Based"],
  });
}
