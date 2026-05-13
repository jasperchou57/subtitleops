import {
  createSubtitleOpsOgImage,
  subtitleOpsOgContentType as contentType,
  subtitleOpsOgSize as size,
} from "@/lib/og-image";

export const runtime = "edge";
export const alt = "SRT to VTT converter by SubtitleOps";
export { contentType, size };

export default function Image() {
  return createSubtitleOpsOgImage({
    title: "SRT to VTT Converter",
    description: "Convert SubRip subtitles into browser-ready WebVTT captions.",
    chips: ["SRT", "WebVTT", "HTML5 Video", "No Upload"],
  });
}
