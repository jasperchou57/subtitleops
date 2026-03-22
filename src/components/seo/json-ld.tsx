const BASE_URL = "https://subtitleops.com";

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

export function homepageJsonLd(faqs: { question: string; answer: string }[]) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "SubtitleOps",
      url: BASE_URL,
      description:
        "Convert subtitle files between SRT, ASS, VTT, and TXT in your browser. Free online subtitle converter for format conversion and transcript extraction.",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "SubtitleOps",
      url: BASE_URL,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];
}

export function toolPageJsonLd({
  name,
  description,
  url,
  faqs,
}: {
  name: string;
  description: string;
  url: string;
  faqs: { question: string; answer: string }[];
}) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name,
      description,
      url: `${BASE_URL}${url}`,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any (Web Browser)",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Tools", item: `${BASE_URL}/tools` },
        { "@type": "ListItem", position: 3, name, item: `${BASE_URL}${url}` },
      ],
    },
  ];
}

export function blogPostJsonLd({
  headline,
  description,
  url,
  datePublished,
}: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description,
    url: `${BASE_URL}${url}`,
    datePublished,
    author: { "@type": "Organization", name: "SubtitleOps", url: BASE_URL },
    publisher: { "@type": "Organization", name: "SubtitleOps", url: BASE_URL },
  };
}
