"use client";

import { useRef, useState } from "react";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { ConversionResult } from "@/components/tools/conversion-result";
import { convertAssToSrt, formatSrt } from "@/lib/converters/ass-to-srt";

export function AssToSrtConverter() {
  const [result, setResult] = useState<{
    originalPreview: string;
    convertedPreview: string;
    fileName: string;
    fullSrt: string;
    entryCount: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);
    setResult(null);

    try {
      const text = await file.text();
      const entries = convertAssToSrt(text);

      if (entries.length === 0) {
        setError("No dialogue entries found. Please make sure this is a valid ASS/SSA file.");
        return;
      }

      const fullSrt = formatSrt(entries);
      const originalLines = text.split(/\r?\n/).slice(0, 12).join("\n");
      const previewLines = fullSrt.split("\n").slice(0, 12).join("\n");

      setResult({
        originalPreview: originalLines + (text.split(/\r?\n/).length > 12 ? "\n..." : ""),
        convertedPreview: previewLines + (entries.length > 2 ? "\n..." : ""),
        fileName: file.name,
        fullSrt,
        entryCount: entries.length,
      });

      // Scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      setError("Failed to parse the file. Please check if it is a valid ASS/SSA subtitle file.");
    }
  };

  return (
    <div>
      <FileDropzone
        accept=".ass,.ssa"
        acceptLabel="Accepts .ass and .ssa files"
        onFileSelect={handleFileSelect}
      />

      {error && (
        <div className="mt-4 rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div ref={resultRef}>
        {result && (
          <ConversionResult
            originalPreview={result.originalPreview}
            convertedPreview={result.convertedPreview}
            fileName={`${result.fileName} (${result.entryCount} entries)`}
            downloadContent={result.fullSrt}
            downloadFileName={result.fileName.replace(/\.(ass|ssa)$/i, ".srt")}
          />
        )}
      </div>
    </div>
  );
}
