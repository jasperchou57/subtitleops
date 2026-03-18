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
      url,
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
        { "@type": "ListItem", position: 1, name: "Home", item: "https://subtitleops.com" },
        { "@type": "ListItem", position: 2, name: "Tools", item: "https://subtitleops.com/tools" },
        { "@type": "ListItem", position: 3, name, item: `https://subtitleops.com${url}` },
      ],
    },
  ];
}
