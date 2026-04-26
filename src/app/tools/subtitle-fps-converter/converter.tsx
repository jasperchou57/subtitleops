"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { detectTimingFormat, convertFps, COMMON_FPS, type TimingFormat } from "@/lib/timing";
import { generateTraceId, logTrace } from "@/lib/trace";
import { trackEvent } from "@/lib/analytics";

const TOOL_ID = "subtitle-fps-converter";
const CUSTOM = "custom";

export function SubtitleFpsConverter() {
  const [file, setFile] = useState<{ name: string; content: string } | null>(null);
  const [format, setFormat] = useState<TimingFormat | null>(null);
  const [sourceFps, setSourceFps] = useState<string>("23.976");
  const [targetFps, setTargetFps] = useState<string>("25");
  const [customSource, setCustomSource] = useState<string>("");
  const [customTarget, setCustomTarget] = useState<string>("");
  const [result, setResult] = useState<{
    originalPreview: string;
    convertedPreview: string;
    full: string;
    cueCount: number;
    clampedCount: number;
    ratio: number;
  } | null>(null);
  const [error, setError] = useState<{ message: string; traceId: string } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const resolvedSource = sourceFps === CUSTOM ? parseFloat(customSource) : parseFloat(sourceFps);
  const resolvedTarget = targetFps === CUSTOM ? parseFloat(customTarget) : parseFloat(targetFps);
  const ratio = useMemo(() => {
    if (!isFinite(resolvedSource) || !isFinite(resolvedTarget) || resolvedSource <= 0 || resolvedTarget <= 0) {
      return null;
    }
    return resolvedSource / resolvedTarget;
  }, [resolvedSource, resolvedTarget]);

  const handleFile = useCallback(async (f: File) => {
    setError(null);
    setResult(null);

    const content = await f.text();
    const detected = detectTimingFormat(content, f.name);

    if (!detected) {
      const traceId = generateTraceId();
      logTrace({ traceId, tool: TOOL_ID, action: "error", timestamp: Date.now(), fileName: f.name, error: "unsupported_format" });
      trackEvent({ tool: TOOL_ID, action: "convert_error", error_type: "unsupported_format", trace_id: traceId });
      setError({ message: "Only SRT and VTT files are supported by the FPS converter.", traceId });
      return;
    }

    setFile({ name: f.name, content });
    setFormat(detected);
  }, []);

  const handleConvert = useCallback(() => {
    if (!file || !format) return;
    if (!isFinite(resolvedSource) || resolvedSource <= 0 || !isFinite(resolvedTarget) || resolvedTarget <= 0) {
      const traceId = generateTraceId();
      setError({ message: "Source and target FPS must be positive numbers.", traceId });
      return;
    }
    if (resolvedSource === resolvedTarget) {
      const traceId = generateTraceId();
      setError({
        message: "Source and target FPS are the same — nothing to rescale. Pick different values.",
        traceId,
      });
      return;
    }

    setError(null);
    const traceId = generateTraceId();
    const startTime = performance.now();

    try {
      const res = convertFps(file.content, format, resolvedSource, resolvedTarget);
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
        entryCount: res.cueCount,
      });
      trackEvent({
        tool: TOOL_ID,
        action: "convert_success",
        input_format: format,
        output_format: format,
        file_size: file.content.length,
        entry_count: res.cueCount,
        duration_ms: duration,
        trace_id: traceId,
      });

      const originalLines = file.content.split(/\r?\n/).slice(0, 12).join("\n");
      const convertedLines = res.output.split(/\r?\n/).slice(0, 12).join("\n");

      setResult({
        originalPreview: originalLines + (file.content.split(/\r?\n/).length > 12 ? "\n..." : ""),
        convertedPreview: convertedLines + (res.output.split(/\r?\n/).length > 12 ? "\n..." : ""),
        full: res.output,
        cueCount: res.cueCount,
        clampedCount: res.clampedCount,
        ratio: res.ratio,
      });

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      const errorType = err instanceof Error ? err.message : "fps_conversion_failed";
      logTrace({ traceId, tool: TOOL_ID, action: "error", timestamp: Date.now(), fileName: file.name, error: errorType });
      trackEvent({ tool: TOOL_ID, action: "convert_error", error_type: errorType, trace_id: traceId });
      setError({ message: "FPS conversion failed. Please check the file and FPS values.", traceId });
    }
  }, [file, format, resolvedSource, resolvedTarget]);

  const handleDownload = useCallback(() => {
    if (!result || !file) return;
    const blob = new Blob([result.full], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const label = `${resolvedSource}to${resolvedTarget}fps`.replace(/\./g, "p");
    a.download = file.name.replace(/\.[^.]+$/, "") + `.${label}.${format}`;
    a.click();
    URL.revokeObjectURL(url);

    trackEvent({
      tool: TOOL_ID,
      action: "file_download",
      output_format: format || undefined,
      file_size: result.full.length,
    });
  }, [result, file, format, resolvedSource, resolvedTarget]);

  const handleReset = useCallback(() => {
    setFile(null);
    setFormat(null);
    setResult(null);
    setError(null);
  }, []);

  const renderFpsSelect = (id: string, value: string, setValue: (v: string) => void) => (
    <select
      id={id}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full h-10 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
    >
      {COMMON_FPS.map((fps) => (
        <option key={fps.value} value={fps.value.toString()}>
          {fps.label}
        </option>
      ))}
      <option value={CUSTOM}>Custom…</option>
    </select>
  );

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
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
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

          <div className="grid gap-4 md:grid-cols-2 mb-3">
            <div>
              <label htmlFor="source-fps" className="block text-sm font-medium mb-2">Source FPS</label>
              {renderFpsSelect("source-fps", sourceFps, setSourceFps)}
              {sourceFps === CUSTOM && (
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.001"
                  min="1"
                  value={customSource}
                  onChange={(e) => setCustomSource(e.target.value)}
                  placeholder="e.g. 23.976"
                  className="mt-2 w-full h-10 rounded-lg border bg-background px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
              )}
            </div>
            <div>
              <label htmlFor="target-fps" className="block text-sm font-medium mb-2">Target FPS</label>
              {renderFpsSelect("target-fps", targetFps, setTargetFps)}
              {targetFps === CUSTOM && (
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.001"
                  min="1"
                  value={customTarget}
                  onChange={(e) => setCustomTarget(e.target.value)}
                  placeholder="e.g. 25"
                  className="mt-2 w-full h-10 rounded-lg border bg-background px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
              )}
            </div>
          </div>

          <p className="mb-6 text-xs text-muted-foreground">
            Rescales every timestamp by <span className="font-mono">source / target</span>
            {ratio !== null && (
              <>
                {" "}— current ratio <span className="font-mono">{ratio.toFixed(5)}</span>
                {ratio < 1 ? " (faster playback, cues pulled earlier)" : " (slower playback, cues pushed later)"}
              </>
            )}
            .
          </p>

          <button
            onClick={handleConvert}
            className="w-full rounded-xl bg-foreground text-background py-3 text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            Convert FPS
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
                    Rescaled {result.cueCount} {result.cueCount === 1 ? "cue" : "cues"} by ratio {result.ratio.toFixed(5)}
                  </p>
                </div>

                {result.clampedCount > 0 && (
                  <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50/80 p-3 text-sm text-amber-800">
                    <span className="font-semibold">Heads up:</span> {result.clampedCount} timestamp
                    {result.clampedCount === 1 ? "" : "s"} rounded below zero. If your first cues look wrong,
                    check that you have the source and target the right way around.
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4 mb-5">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Original</p>
                    <pre className="rounded-lg bg-muted/50 p-3 text-xs leading-relaxed overflow-auto max-h-48 font-mono">{result.originalPreview}</pre>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Rescaled</p>
                    <pre className="rounded-lg bg-muted/50 p-3 text-xs leading-relaxed overflow-auto max-h-48 font-mono">{result.convertedPreview}</pre>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Save rescaled .{format} file
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
