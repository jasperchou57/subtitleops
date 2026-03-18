"use client";

import { GenericConverter } from "@/components/tools/generic-converter";
import { convertSrtToTxt } from "@/lib/converters/srt-to-txt";

export function SrtToTxtConverter() {
  return (
    <GenericConverter
      accept=".srt"
      acceptLabel="Accepts .srt files"
      convert={(content) => {
        const txt = convertSrtToTxt(content);
        if (!txt.trim()) throw new Error("No text content found");
        return txt;
      }}
      outputExtension="txt"
    />
  );
}
