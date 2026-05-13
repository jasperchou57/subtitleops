import {
  createSubtitleOpsOgImage,
  subtitleOpsOgContentType as contentType,
  subtitleOpsOgSize as size,
} from "@/lib/og-image";

export const runtime = "edge";
export const alt = "Subtitle FPS Converter by SubtitleOps";
export { contentType, size };

export default function Image() {
  return createSubtitleOpsOgImage({
    title: "Subtitle FPS Converter",
    description: "Rescale subtitle timing for frame-rate drift such as 23.976 to 25 fps.",
    chips: ["23.976", "25", "29.97", "30 fps"],
  });
}
