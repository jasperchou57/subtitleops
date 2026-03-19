/**
 * Lightweight trace ID system for client-side debugging.
 * Each conversion operation gets a unique trace ID.
 * On error, the trace ID is shown to the user and logged to console.
 */

let counter = 0;

export function generateTraceId(): string {
  counter++;
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `t-${timestamp}-${random}-${counter}`;
}

export interface TraceLog {
  traceId: string;
  tool: string;
  action: "convert" | "download" | "error";
  timestamp: number;
  fileName?: string;
  fileSize?: number;
  inputFormat?: string;
  outputFormat?: string;
  duration?: number;
  entryCount?: number;
  error?: string;
}

const MAX_LOGS = 50;
const LOG_KEY = "subtitleops_trace_logs";

export function logTrace(entry: TraceLog): void {
  // Console log for dev debugging
  if (entry.action === "error") {
    console.error(`[SubtitleOps] ${entry.traceId}`, entry);
  } else {
    console.log(`[SubtitleOps] ${entry.traceId}`, entry);
  }

  // Persist to localStorage (ring buffer of last 50 entries)
  try {
    const existing = JSON.parse(localStorage.getItem(LOG_KEY) || "[]") as TraceLog[];
    existing.push(entry);
    if (existing.length > MAX_LOGS) {
      existing.splice(0, existing.length - MAX_LOGS);
    }
    localStorage.setItem(LOG_KEY, JSON.stringify(existing));
  } catch {
    // localStorage not available, fail silently
  }
}

/**
 * Get recent trace logs (for debugging in console)
 * Usage: In browser console, run: SubtitleOps.getTraceLogs()
 */
export function getTraceLogs(): TraceLog[] {
  try {
    return JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
  } catch {
    return [];
  }
}

// Expose to window for console debugging
if (typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).SubtitleOps = {
    getTraceLogs,
    clearLogs: () => {
      localStorage.removeItem(LOG_KEY);
      console.log("[SubtitleOps] Trace logs cleared");
    },
  };
}
