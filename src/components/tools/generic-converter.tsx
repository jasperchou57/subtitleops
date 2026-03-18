"use client";

import { useRef, useState } from "react";
import { FileDropzone } from "./file-dropzone";
import { ConversionResult } from "./conversion-result";

interface GenericConverterProps {
  accept: string;
  acceptLabel: string;
  convert: (content: string) => string;
  outputExtension: string;
  /** Number of preview lines to show */
  previewLines?: number;
}

export function GenericConverter({
  accept,
  acceptLabel,
  convert,
  outputExtension,
  previewLines = 12,
}: GenericConverterProps) {
  const [result, setResult] = useState<{
    originalPreview: string;
    convertedPreview: string;
    fileName: string;
    fullOutput: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);
    setResult(null);

    try {
      const text = await file.text();
      const output = convert(text);

      if (!output || output.trim().length === 0) {
        setError("No content could be extracted. Please check if this is a valid subtitle file.");
        return;
      }

      const originalLines = text.split(/\r?\n/).slice(0, previewLines).join("\n");
      const outputPreviewLines = output.split(/\r?\n/).slice(0, previewLines).join("\n");

      setResult({
        originalPreview: originalLines + (text.split(/\r?\n/).length > previewLines ? "\n..." : ""),
        convertedPreview: outputPreviewLines + (output.split(/\r?\n/).length > previewLines ? "\n..." : ""),
        fileName: file.name,
        fullOutput: output,
      });

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      setError("Failed to process the file. Please check the file format.");
    }
  };

  return (
    <div>
      <FileDropzone accept={accept} acceptLabel={acceptLabel} onFileSelect={handleFileSelect} />

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
            fileName={result.fileName}
            downloadContent={result.fullOutput}
            downloadFileName={result.fileName.replace(/\.[^.]+$/, `.${outputExtension}`)}
          />
        )}
      </div>
    </div>
  );
}
