"use client";

import { GenericConverter } from "@/components/tools/generic-converter";
import { convertSrtToAss } from "@/lib/converters/srt-to-ass";

export function SrtToAssConverter() {
  return (
    <GenericConverter
      toolId="srt-to-ass"
      accept=".srt"
      acceptLabel="Accepts .srt files"
      convert={convertSrtToAss}
      outputExtension="ass"
    />
  );
}
