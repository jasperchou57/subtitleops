"use client";

import { useRef, useState } from "react";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { ConversionResult } from "@/components/tools/conversion-result";
import { convertAssToSrt, formatSrt } from "@/lib/converters/ass-to-srt";
import { generateTraceId, logTrace } from "@/lib/trace";
import { trackEvent } from "@/lib/analytics";

export function AssToSrtConverter() {
  const [result, setResult] = useState<{
    originalPreview: string;
    convertedPreview: string;
    fileName: string;
    fullSrt: string;
    entryCount: number;
    traceId: string;
  } | null>(null);
  const [error, setError] = useState<{ message: string; traceId: string } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);
    setResult(null);

    const traceId = generateTraceId();
    const startTime = performance.now();

    trackEvent({
      tool: "ass-to-srt",
      action: "file_upload",
      input_format: file.name.split(".").pop() || "unknown",
      output_format: "srt",
      file_size: file.size,
      trace_id: traceId,
    });

    try {
      const text = await file.text();
      const entries = convertAssToSrt(text);
      const duration = Math.round(performance.now() - startTime);

      if (entries.length === 0) {
        logTrace({
          traceId,
          tool: "ass-to-srt",
          action: "error",
          timestamp: Date.now(),
          fileName: file.name,
          fileSize: file.size,
          duration,
          error: "no_dialogue_entries",
        });
        trackEvent({
          tool: "ass-to-srt",
          action: "convert_error",
          error_type: "no_dialogue_entries",
          file_size: file.size,
          trace_id: traceId,
        });
        setError({
          message: "No dialogue entries found. Please make sure this is a valid ASS/SSA file.",
          traceId,
        });
        return;
      }

      const fullSrt = formatSrt(entries);
      const originalLines = text.split(/\r?\n/).slice(0, 12).join("\n");
      const previewLines = fullSrt.split("\n").slice(0, 12).join("\n");

      logTrace({
        traceId,
        tool: "ass-to-srt",
        action: "convert",
        timestamp: Date.now(),
        fileName: file.name,
        fileSize: file.size,
        inputFormat: "ass",
        outputFormat: "srt",
        duration,
        entryCount: entries.length,
      });

      trackEvent({
        tool: "ass-to-srt",
        action: "convert_success",
        input_format: "ass",
        output_format: "srt",
        file_size: file.size,
        entry_count: entries.length,
        duration_ms: duration,
        trace_id: traceId,
      });

      setResult({
        originalPreview: originalLines + (text.split(/\r?\n/).length > 12 ? "\n..." : ""),
        convertedPreview: previewLines + (entries.length > 2 ? "\n..." : ""),
        fileName: file.name,
        fullSrt,
        entryCount: entries.length,
        traceId,
      });

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      const duration = Math.round(performance.now() - startTime);
      const errorType = err instanceof Error ? err.message : "parse_error";

      logTrace({
        traceId,
        tool: "ass-to-srt",
        action: "error",
        timestamp: Date.now(),
        fileName: file.name,
        fileSize: file.size,
        duration,
        error: errorType,
      });
      trackEvent({
        tool: "ass-to-srt",
        action: "convert_error",
        error_type: errorType,
        file_size: file.size,
        trace_id: traceId,
      });

      setError({
        message: "Failed to parse the file. Please check if it is a valid ASS/SSA subtitle file.",
        traceId,
      });
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
          <p>{error.message}</p>
          <p className="mt-1 text-xs text-muted-foreground font-mono">
            Trace ID: {error.traceId}
          </p>
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
            traceId={result.traceId}
            toolId="ass-to-srt"
            outputFormat="srt"
          />
        )}
      </div>
    </div>
  );
}
