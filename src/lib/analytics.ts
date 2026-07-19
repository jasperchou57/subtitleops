/**
 * GA4 custom event tracking for SubtitleOps.
 * Production events queue until gtag.js is ready.
 * Development events are logged to the console instead.
 */

type GtagEvent = {
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

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[][];
  }
}

type UiInteraction = {
  interaction_type: 'click' | 'change';
  ui_area: string;
  ui_control: string;
  element_type: string;
  tool?: string;
  link_path?: string;
  link_domain?: string;
};

export type SaasEventName =
  | 'pricing_view'
  | 'plan_interval_changed'
  | 'beta_intent'
  | 'beta_joined'
  | 'checkout_start'
  | 'checkout_error'
  | 'subscription_success'
  | 'limit_reached';

function sendEvent(
  eventName: string,
  parameters: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${eventName} ${JSON.stringify(parameters)}`);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag || ((...args: unknown[]) => window.dataLayer?.push(args));
  window.gtag('event', eventName, parameters);
}

export function trackEvent(event: GtagEvent): void {
  const eventName = `subtitleops_${event.action}`;
  const parameters: Record<string, unknown> = { ...event };
  delete parameters.action;
  sendEvent(eventName, parameters);
}

export function trackUiInteraction(event: UiInteraction): void {
  sendEvent('subtitleops_ui_interaction', event);
}

export function trackSaasEvent(
  eventName: SaasEventName,
  parameters: Record<string, unknown> = {}
): void {
  sendEvent(`subtitleops_${eventName}`, parameters);
}
