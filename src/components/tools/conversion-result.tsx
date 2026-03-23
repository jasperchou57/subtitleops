"use client";

import { logTrace } from "@/lib/trace";
import { trackEvent } from "@/lib/analytics";

interface SubtitleStats {
  entryCount: number;
  duration: string;
  longLineCount: number;
}

function analyzeOutput(content: string, format: string): SubtitleStats {
  const lines = content.split(/\r?\n/);

  // Count entries
  let entryCount = 0;
  if (format === "txt") {
    entryCount = lines.filter((l) => l.trim()).length;
  } else {
    entryCount = content.split(/\n\s*\n/).filter(Boolean).length;
  }

  // Find last timestamp for duration
  let duration = "";
  const timestamps = content.match(/(\d{2}:\d{2}:\d{2})/g);
  if (timestamps && timestamps.length >= 2) {
    duration = timestamps[timestamps.length - 1];
  }

  // Count lines exceeding 42 characters (subtitle best practice)
  const textLines = lines.filter(
    (l) =>
      l.trim() &&
      !/^\d+$/.test(l.trim()) &&
      !/-->/.test(l) &&
      !/^WEBVTT/.test(l)
  );
  const longLineCount = textLines.filter((l) => l.trim().length > 42).length;

  return { entryCount, duration, longLineCount };
}

interface ConversionResultProps {
  originalPreview: string;
  convertedPreview: string;
  fileName: string;
  downloadContent: string;
  downloadFileName: string;
  traceId?: string;
  toolId?: string;
  outputFormat?: string;
  /** Optional workflow push shown below download */
  workflowPush?: React.ReactNode;
}

export function ConversionResult({
  originalPreview,
  convertedPreview,
  fileName,
  downloadContent,
  downloadFileName,
  traceId,
  toolId,
  outputFormat,
  workflowPush,
}: ConversionResultProps) {
  const handleDownload = () => {
    const blob = new Blob([downloadContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadFileName;
    a.click();
    URL.revokeObjectURL(url);

    // Track download
    if (traceId) {
      logTrace({
        traceId,
        tool: toolId || "unknown",
        action: "download",
        timestamp: Date.now(),
        fileName: downloadFileName,
      });
    }
    trackEvent({
      tool: toolId || "unknown",
      action: "file_download",
      output_format: outputFormat,
      file_size: downloadContent.length,
      trace_id: traceId,
    });
  };

  const ext = downloadFileName.split(".").pop() || "file";
  const stats = analyzeOutput(downloadContent, outputFormat || ext);

  return (
    <div className="mt-6 rounded-xl border bg-card p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="font-medium text-green-700">
          Converted successfully!
        </p>
        <span className="text-sm text-muted-foreground ml-auto">{fileName}</span>
      </div>

      {/* Subtitle Report */}
      <div className="mb-5 rounded-lg bg-muted/30 px-4 py-3 text-sm space-y-1">
        <p className="text-foreground">
          <span className="text-green-600 mr-1.5">&#10003;</span>
          {stats.entryCount} subtitle {stats.entryCount === 1 ? "entry" : "entries"}
          {stats.duration && <span className="text-muted-foreground"> &middot; {stats.duration} total duration</span>}
        </p>
        {stats.longLineCount > 0 && (
          <p className="text-amber-600">
            <span className="mr-1.5">&#9888;</span>
            {stats.longLineCount} {stats.longLineCount === 1 ? "line exceeds" : "lines exceed"} 42 characters — may overflow on small screens
          </p>
        )}
      </div>

      {/* Before / After preview */}
      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Original</p>
          <pre className="rounded-lg bg-muted/50 p-3 text-xs leading-relaxed overflow-auto max-h-48 font-mono">
            {originalPreview}
          </pre>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Converted ({ext.toUpperCase()})</p>
          <pre className="rounded-lg bg-muted/50 p-3 text-xs leading-relaxed overflow-auto max-h-48 font-mono">
            {convertedPreview}
          </pre>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Save .{ext} file
      </button>
      <p className="mt-2 text-xs text-muted-foreground">
        Your file is processed locally and won&apos;t be available after you leave this page.
      </p>

      {/* Workflow push */}
      {workflowPush && <div className="mt-5">{workflowPush}</div>}
    </div>
  );
}
