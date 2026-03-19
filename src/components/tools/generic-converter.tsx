"use client";

import { useRef, useState } from "react";
import { FileDropzone } from "./file-dropzone";
import { ConversionResult } from "./conversion-result";
import { generateTraceId, logTrace } from "@/lib/trace";
import { trackEvent } from "@/lib/analytics";

interface GenericConverterProps {
  /** Tool identifier for tracing, e.g. "vtt-to-srt" */
  toolId: string;
  accept: string;
  acceptLabel: string;
  convert: (content: string) => string;
  outputExtension: string;
  previewLines?: number;
}

export function GenericConverter({
  toolId,
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
    traceId: string;
  } | null>(null);
  const [error, setError] = useState<{ message: string; traceId: string } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);
    setResult(null);

    const traceId = generateTraceId();
    const startTime = performance.now();

    // Log file upload
    trackEvent({
      tool: toolId,
      action: "file_upload",
      input_format: file.name.split(".").pop() || "unknown",
      output_format: outputExtension,
      file_size: file.size,
      trace_id: traceId,
    });

    try {
      const text = await file.text();
      const output = convert(text);
      const duration = Math.round(performance.now() - startTime);

      if (!output || output.trim().length === 0) {
        const errMsg = "No content could be extracted. Please check if this is a valid subtitle file.";
        logTrace({
          traceId,
          tool: toolId,
          action: "error",
          timestamp: Date.now(),
          fileName: file.name,
          fileSize: file.size,
          duration,
          error: "empty_output",
        });
        trackEvent({
          tool: toolId,
          action: "convert_error",
          error_type: "empty_output",
          file_size: file.size,
          trace_id: traceId,
        });
        setError({ message: errMsg, traceId });
        return;
      }

      const entryCount = output.split(/\n\s*\n/).filter(Boolean).length;

      logTrace({
        traceId,
        tool: toolId,
        action: "convert",
        timestamp: Date.now(),
        fileName: file.name,
        fileSize: file.size,
        inputFormat: file.name.split(".").pop(),
        outputFormat: outputExtension,
        duration,
        entryCount,
      });

      trackEvent({
        tool: toolId,
        action: "convert_success",
        input_format: file.name.split(".").pop(),
        output_format: outputExtension,
        file_size: file.size,
        entry_count: entryCount,
        duration_ms: duration,
        trace_id: traceId,
      });

      const originalLines = text.split(/\r?\n/).slice(0, previewLines).join("\n");
      const outputPreviewLines = output.split(/\r?\n/).slice(0, previewLines).join("\n");

      setResult({
        originalPreview: originalLines + (text.split(/\r?\n/).length > previewLines ? "\n..." : ""),
        convertedPreview: outputPreviewLines + (output.split(/\r?\n/).length > previewLines ? "\n..." : ""),
        fileName: file.name,
        fullOutput: output,
        traceId,
      });

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      const duration = Math.round(performance.now() - startTime);
      const errorType = err instanceof Error ? err.message : "unknown_error";

      logTrace({
        traceId,
        tool: toolId,
        action: "error",
        timestamp: Date.now(),
        fileName: file.name,
        fileSize: file.size,
        duration,
        error: errorType,
      });

      trackEvent({
        tool: toolId,
        action: "convert_error",
        error_type: errorType,
        file_size: file.size,
        duration_ms: duration,
        trace_id: traceId,
      });

      setError({
        message: "Failed to process the file. Please check the file format.",
        traceId,
      });
    }
  };

  return (
    <div>
      <FileDropzone accept={accept} acceptLabel={acceptLabel} onFileSelect={handleFileSelect} />

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
            fileName={result.fileName}
            downloadContent={result.fullOutput}
            downloadFileName={result.fileName.replace(/\.[^.]+$/, `.${outputExtension}`)}
            traceId={result.traceId}
            toolId={toolId}
            outputFormat={outputExtension}
          />
        )}
      </div>
    </div>
  );
}
