/**
 * GA4 event tracking for SubtitleOps.
 * Keep event names small and stable; use parameters for product context.
 * Never send file names, subtitle text, email addresses, or other user input.
 */

type AnalyticsPrimitive = string | number | boolean;

type AnalyticsItem = Record<string, AnalyticsPrimitive | undefined>;

export type AnalyticsParams = Record<
  string,
  | AnalyticsPrimitive
  | AnalyticsPrimitive[]
  | AnalyticsItem
  | AnalyticsItem[]
  | undefined
>;

type Gtag = (
  command: 'event',
  eventName: string,
  parameters?: AnalyticsParams
) => void;

type ToolEvent = {
  tool: string;
  action:
    | 'convert_success'
    | 'convert_error'
    | 'file_download'
    | 'file_upload'
    | 'paste_start'
    | 'convert_click'
    | 'settings_changed'
    | 'copy_output'
    | 'copy_error';
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

export type UiInteraction = {
  element_id: string;
  element_type: string;
  ui_area: string;
  page_path: string;
  destination_path?: string;
  link_domain?: string;
};

export type SaasEventName =
  | 'pricing_view'
  | 'plan_interval_changed'
  | 'beta_intent'
  | 'beta_joined'
  | 'checkout_error'
  | 'subscription_success'
  | 'limit_reached';

const MAX_PARAMETER_LENGTH = 100;
const startedTools = new Set<string>();

function sendEvent(eventName: string, parameters: AnalyticsParams = {}): void {
  if (typeof window === 'undefined') return;

  const safeParameters = Object.fromEntries(
    Object.entries(parameters)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [
        key,
        typeof value === 'string'
          ? value.slice(0, MAX_PARAMETER_LENGTH)
          : value,
      ])
  ) as AnalyticsParams;

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${eventName}`, safeParameters);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag || ((...args: unknown[]) => window.dataLayer?.push(args));
  (window.gtag as Gtag)('event', eventName, safeParameters);
}

function getToolParameters(event: ToolEvent): AnalyticsParams {
  return {
    tool_id: toAnalyticsId(event.tool),
    page_path:
      typeof window === 'undefined' ? undefined : window.location.pathname,
    input_format: event.input_format,
    output_format: event.output_format,
    file_size: event.file_size,
    entry_count: event.entry_count,
    duration_ms: event.duration_ms,
    error_code: event.error_type
      ? toAnalyticsErrorCode(event.error_type)
      : undefined,
    setting_name: event.setting_name
      ? toAnalyticsId(event.setting_name)
      : undefined,
    setting_value: event.setting_value,
  };
}

function markToolStarted(
  event: ToolEvent,
  entryAction: 'file_upload' | 'paste_start' | 'convert_click'
) {
  if (startedTools.has(event.tool)) return;

  startedTools.add(event.tool);
  sendEvent('tool_start', {
    tool_id: toAnalyticsId(event.tool),
    page_path:
      typeof window === 'undefined' ? undefined : window.location.pathname,
    entry_action: entryAction,
  });
}

function trackToolEvent(event: ToolEvent): void {
  const parameters = getToolParameters(event);

  switch (event.action) {
    case 'file_upload':
      markToolStarted(event, 'file_upload');
      sendEvent('file_upload', parameters);
      return;
    case 'paste_start':
      markToolStarted(event, 'paste_start');
      sendEvent('paste_start', parameters);
      return;
    case 'convert_click':
      markToolStarted(event, 'convert_click');
      sendEvent('conversion_start', parameters);
      return;
    case 'convert_success':
      sendEvent('preview_ready', parameters);
      startedTools.delete(event.tool);
      return;
    case 'convert_error':
      sendEvent('conversion_error', parameters);
      startedTools.delete(event.tool);
      return;
    default:
      sendEvent(event.action, parameters);
  }
}

export function trackEvent(event: ToolEvent): void;
export function trackEvent(
  eventName: string,
  parameters?: AnalyticsParams
): void;
export function trackEvent(
  eventOrName: ToolEvent | string,
  parameters: AnalyticsParams = {}
): void {
  if (typeof eventOrName === 'string') {
    sendEvent(eventOrName, parameters);
    return;
  }

  trackToolEvent(eventOrName);
}

export function trackUiInteraction(event: UiInteraction): void {
  sendEvent('ui_click', event);
}

export function trackSaasEvent(
  eventName: SaasEventName,
  parameters: AnalyticsParams = {}
): void {
  sendEvent(eventName, parameters);
}

export function toAnalyticsId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 64);
}

function toAnalyticsErrorCode(value: string): string {
  return /^[a-z0-9_-]{1,64}$/i.test(value)
    ? toAnalyticsId(value)
    : 'conversion_failed';
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[][];
  }
}
