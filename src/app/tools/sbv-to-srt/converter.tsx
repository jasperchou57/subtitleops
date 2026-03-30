"use client";

import { GenericConverter } from "@/components/tools/generic-converter";
import { convertSbvToSrt } from "@/lib/converters/sbv-to-srt";

export function SbvToSrtConverter() {
  return (
    <GenericConverter
      toolId="sbv-to-srt"
      accept=".sbv"
      acceptLabel="Accepts .sbv files"
      convert={convertSbvToSrt}
      outputExtension="srt"
    />
  );
}
