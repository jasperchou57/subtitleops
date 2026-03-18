"use client";

import { GenericConverter } from "@/components/tools/generic-converter";
import { convertSrtToVtt } from "@/lib/converters/srt-to-vtt";

export function SrtToVttConverter() {
  return (
    <GenericConverter
      accept=".srt"
      acceptLabel="Accepts .srt files"
      convert={(content) => {
        const vtt = convertSrtToVtt(content);
        if (!vtt || vtt.trim() === "WEBVTT\n") throw new Error("No content found");
        return vtt;
      }}
      outputExtension="vtt"
    />
  );
}
