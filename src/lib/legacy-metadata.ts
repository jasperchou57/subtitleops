const BASE_URL = 'https://subtitleops.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/icon.svg`;

export type LegacyMetadata = {
  title?: string;
  description?: string;
  keywords?: string[];
  alternates?: { canonical?: string };
  openGraph?: {
    description?: string;
    title?: string;
    type?: string;
    url?: string;
  };
  robots?: { follow?: boolean; index?: boolean };
};

function absoluteUrl(value: string) {
  if (value === '/') return BASE_URL;
  return value.startsWith('http') ? value : `${BASE_URL}${value}`;
}

export function legacyHead(metadata: LegacyMetadata, fallbackPath: string) {
  const rawTitle = metadata.title ?? 'Free Online Subtitle Converter & Tools';
  const title = rawTitle.includes('SubtitleOps')
    ? rawTitle
    : `${rawTitle} | SubtitleOps`;
  const description = metadata.description ?? '';
  const canonical = absoluteUrl(metadata.alternates?.canonical ?? fallbackPath);
  const ogUrl = absoluteUrl(metadata.openGraph?.url ?? fallbackPath);

  return {
    meta: [
      { title },
      { name: 'description', content: description },
      ...(metadata.keywords?.length
        ? [{ name: 'keywords', content: metadata.keywords.join(', ') }]
        : []),
      { property: 'og:type', content: metadata.openGraph?.type ?? 'website' },
      { property: 'og:site_name', content: 'SubtitleOps' },
      { property: 'og:title', content: metadata.openGraph?.title ?? title },
      {
        property: 'og:description',
        content: metadata.openGraph?.description ?? description,
      },
      { property: 'og:url', content: ogUrl },
      { property: 'og:image', content: DEFAULT_OG_IMAGE },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: metadata.openGraph?.title ?? title },
      {
        name: 'twitter:description',
        content: metadata.openGraph?.description ?? description,
      },
      { name: 'twitter:image', content: DEFAULT_OG_IMAGE },
      ...(metadata.robots
        ? [
            {
              name: 'robots',
              content: `${metadata.robots.index === false ? 'noindex' : 'index'},${metadata.robots.follow === false ? 'nofollow' : 'follow'}`,
            },
          ]
        : []),
    ],
    links: [{ rel: 'canonical', href: canonical }],
  };
}
