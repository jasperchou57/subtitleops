"use client";

import { GenericConverter } from "@/components/tools/generic-converter";
import { convertSrtToVtt } from "@/lib/converters/srt-to-vtt";

export function SrtToVttConverter() {
  return (
    <GenericConverter
      toolId="srt-to-vtt"
      accept=".srt"
      acceptLabel="Accepts .srt files"
      convert={(content) => {
        const vtt = convertSrtToVtt(content);
        const cueBody = vtt.replace(/^WEBVTT\s*/i, "").trim();
        if (!cueBody) throw new Error("No subtitle cues found");
        return vtt;
      }}
      outputExtension="vtt"
    />
  );
}
