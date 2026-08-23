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
      '@id': `${BASE_URL}#website`,
      name: 'SubtitleOps',
      alternateName: ['subtitleops.com'],
      url: BASE_URL,
      description:
        'Convert, extract, create, and fix subtitle files with clear results and a path from one-file tasks to repeat workflows.',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${BASE_URL}#organization`,
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
      '@id': `${BASE_URL}${url}#software`,
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
      '@id': `${BASE_URL}${url}#breadcrumb`,
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
    '@id': `${BASE_URL}/tools#tool-list`,
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

export function toolsPageJsonLd(
  tools: { name: string; description: string; href: string }[]
) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${BASE_URL}/tools#page`,
      name: 'Subtitle Tools for Conversion, Text and Timing',
      description:
        'Choose a SubtitleOps tool to convert formats, extract text, create an SRT draft, or fix subtitle timing.',
      url: `${BASE_URL}/tools`,
      mainEntity: { '@id': `${BASE_URL}/tools#tool-list` },
    },
    toolsItemListJsonLd(tools),
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${BASE_URL}/tools#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Tools',
          item: `${BASE_URL}/tools`,
        },
      ],
    },
  ];
}

export function pricingPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${BASE_URL}/pricing#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Pricing',
        item: `${BASE_URL}/pricing`,
      },
    ],
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
