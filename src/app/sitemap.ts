import type { MetadataRoute } from "next";

const BASE_URL = "https://subtitleops.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = [
    "/tools/ass-to-srt",
    "/tools/vtt-to-srt",
    "/tools/txt-to-srt",
    "/tools/srt-to-vtt",
    "/tools/srt-to-txt",
  ];

  const blogPosts = [
    "/blog/ass-vs-srt-when-to-convert",
  ];

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...tools.map((tool) => ({
      url: `${BASE_URL}${tool}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...blogPosts.map((post) => ({
      url: `${BASE_URL}${post}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
