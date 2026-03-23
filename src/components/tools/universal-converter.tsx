"use client";

import { useCallback, useRef, useState } from "react";
import { detectFormat, getAvailableOutputFormats, formatLabels, type SubtitleFormat } from "@/lib/converters/detect-format";
import { universalConvert } from "@/lib/converters/universal";
import { generateTraceId, logTrace } from "@/lib/trace";
import { trackEvent } from "@/lib/analytics";

export function UniversalConverter() {
  const [file, setFile] = useState<{ name: string; content: string } | null>(null);
  const [inputFormat, setInputFormat] = useState<SubtitleFormat | null>(null);
  const [outputFormat, setOutputFormat] = useState<SubtitleFormat>("srt");
  const [result, setResult] = useState<{ preview: string; full: string; originalPreview: string } | null>(null);
  const [error, setError] = useState<{ message: string; traceId: string } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleFile = useCallback(async (f: File) => {
    setError(null);
    setResult(null);

    const content = await f.text();
    const detected = detectFormat(content, f.name);
    setFile({ name: f.name, content });
    setInputFormat(detected);

    // Auto-select first available output format
    const available = getAvailableOutputFormats(detected);
    if (available.length > 0) {
      setOutputFormat(available[0].value);
    }
  }, []);

  const handleConvert = useCallback(() => {
    if (!file || !inputFormat) return;
    setError(null);
    const traceId = generateTraceId();
    const startTime = performance.now();

    try {
      const output = universalConvert(file.content, inputFormat, outputFormat);
      const duration = Math.round(performance.now() - startTime);

      if (!output.trim()) {
        logTrace({ traceId, tool: "universal", action: "error", timestamp: Date.now(), fileName: file.name, error: "empty_output" });
        trackEvent({ tool: "universal", action: "convert_error", error_type: "empty_output", trace_id: traceId });
        setError({ message: "No content could be converted. Please check the file.", traceId });
        return;
      }

      logTrace({ traceId, tool: "universal", action: "convert", timestamp: Date.now(), fileName: file.name, inputFormat, outputFormat, duration });
      trackEvent({ tool: "universal", action: "convert_success", input_format: inputFormat, output_format: outputFormat, file_size: file.content.length, duration_ms: duration, trace_id: traceId });

      const originalLines = file.content.split(/\r?\n/).slice(0, 10).join("\n");
      const outputLines = output.split(/\r?\n/).slice(0, 10).join("\n");

      setResult({
        originalPreview: originalLines + (file.content.split(/\r?\n/).length > 10 ? "\n..." : ""),
        preview: outputLines + (output.split(/\r?\n/).length > 10 ? "\n..." : ""),
        full: output,
      });

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      const errTraceId = generateTraceId();
      logTrace({ traceId: errTraceId, tool: "universal", action: "error", timestamp: Date.now(), fileName: file?.name || "unknown", error: "conversion_failed" });
      trackEvent({ tool: "universal", action: "convert_error", error_type: "conversion_failed", trace_id: errTraceId });
      setError({ message: "Conversion failed. Please check if the file format is valid.", traceId: errTraceId });
    }
  }, [file, inputFormat, outputFormat]);

  const handleDownload = useCallback(() => {
    if (!result || !file) return;
    const blob = new Blob([result.full], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(/\.[^.]+$/, `.${outputFormat}`);
    a.click();
    URL.revokeObjectURL(url);
  }, [result, file, outputFormat]);

  const handleReset = useCallback(() => {
    setFile(null);
    setInputFormat(null);
    setResult(null);
    setError(null);
  }, []);

  const availableOutputs = inputFormat ? getAvailableOutputFormats(inputFormat) : [];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!file ? (
        /* ===== Dropzone ===== */
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
          }}
          className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 md:p-16 transition-all cursor-pointer ${
            isDragOver
              ? "border-blue-400 bg-blue-50/50 scale-[1.01]"
              : "border-border hover:border-blue-300 hover:bg-muted/20"
          }`}
        >
          <input
            type="file"
            accept=".srt,.ass,.ssa,.vtt,.txt"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 mb-4">
            <svg className="h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <p className="text-base font-medium">
            {isDragOver ? "Drop your file here" : "Drop any subtitle file here"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            SRT, ASS, VTT, TXT &middot; Auto-detected
          </p>
        </div>
      ) : (
        /* ===== File loaded — format selector + convert ===== */
        <div className="rounded-2xl border bg-card p-6 md:p-8 animate-in fade-in duration-300">
          {/* File info */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-sm font-mono font-bold uppercase">
              {inputFormat}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                Detected as {inputFormat ? formatLabels[inputFormat] : "unknown"}
              </p>
            </div>
            <button onClick={handleReset} className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4">
              Change file
            </button>
          </div>

          {/* Format selector */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-medium shrink-0">Convert to:</span>
            <div className="flex gap-2 flex-wrap">
              {availableOutputs.map((fmt) => (
                <button
                  key={fmt.value}
                  onClick={() => { setOutputFormat(fmt.value); setResult(null); }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    outputFormat === fmt.value
                      ? "bg-foreground text-background"
                      : "border hover:bg-accent"
                  }`}
                >
                  {fmt.value.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Convert button */}
          <button
            onClick={handleConvert}
            className="w-full rounded-xl bg-foreground text-background py-3 text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            Convert to {outputFormat.toUpperCase()}
          </button>

          {error && (
            <div className="mt-4 rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
              <p>{error.message}</p>
              <p className="mt-1 text-xs text-muted-foreground font-mono">Trace ID: {error.traceId}</p>
            </div>
          )}

          {/* Result */}
          <div ref={resultRef}>
            {result && (
              <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <p className="font-medium text-green-700">Converted successfully!</p>
                </div>

                {/* Before / After */}
                <div className="grid md:grid-cols-2 gap-4 mb-5">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Original ({inputFormat?.toUpperCase()})</p>
                    <pre className="rounded-lg bg-muted/50 p-3 text-xs leading-relaxed overflow-auto max-h-40 font-mono">{result.originalPreview}</pre>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Converted ({outputFormat.toUpperCase()})</p>
                    <pre className="rounded-lg bg-muted/50 p-3 text-xs leading-relaxed overflow-auto max-h-40 font-mono">{result.preview}</pre>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Save .{outputFormat} file
                </button>
                <p className="mt-2 text-xs text-muted-foreground">
                  Your file is processed locally and won&apos;t be available after you leave this page.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
