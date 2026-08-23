import { describe, expect, it } from 'vitest';
import {
  blogPostJsonLd,
  homepageJsonLd,
  pricingPageJsonLd,
  toolPageJsonLd,
  toolsPageJsonLd,
} from './json-ld';

describe('public structured data', () => {
  it('uses supported homepage entities without deprecated FAQ markup', () => {
    const data = homepageJsonLd([]);
    expect(data.map((entry) => entry['@type'])).toEqual([
      'WebSite',
      'Organization',
    ]);
    expect(data[0]).toMatchObject({
      name: 'SubtitleOps',
      alternateName: ['subtitleops.com'],
      '@id': 'https://subtitleops.com#website',
    });
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
    expect(data[0]).toMatchObject({
      '@id': 'https://subtitleops.com/tools/srt-to-vtt#software',
      offers: { price: '0', priceCurrency: 'USD' },
    });
  });

  it('describes the tools hub as a collection with a visible hierarchy', () => {
    const data = toolsPageJsonLd([
      {
        name: 'SRT to TXT',
        description: 'Extract clean text.',
        href: '/tools/srt-to-txt',
      },
    ]);

    expect(data.map((entry) => entry['@type'])).toEqual([
      'CollectionPage',
      'ItemList',
      'BreadcrumbList',
    ]);
    expect(data[0]).toMatchObject({
      mainEntity: { '@id': 'https://subtitleops.com/tools#tool-list' },
    });
  });

  it('uses only a breadcrumb for pricing while paid plans are in beta', () => {
    const data = pricingPageJsonLd();
    expect(data).toMatchObject({
      '@type': 'BreadcrumbList',
      '@id': 'https://subtitleops.com/pricing#breadcrumb',
      itemListElement: [
        { position: 1, name: 'Home', item: 'https://subtitleops.com' },
        {
          position: 2,
          name: 'Pricing',
          item: 'https://subtitleops.com/pricing',
        },
      ],
    });
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
