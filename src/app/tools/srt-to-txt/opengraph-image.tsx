import {
  createSubtitleOpsOgImage,
  subtitleOpsOgContentType as contentType,
  subtitleOpsOgSize as size,
} from "@/lib/og-image";

export const runtime = "edge";
export const alt = "SRT to TXT converter by SubtitleOps";
export { contentType, size };

export default function Image() {
  return createSubtitleOpsOgImage({
    title: "SRT to TXT Converter",
    description: "Extract clean transcript text by removing cue numbers, timestamps, and subtitle markup.",
    chips: ["SRT", "TXT", "Transcript", "Private"],
  });
}
