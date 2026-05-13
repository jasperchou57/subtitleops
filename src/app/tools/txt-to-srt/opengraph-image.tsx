import {
  createSubtitleOpsOgImage,
  subtitleOpsOgContentType as contentType,
  subtitleOpsOgSize as size,
} from "@/lib/og-image";

export const runtime = "edge";
export const alt = "TXT to SRT converter by SubtitleOps";
export { contentType, size };

export default function Image() {
  return createSubtitleOpsOgImage({
    title: "TXT to SRT Converter",
    description: "Create a timed SRT subtitle draft from dialogue, lyrics, scripts, or plain text.",
    chips: ["TXT", "Transcript", "SRT Draft", "Browser-Based"],
  });
}
