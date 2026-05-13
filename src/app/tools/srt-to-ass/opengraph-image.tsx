import {
  createSubtitleOpsOgImage,
  subtitleOpsOgContentType as contentType,
  subtitleOpsOgSize as size,
} from "@/lib/og-image";

export const runtime = "edge";
export const alt = "SRT to ASS converter by SubtitleOps";
export { contentType, size };

export default function Image() {
  return createSubtitleOpsOgImage({
    title: "SRT to ASS Converter",
    description: "Generate an editable ASS subtitle file from plain SRT timing and dialogue.",
    chips: ["SRT", "ASS", "Aegisub", "Styled Subtitles"],
  });
}
