const BASE_URL = 'https://subtitleops.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og/subtitleops-tools.png`;

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
    image?: string;
    imageAlt?: string;
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
  const image = absoluteUrl(metadata.openGraph?.image ?? DEFAULT_OG_IMAGE);
  const imageAlt =
    metadata.openGraph?.imageAlt ?? 'SubtitleOps browser-based subtitle tools';
  const robots = metadata.robots
    ? `${metadata.robots.index === false ? 'noindex' : 'index'}, ${metadata.robots.follow === false ? 'nofollow' : 'follow'}, max-image-preview:large`
    : 'index, follow, max-image-preview:large';

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
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: imageAlt },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: metadata.openGraph?.title ?? title },
      {
        name: 'twitter:description',
        content: metadata.openGraph?.description ?? description,
      },
      { name: 'twitter:image', content: image },
      { name: 'twitter:image:alt', content: imageAlt },
      { name: 'robots', content: robots },
    ],
    links: [{ rel: 'canonical', href: canonical }],
  };
}
