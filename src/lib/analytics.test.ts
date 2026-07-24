import { beforeEach, describe, expect, it, vi } from 'vitest';
import { toAnalyticsId, trackEvent, trackUiInteraction } from '@/lib/analytics';

describe('analytics', () => {
  const gtag = vi.fn();

  beforeEach(() => {
    gtag.mockReset();
    vi.stubGlobal('window', {
      dataLayer: [],
      gtag,
      location: { pathname: '/tools/srt-to-vtt' },
    });
  });

  it('normalizes stable analytics identifiers', () => {
    expect(toAnalyticsId(' Pricing / Pro CTA ')).toBe('pricing_pro_cta');
  });

  it('emits the Grid Maker-style tool funnel without trace IDs', () => {
    trackEvent({
      tool: 'srt-to-vtt',
      action: 'file_upload',
      input_format: 'srt',
      output_format: 'vtt',
      file_size: 1200,
      trace_id: 'local-debug-only',
    });
    trackEvent({
      tool: 'srt-to-vtt',
      action: 'convert_success',
      output_format: 'vtt',
      entry_count: 12,
      trace_id: 'local-debug-only',
    });
    trackEvent({
      tool: 'srt-to-vtt',
      action: 'file_download',
      output_format: 'vtt',
    });

    expect(gtag.mock.calls.map((call) => call[1])).toEqual([
      'tool_start',
      'file_upload',
      'preview_ready',
      'file_download',
    ]);
    expect(gtag.mock.calls[1][2]).toMatchObject({
      tool_id: 'srt_to_vtt',
      page_path: '/tools/srt-to-vtt',
      input_format: 'srt',
      output_format: 'vtt',
    });
    expect(gtag.mock.calls[1][2]).not.toHaveProperty('trace_id');
  });

  it('uses ui_click with stable location parameters', () => {
    trackUiInteraction({
      element_id: 'pricing_pro_checkout',
      element_type: 'button',
      ui_area: 'pricing',
      page_path: '/pricing',
      destination_path: '/auth/login',
    });

    expect(gtag).toHaveBeenCalledWith('event', 'ui_click', {
      element_id: 'pricing_pro_checkout',
      element_type: 'button',
      ui_area: 'pricing',
      page_path: '/pricing',
      destination_path: '/auth/login',
    });
  });
});
