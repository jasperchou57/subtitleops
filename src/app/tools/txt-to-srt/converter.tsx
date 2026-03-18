"use client";

import { GenericConverter } from "@/components/tools/generic-converter";
import { convertTxtToSrt } from "@/lib/converters/txt-to-srt";
import { formatSrt } from "@/lib/converters/ass-to-srt";

export function TxtToSrtConverter() {
  return (
    <GenericConverter
      accept=".txt"
      acceptLabel="Accepts .txt files"
      convert={(content) => {
        const entries = convertTxtToSrt(content);
        if (entries.length === 0) throw new Error("No text lines found");
        return formatSrt(entries);
      }}
      outputExtension="srt"
    />
  );
}
