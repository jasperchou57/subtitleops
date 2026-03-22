import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Subtitle Tools Blog — Guides, Tips & Format Explanations",
  description:
    "Learn about subtitle formats, conversion workflows, and best practices for working with SRT, ASS, VTT, and TXT subtitle files.",
  alternates: { canonical: "/blog" },
  openGraph: { url: "/blog" },
};

const posts = [
  {
    slug: "ass-vs-srt-when-to-convert",
    title: "ASS vs SRT — When Should You Convert and When Should You Keep the Original?",
    excerpt:
      "ASS subtitle files carry rich styling that SRT cannot represent. This guide explains when converting ASS to SRT makes sense and when keeping the original format is the better choice.",
    date: "2026-03-22",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
        Subtitle Tools Blog
      </h1>
      <p className="text-muted-foreground mb-12">
        Guides, tips, and format explanations for working with subtitle files.
      </p>

      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/blog/${post.slug}`} title={post.title} className="block">
              <time className="text-xs text-muted-foreground">{post.date}</time>
              <h2 className="text-xl font-semibold mt-1 group-hover:underline underline-offset-4">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
