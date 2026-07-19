const BASE_URL = 'https://subtitleops.com';

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function homepageJsonLd(_faqs: { question: string; answer: string }[]) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'SubtitleOps',
      alternateName: 'Subtitle Ops',
      url: BASE_URL,
      description:
        'Convert SRT, ASS, VTT, TXT, and SBV subtitles in your browser. Free tools for format conversion, text extraction, timing shift, and FPS fixes.',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'SubtitleOps',
      url: BASE_URL,
      logo: `${BASE_URL}/logo-512.png`,
    },
  ];
}

export function toolPageJsonLd({
  name,
  description,
  url,
  faqs: _faqs,
}: {
  name: string;
  description: string;
  url: string;
  faqs: { question: string; answer: string }[];
}) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name,
      description,
      url: `${BASE_URL}${url}`,
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Any (Web Browser)',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Tools',
          item: `${BASE_URL}/tools`,
        },
        { '@type': 'ListItem', position: 3, name, item: `${BASE_URL}${url}` },
      ],
    },
  ];
}

export function toolsItemListJsonLd(
  tools: { name: string; description: string; href: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'SubtitleOps subtitle tools',
    itemListElement: tools.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${BASE_URL}${tool.href}`,
      name: tool.name,
      description: tool.description,
    })),
  };
}

export function blogPostJsonLd({
  headline,
  description,
  url,
  image,
  datePublished,
  dateModified,
}: {
  headline: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    url: `${BASE_URL}${url}`,
    image: `${BASE_URL}${image}`,
    datePublished,
    dateModified,
    author: { '@type': 'Organization', name: 'SubtitleOps', url: BASE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'SubtitleOps',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo-512.png`,
        width: 512,
        height: 512,
      },
    },
  };
}
