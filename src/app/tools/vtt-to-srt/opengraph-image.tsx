import {
  createSubtitleOpsOgImage,
  subtitleOpsOgContentType as contentType,
  subtitleOpsOgSize as size,
} from "@/lib/og-image";

export const runtime = "edge";
export const alt = "VTT to SRT converter by SubtitleOps";
export { contentType, size };

export default function Image() {
  return createSubtitleOpsOgImage({
    title: "VTT to SRT Converter",
    description: "Turn WebVTT captions into clean SRT files for editors, players, and archives.",
    chips: ["WebVTT", "SRT", "Captions", "No Upload"],
  });
}
