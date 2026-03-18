import type { SubtitleFormat } from "./detect-format";
import { convertAssToSrt, formatSrt } from "./ass-to-srt";
import { convertVttToSrt } from "./vtt-to-srt";
import { convertTxtToSrt } from "./txt-to-srt";
import { convertSrtToVtt } from "./srt-to-vtt";
import { convertSrtToTxt } from "./srt-to-txt";

/**
 * Universal converter: any supported input format → any supported output format.
 * Routes through SRT as intermediate format when needed.
 */
export function universalConvert(
  content: string,
  inputFormat: SubtitleFormat,
  outputFormat: SubtitleFormat
): string {
  // Step 1: Convert input to SRT (intermediate format)
  let srtContent: string;

  switch (inputFormat) {
    case "srt":
      srtContent = content;
      break;
    case "ass":
      srtContent = formatSrt(convertAssToSrt(content));
      break;
    case "vtt":
      srtContent = formatSrt(convertVttToSrt(content));
      break;
    case "txt":
      srtContent = formatSrt(convertTxtToSrt(content));
      break;
    default:
      throw new Error(`Unsupported input format: ${inputFormat}`);
  }

  if (!srtContent.trim()) {
    throw new Error("No subtitle content found in the file.");
  }

  // Step 2: Convert SRT to desired output
  switch (outputFormat) {
    case "srt":
      return srtContent;
    case "vtt":
      return convertSrtToVtt(srtContent);
    case "txt":
      return convertSrtToTxt(srtContent);
    default:
      throw new Error(`Unsupported output format: ${outputFormat}`);
  }
}
