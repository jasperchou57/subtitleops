"use client";

import { useCallback, useRef, useState } from "react";
import { detectTimingFormat, shiftSubtitles, type TimingFormat } from "@/lib/timing";
import { generateTraceId, logTrace } from "@/lib/trace";
import { trackEvent } from "@/lib/analytics";

const TOOL_ID = "subtitle-shift";

export function SubtitleShiftConverter() {
  const [file, setFile] = useState<{ name: string; content: string } | null>(null);
  const [format, setFormat] = useState<TimingFormat | null>(null);
  const [shiftInput, setShiftInput] = useState<string>("0");
  const [result, setResult] = useState<{
    originalPreview: string;
    shiftedPreview: string;
    full: string;
    cueCount: number;
    clampedCount: number;
  } | null>(null);
  const [error, setError] = useState<{ message: string; traceId: string } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleFile = useCallback(async (f: File) => {
    setError(null);
    setResult(null);

    const content = await f.text();
    const detected = detectTimingFormat(content, f.name);

    if (!detected) {
      const traceId = generateTraceId();
      logTrace({ traceId, tool: TOOL_ID, action: "error", timestamp: Date.now(), fileName: f.name, error: "unsupported_format" });
      trackEvent({ tool: TOOL_ID, action: "convert_error", error_type: "unsupported_format", trace_id: traceId });
      setError({ message: "Only SRT and VTT files are supported by the timing shift tool.", traceId });
      return;
    }

    setFile({ name: f.name, content });
    setFormat(detected);
  }, []);

  const handleShift = useCallback(() => {
    if (!file || !format) return;
    const seconds = parseFloat(shiftInput);
    if (!isFinite(seconds)) {
      const traceId = generateTraceId();
      setError({ message: "Enter a valid number of seconds (e.g. 2.5 or -1.25).", traceId });
      return;
    }
    if (seconds === 0) {
      const traceId = generateTraceId();
      setError({ message: "Shift is zero — nothing to change. Enter a non-zero value.", traceId });
      return;
    }

    setError(null);
    const traceId = generateTraceId();
    const startTime = performance.now();

    try {
      const shiftMs = Math.round(seconds * 1000);
      const { output, cueCount, clampedCount } = shiftSubtitles(file.content, format, shiftMs);
      const duration = Math.round(performance.now() - startTime);

      logTrace({
        traceId,
        tool: TOOL_ID,
        action: "convert",
        timestamp: Date.now(),
        fileName: file.name,
        inputFormat: format,
        outputFormat: format,
        duration,
        entryCount: cueCount,
      });
      trackEvent({
        tool: TOOL_ID,
        action: "convert_success",
        input_format: format,
        output_format: format,
        file_size: file.content.length,
        entry_count: cueCount,
        duration_ms: duration,
        trace_id: traceId,
      });

      const originalLines = file.content.split(/\r?\n/).slice(0, 12).join("\n");
      const shiftedLines = output.split(/\r?\n/).slice(0, 12).join("\n");

      setResult({
        originalPreview: originalLines + (file.content.split(/\r?\n/).length > 12 ? "\n..." : ""),
        shiftedPreview: shiftedLines + (output.split(/\r?\n/).length > 12 ? "\n..." : ""),
        full: output,
        cueCount,
        clampedCount,
      });

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      const errorType = err instanceof Error ? err.message : "shift_failed";
      logTrace({ traceId, tool: TOOL_ID, action: "error", timestamp: Date.now(), fileName: file.name, error: errorType });
      trackEvent({ tool: TOOL_ID, action: "convert_error", error_type: errorType, trace_id: traceId });
      setError({ message: "Timing shift failed. Please check that the file is a valid SRT or VTT subtitle file.", traceId });
    }
  }, [file, format, shiftInput]);

  const handleDownload = useCallback(() => {
    if (!result || !file) return;
    const blob = new Blob([result.full], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const seconds = parseFloat(shiftInput);
    const sign = seconds >= 0 ? "plus" : "minus";
    const absLabel = Math.abs(seconds).toFixed(3).replace(/\.?0+$/, "").replace(".", "p");
    a.download = file.name.replace(/\.[^.]+$/, "") + `.shifted-${sign}${absLabel}s.${format}`;
    a.click();
    URL.revokeObjectURL(url);

    trackEvent({
      tool: TOOL_ID,
      action: "file_download",
      output_format: format || undefined,
      file_size: result.full.length,
    });
  }, [result, file, shiftInput, format]);

  const handleReset = useCallback(() => {
    setFile(null);
    setFormat(null);
    setResult(null);
    setError(null);
    setShiftInput("0");
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!file ? (
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
            accept=".srt,.vtt"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 mb-4">
            <svg className="h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-base font-medium">
            {isDragOver ? "Drop your file here" : "Drop your SRT or VTT file"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Accepts .srt and .vtt &middot; runs in your browser
          </p>

          {error && (
            <div className="mt-6 w-full rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
              <p>{error.message}</p>
              <p className="mt-1 text-xs text-muted-foreground font-mono">Trace ID: {error.traceId}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border bg-card p-6 md:p-8 animate-in fade-in duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-sm font-mono font-bold uppercase">
              {format}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                Detected as {format?.toUpperCase()} subtitle file
              </p>
            </div>
            <button onClick={handleReset} className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4">
              Change file
            </button>
          </div>

          <div className="mb-6">
            <label htmlFor="shift-seconds" className="block text-sm font-medium mb-2">
              Shift by (seconds)
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setShiftInput((v) => (Math.round(((parseFloat(v) || 0) - 0.5) * 1000) / 1000).toString())
                }
                className="h-10 w-10 rounded-lg border text-lg font-semibold hover:bg-accent transition-colors"
                aria-label="Decrease by 0.5 seconds"
              >
                &minus;
              </button>
              <input
                id="shift-seconds"
                type="number"
                inputMode="decimal"
                step="0.1"
                value={shiftInput}
                onChange={(e) => setShiftInput(e.target.value)}
                className="flex-1 h-10 rounded-lg border bg-background px-3 text-center text-base font-mono focus:outline-none focus:ring-2 focus:ring-foreground/20"
                placeholder="0"
              />
              <button
                type="button"
                onClick={() =>
                  setShiftInput((v) => (Math.round(((parseFloat(v) || 0) + 0.5) * 1000) / 1000).toString())
                }
                className="h-10 w-10 rounded-lg border text-lg font-semibold hover:bg-accent transition-colors"
                aria-label="Increase by 0.5 seconds"
              >
                +
              </button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Positive values delay subtitles (shift later). Negative values pull them earlier.
              Supports decimals, e.g. <span className="font-mono">2.5</span> or <span className="font-mono">-1.25</span>.
            </p>
          </div>

          <button
            onClick={handleShift}
            className="w-full rounded-xl bg-foreground text-background py-3 text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            Shift subtitles
          </button>

          {error && (
            <div className="mt-4 rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
              <p>{error.message}</p>
              <p className="mt-1 text-xs text-muted-foreground font-mono">Trace ID: {error.traceId}</p>
            </div>
          )}

          <div ref={resultRef}>
            {result && (
              <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <p className="font-medium text-green-700">
                    Shifted {result.cueCount} {result.cueCount === 1 ? "cue" : "cues"} by {parseFloat(shiftInput)}s
                  </p>
                </div>

                {result.clampedCount > 0 && (
                  <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50/80 p-3 text-sm text-amber-800">
                    <span className="font-semibold">Heads up:</span> {result.clampedCount} timestamp
                    {result.clampedCount === 1 ? "" : "s"} went below zero and {result.clampedCount === 1 ? "was" : "were"} clamped to 00:00:00. Your
                    negative shift is larger than the earliest cue in this file.
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4 mb-5">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Original</p>
                    <pre className="rounded-lg bg-muted/50 p-3 text-xs leading-relaxed overflow-auto max-h-48 font-mono">{result.originalPreview}</pre>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Shifted</p>
                    <pre className="rounded-lg bg-muted/50 p-3 text-xs leading-relaxed overflow-auto max-h-48 font-mono">{result.shiftedPreview}</pre>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Save shifted .{format} file
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
