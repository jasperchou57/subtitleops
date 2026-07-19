import { describe, expect, it } from 'vitest';
import { blogPostJsonLd, homepageJsonLd, toolPageJsonLd } from './json-ld';

describe('public structured data', () => {
  it('uses supported homepage entities without deprecated FAQ markup', () => {
    const data = homepageJsonLd([]);
    expect(data.map((entry) => entry['@type'])).toEqual([
      'WebSite',
      'Organization',
    ]);
  });

  it('keeps tool data truthful without invented ratings', () => {
    const data = toolPageJsonLd({
      name: 'SRT to VTT Converter',
      description: 'Convert SRT to VTT.',
      url: '/tools/srt-to-vtt',
      faqs: [],
    });
    expect(data.map((entry) => entry['@type'])).toEqual([
      'SoftwareApplication',
      'BreadcrumbList',
    ]);
    expect(data[0]).not.toHaveProperty('aggregateRating');
    expect(data[0]).not.toHaveProperty('review');
  });

  it('includes the article image and real modification date', () => {
    const data = blogPostJsonLd({
      headline: 'What Is an SRT File?',
      description: 'An SRT guide.',
      url: '/blog/what-is-srt-file',
      image: '/og/what-is-srt.png',
      datePublished: '2026-03-30',
      dateModified: '2026-07-19',
    });
    expect(data).toMatchObject({
      '@type': 'BlogPosting',
      image: 'https://subtitleops.com/og/what-is-srt.png',
      datePublished: '2026-03-30',
      dateModified: '2026-07-19',
    });
  });
});
