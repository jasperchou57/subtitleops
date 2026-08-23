import { describe, expect, it } from 'vitest';
import { legacyHead } from './legacy-metadata';

describe('legacyHead', () => {
  it('adds the SubtitleOps brand and a self-canonical', () => {
    const head = legacyHead(
      {
        title: 'SRT to TXT Converter — Clean Transcript',
        description: 'Extract clean text from SRT.',
        alternates: { canonical: '/tools/srt-to-txt' },
      },
      '/tools/srt-to-txt'
    );

    expect(head.meta[0]).toEqual({
      title: 'SRT to TXT Converter — Clean Transcript | SubtitleOps',
    });
    expect(head.meta).toContainEqual({
      property: 'og:site_name',
      content: 'SubtitleOps',
    });
    expect(head.links).toEqual([
      {
        rel: 'canonical',
        href: 'https://subtitleops.com/tools/srt-to-txt',
      },
    ]);
  });

  it('does not duplicate the SubtitleOps brand', () => {
    const head = legacyHead({ title: 'About SubtitleOps' }, '/about');
    expect(head.meta[0]).toEqual({ title: 'About SubtitleOps' });
  });
});
