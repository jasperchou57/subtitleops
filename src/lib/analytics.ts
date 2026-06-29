/**
 * GA4 custom event tracking for SubtitleOps.
 * Events are only sent if gtag is loaded (production with GA4 script).
 * In development, events are logged to console instead.
 */

type GtagEvent = {
  tool: string;
  action:
    | "convert_success"
    | "convert_error"
    | "file_download"
    | "file_upload"
    | "paste_start"
    | "convert_click"
    | "settings_changed";
  input_format?: string;
  output_format?: string;
  file_size?: number;
  entry_count?: number;
  duration_ms?: number;
  error_type?: string;
  trace_id?: string;
  setting_name?: string;
  setting_value?: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(event: GtagEvent): void {
  const eventName = `subtitleops_${event.action}`;

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, {
      tool: event.tool,
      input_format: event.input_format,
      output_format: event.output_format,
      file_size: event.file_size,
      entry_count: event.entry_count,
      duration_ms: event.duration_ms,
      error_type: event.error_type,
      trace_id: event.trace_id,
      setting_name: event.setting_name,
      setting_value: event.setting_value,
    });
  } else if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${eventName}`, event);
  }
}
